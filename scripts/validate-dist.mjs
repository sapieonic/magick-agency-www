/**
 * Validates the built site in dist/ — run after `astro build`.
 *
 *   node scripts/validate-dist.mjs [distDir]
 *
 * Fails (exit 1) on anything that would hurt search, AI crawlers or load time:
 *   - SEO: title/description length, one <h1>, canonical, Open Graph, valid JSON-LD
 *   - Content: images without alt or dimensions, broken internal links and #anchors
 *   - Crawl files: sitemap URLs exist, every indexable page is in the sitemap,
 *     robots.txt points at the sitemap, llms.txt / llms-full.txt are present
 *   - Performance budgets (gzipped): HTML, CSS and initial JS per page, font preloads,
 *     and image file sizes
 */
import fs from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { ORIGIN } from '../src/data/origin.mjs'

const DIST = path.resolve(process.argv[2] ?? 'dist')
const ORIGIN_RE = ORIGIN.replace(/[.]/g, '\\.')
// The apex 301s to www (and drops the query string on the way), so nothing we build may link to it.
const APEX_URL = /https?:\/\/magick-agency\.com(?![\w.-])/

/** Budgets in bytes (gzipped unless noted). Raise deliberately, never silently. */
const BUDGET = {
  htmlGzip: 40 * 1024,
  cssGzip: 20 * 1024,
  initialJsGzip: 25 * 1024,
  fontPreloads: 2,
  imageRaw: 200 * 1024,
}

const errors = []
const warnings = []
const fail = (file, msg) => errors.push(`${file}: ${msg}`)
const warn = (file, msg) => warnings.push(`${file}: ${msg}`)

const walk = (dir, out = []) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

if (!fs.existsSync(DIST)) {
  console.error(`No build found at ${DIST}. Run \`npm run build\` first.`)
  process.exit(1)
}

const files = walk(DIST)
const htmlFiles = files.filter((f) => f.endsWith('.html')).sort()
const rel = (f) => '/' + path.relative(DIST, f)
const read = (f) => fs.readFileSync(f, 'utf8')
const gz = (buf) => gzipSync(buf).length
const kb = (n) => `${(n / 1024).toFixed(1)} KB`

/** Map a URL path (as linked on the site, clean URLs) to a built file. */
const resolvePath = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0])
  if (clean === '' || clean === '/') return path.join(DIST, 'index.html')
  const candidates = [clean, `${clean}.html`, path.join(clean, 'index.html')]
  return candidates.map((c) => path.join(DIST, c)).find((p) => fs.existsSync(p) && fs.statSync(p).isFile())
}

/** Lengths are what searchers see, so count `&amp;` as one character. */
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => (parseInt(h, 16) <= 0x10ffff ? String.fromCodePoint(parseInt(h, 16)) : m))
    .replace(/&#(\d+);/g, (m, d) => (Number(d) <= 0x10ffff ? String.fromCodePoint(Number(d)) : m))
    .replace(/&(lt|gt|quot|apos|amp);/g, (_, e) => ({ lt: '<', gt: '>', quot: '"', apos: "'", amp: '&' })[e])
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]
const metaContent = (html, key, value) =>
  [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => m[0]).find((t) => attr(t, key) === value)
const idsOf = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))

const pages = new Map(htmlFiles.map((f) => [f, read(f)]))
const indexable = []

