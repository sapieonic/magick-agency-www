/**
 * /robots.txt — open to search engines and AI assistants (so Magick Agency can
 * be found and cited), closed to SEO scrapers that only burn crawl budget.
 */
import type { APIRoute } from 'astro'
import { SITE, absUrl } from '@/data/site'
import { textResponse } from '@/lib/text'

const SEARCH = ['Googlebot', 'Googlebot-Image', 'Bingbot', 'DuckDuckBot', 'Slurp', 'Applebot', 'YandexBot']

// AI search, assistants and training crawlers — explicitly welcome for GEO.
const AI = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
  'cohere-ai',
  'YouBot',
  'CCBot',
]

const BLOCKED = ['SemrushBot', 'AhrefsBot', 'MJ12bot', 'DotBot', 'PetalBot']

export const GET: APIRoute = () => {
  const group = (agents: string[], rule: string) => agents.map((a) => `User-agent: ${a}`).join('\n') + `\n${rule}\n`

  const body = `# ${SITE.name} — ${SITE.url}
# Summary for LLMs: ${absUrl('/llms.txt')}
# Full reference for LLMs: ${absUrl('/llms-full.txt')}

User-agent: *
Allow: /

# Search engines
${group(SEARCH, 'Allow: /')}
# AI search & assistants
${group(AI, 'Allow: /')}
# SEO scrapers
${group(BLOCKED, 'Disallow: /')}
Sitemap: ${absUrl('/sitemap.xml')}
`
  return textResponse(body)
}
