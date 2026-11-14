/** Helpers for the generated plain-text files (llms.txt, llms-full.txt, robots.txt, sitemap.xml). */

export const textResponse = (body: string, type = 'text/plain') =>
  new Response(body, { headers: { 'Content-Type': `${type}; charset=utf-8` } })

/** Markdown bullets with a bold term: "- **Term:** detail". */
export const bullets = (rows: readonly (readonly [string, string])[]) =>
  rows.map(([term, detail]) => `- **${term}:** ${detail}`).join('\n')