// Collect static JS imports so "initial JS" includes chunks a module script pulls in eagerly.
const jsWithStaticImports = (file, seen = new Set()) => {
  if (seen.has(file) || !fs.existsSync(file)) return seen
  seen.add(file)
  const src = read(file)
  for (const m of src.matchAll(/(?:^|[;\s])import\s*(?:[^'"()]*?from\s*)?["'](\.{1,2}\/[^"']+\.js)["']/g)) {
    jsWithStaticImports(path.join(path.dirname(file), m[1]), seen)
  }
  return seen
}

for (const [file, html] of pages) {
  const page = rel(file)
  const robots = metaContent(html, 'name', 'robots')
  const noindex = robots ? /noindex/.test(attr(robots, 'content') ?? '') : false
  const isErrorPage = /\/(404|500)\.html$/.test(page)

  // ---- SEO -----------------------------------------------------------------
  if (!/<html\b[^>]*\blang="[a-z]{2}/.test(html)) fail(page, '<html> is missing a lang attribute')

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '')
  if (!title) fail(page, 'missing <title>')
  else if (title.length < 20 || title.length > 70) fail(page, `title is ${title.length} chars (want 20–70): "${title}"`)

  const description = decode(attr(metaContent(html, 'name', 'description') ?? '', 'content') ?? '')
  if (!description) fail(page, 'missing meta description')
  else if (description.length < 70 || description.length > 170)
    fail(page, `meta description is ${description.length} chars (want 70–170)`)

  const h1s = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1s !== 1) fail(page, `expected exactly one <h1>, found ${h1s}`)

  const canonicalTag = html.match(/<link rel="canonical"[^>]*>/)?.[0]
  const canonical = canonicalTag && attr(canonicalTag, 'href')
  if (noindex) {
    if (!isErrorPage) warn(page, 'page is noindex')
  } else {
    indexable.push(page)
    if (!canonical) fail(page, 'missing canonical link')
    else if (!canonical.startsWith(`${ORIGIN}/`)) fail(page, `canonical is not on ${ORIGIN}: ${canonical}`)
    for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
      if (!metaContent(html, 'property', prop)) fail(page, `missing <meta property="${prop}">`)
    }
    const ogImage = attr(metaContent(html, 'property', 'og:image') ?? '', 'content')
    if (ogImage?.startsWith(ORIGIN) && !resolvePath(ogImage.slice(ORIGIN.length)))
      fail(page, `og:image file not in build: ${ogImage}`)
  }

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1])
  if (!noindex && jsonLd.length === 0) fail(page, 'no JSON-LD structured data')
  for (const block of jsonLd) {
    try {
      const data = JSON.parse(block)
      const nodes = data['@graph'] ?? [data]
      if (data['@context'] !== 'https://schema.org') fail(page, 'JSON-LD @context should be https://schema.org')
      if (!nodes.every((n) => n['@type'])) fail(page, 'JSON-LD node without @type')
    } catch (e) {
      fail(page, `invalid JSON-LD: ${e.message}`)
    }
  }

  // ---- Content -------------------------------------------------------------
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    const src = attr(img, 'src') ?? '?'
    if (!/\balt(=|[\s>/])/.test(img)) fail(page, `<img> without alt: ${src}`)
    if (!attr(img, 'width') || !attr(img, 'height')) fail(page, `<img> without width/height (layout shift): ${src}`)
  }

  const ids = idsOf(html)
  for (const [, href] of html.matchAll(/\bhref="([^"]+)"/g)) {
    if (href.startsWith('#')) {
      if (href.length > 1 && !ids.has(href.slice(1))) fail(page, `broken in-page anchor ${href}`)
      continue
    }
    const local = href.startsWith(ORIGIN) ? href.slice(ORIGIN.length) || '/' : href
    if (!local.startsWith('/') || local.startsWith('//')) continue
    const target = resolvePath(local)
    if (!target) {
      fail(page, `broken internal link ${href}`)
      continue
    }
    const hash = local.split('#')[1]
    if (hash && target.endsWith('.html') && !idsOf(pages.get(target) ?? read(target)).has(hash))
      fail(page, `broken anchor ${href} (no id="${hash}" on target page)`)
  }

  // ---- Performance budgets ---------------------------------------------------
  const htmlGz = gz(Buffer.from(html))
  if (htmlGz > BUDGET.htmlGzip) fail(page, `HTML is ${kb(htmlGz)} gzipped (budget ${kb(BUDGET.htmlGzip)})`)

  const cssFiles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]
    .map((m) => attr(m[0], 'href'))
    .filter((h) => h?.startsWith('/'))
  const inlineCss = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('')
  const cssGz = gz(Buffer.concat([Buffer.from(inlineCss), ...cssFiles.map((h) => fs.readFileSync(resolvePath(h)))]))
  if (cssGz > BUDGET.cssGzip) fail(page, `CSS is ${kb(cssGz)} gzipped (budget ${kb(BUDGET.cssGzip)})`)

  const jsEntries = [...html.matchAll(/<script\b[^>]*\bsrc="(\/[^"]+\.js)"[^>]*>/g)].map((m) => resolvePath(m[1]))
  const jsFiles = new Set()
  for (const entry of jsEntries.filter(Boolean)) jsWithStaticImports(entry, jsFiles)
  const jsGz = gz(Buffer.concat([...jsFiles].map((f) => fs.readFileSync(f))))
  if (jsGz > BUDGET.initialJsGzip) fail(page, `initial JS is ${kb(jsGz)} gzipped (budget ${kb(BUDGET.initialJsGzip)})`)

  const fontPreloads = (html.match(/<link\b[^>]*rel="preload"[^>]*as="font"/g) ?? []).length
  if (fontPreloads > BUDGET.fontPreloads)
    fail(page, `${fontPreloads} font preloads (budget ${BUDGET.fontPreloads}) — each one delays first paint`)

  if (!isErrorPage) {
    console.log(
      `  ${page.padEnd(44)} html ${kb(htmlGz).padStart(8)}  css ${kb(cssGz).padStart(8)}  js ${kb(jsGz).padStart(8)}`,
    )
  }
}

