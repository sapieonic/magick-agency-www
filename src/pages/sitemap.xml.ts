/** /sitemap.xml — built from site data. */
import type { APIRoute } from 'astro'
import { HOME_UPDATED, SITE, USE_CASES, absUrl, useCasePath } from '@/data/site'
import { textResponse } from '@/lib/text'

type Entry = {
  path: string
  changefreq: string
  priority: string
  lastmod?: string
  image?: { loc: string; title: string }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const GET: APIRoute = () => {
  const ENTRIES: Entry[] = [
    {
      path: '/',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: HOME_UPDATED,
      image: { loc: SITE.ogImage, title: SITE.title },
    },
    { path: '/use-cases', changefreq: 'monthly', priority: '0.8' },
    ...USE_CASES.map((u) => ({ path: useCasePath(u.slug), changefreq: 'monthly', priority: '0.8' })),
    { path: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: SITE.legalUpdated },
    { path: '/terms', changefreq: 'yearly', priority: '0.3', lastmod: SITE.legalUpdated },
  ]

  const urls = ENTRIES.map((e) => {
    const loc = absUrl(e.path)
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${e.lastmod ?? SITE.lastUpdated}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />${
      e.image
        ? `
    <image:image>
      <image:loc>${absUrl(e.image.loc)}</image:loc>
      <image:title>${esc(e.image.title)}</image:title>
    </image:image>`
        : ''
    }
  </url>`
  }).join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
  return textResponse(body, 'application/xml')
}