// ---- Images ------------------------------------------------------------------
for (const f of files.filter((f) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f))) {
  const size = fs.statSync(f).size
  if (size > BUDGET.imageRaw) fail(rel(f), `image is ${kb(size)} (budget ${kb(BUDGET.imageRaw)})`)
}

// ---- Crawl files ---------------------------------------------------------------
const sitemapFile = path.join(DIST, 'sitemap.xml')
if (!fs.existsSync(sitemapFile)) fail('/sitemap.xml', 'missing')
else {
  const locs = [...read(sitemapFile).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const sitemapPages = new Set()
  for (const loc of locs) {
    if (!loc.startsWith(ORIGIN)) {
      fail('/sitemap.xml', `URL not on ${ORIGIN}: ${loc}`)
      continue
    }
    const target = resolvePath(loc.slice(ORIGIN.length) || '/')
    if (!target) fail('/sitemap.xml', `URL has no page in the build: ${loc}`)
    else sitemapPages.add(rel(target))
  }
  for (const page of indexable) if (!sitemapPages.has(page)) fail(page, 'indexable page is missing from sitemap.xml')
}

const robotsFile = path.join(DIST, 'robots.txt')
if (!fs.existsSync(robotsFile)) fail('/robots.txt', 'missing')
else if (!read(robotsFile).includes(`Sitemap: ${ORIGIN}/sitemap.xml`))
  fail('/robots.txt', 'does not reference the sitemap')

for (const name of ['llms.txt', 'llms-full.txt']) {
  const f = path.join(DIST, name)
  if (!fs.existsSync(f)) {
    fail(`/${name}`, 'missing')
    continue
  }
  const text = read(f)
  if (text.length < 500) fail(`/${name}`, `suspiciously short (${text.length} chars)`)
  // llms.txt uses markdown links; llms-full.txt uses `URL: …` lines.
  for (const [, url] of text.matchAll(new RegExp(`(?:\\]\\(|URL: )(${ORIGIN_RE}[^)\\s]*)`, 'g'))) {
    if (!resolvePath(url.slice(ORIGIN.length) || '/')) fail(`/${name}`, `links to a page not in the build: ${url}`)
  }
}

// No built page, feed or crawl file may link to the apex (it redirects to www).
for (const file of files.filter((f) => /\.(html|xml|txt)$/.test(f))) {
  const m = read(file).match(APEX_URL)
  if (m) fail(rel(file), `links to the apex host (${m[0]}); use ${ORIGIN}`)
}

// ---- Report ----------------------------------------------------------------------
for (const w of warnings) console.warn(`⚠ ${w}`)
if (errors.length) {
  console.error(`\n✖ ${errors.length} problem(s):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`\n✔ ${htmlFiles.length} pages validated — SEO, links, sitemap, llms.txt and budgets all pass`)
