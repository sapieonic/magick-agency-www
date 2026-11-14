/**
 * /llms-full.txt — the complete factual reference for Magick Agency in one
 * markdown document, for LLMs that want everything without crawling.
 */
import type { APIRoute } from 'astro'
import {
  AI_ANALYSIS,
  COMPARISON,
  CONSOLE_SCREENS,
  CONTACT,
  CONTACT_LINKS,
  FAQS,
  FEATURES,
  HOME_UPDATED,
  INDUSTRIES,
  KEY_FACTS,
  LINKS,
  MOBILE,
  PARENT,
  SITE,
  STATS,
  STEPS,
  TRUST,
  USE_CASES,
  absUrl,
  useCasePath,
} from '@/data/site'
import { bullets, textResponse } from '@/lib/text'

export const GET: APIRoute = () => {
  const cols = COMPARISON.columns
  const table = [
    `| Capability | ${cols.join(' | ')} |`,
    `| --- | ${cols.map(() => '---').join(' | ')} |`,
    ...COMPARISON.rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n')

  const body = `# ${SITE.name} — complete reference

> ${SITE.definition}

Also written as: ${SITE.alternateNames.join(', ')} (the correct name is ${SITE.name})
Website: ${absUrl('/')}
Company: ${PARENT.name} (${SITE.legalName}), India, ${PARENT.url}
Company profiles: ${PARENT.profiles.join(', ')}
Last updated: ${HOME_UPDATED}

## Summary

${SITE.description}

## Key facts

${bullets(KEY_FACTS)}

## In numbers

${STATS.map((s) => `- ${s.value}: ${s.label.toLowerCase()}`).join('\n')}

## The console

${bullets(CONSOLE_SCREENS.map((t) => [t.label, t.text]))}

## Features

${FEATURES.map((f) => `### ${f.title}\n\n${f.description}`).join('\n\n')}

## AI analysis of each call

${bullets(AI_ANALYSIS.map((a) => [a.title, a.detail]))}

Agent scorecards compare each agent's connect rate, success rate, occupancy and handling time with the 25th percentile, median and 75th percentile of their own floor. Insights also show a leaderboard and the best hours to call.

## Mobile app (Android and iOS)

${bullets(MOBILE.points.map((p) => [p.title, p.detail]))}

For any size of team:
${bullets(MOBILE.sizes.map((s) => [s.title, s.detail]))}

## How it works

${STEPS.map((s, i) => `${i + 1}. **${s.title}** — ${s.detail}`).join('\n')}

## Use cases

${USE_CASES.map(
  (u) => `### ${u.title}

URL: ${absUrl(useCasePath(u.slug))}

${u.intro}

How Magick Agency helps:
${u.helps.map((a) => `- ${a}`).join('\n')}

How it works:
${u.flow.map((f, i) => `${i + 1}. ${f.title} — ${f.detail}`).join('\n')}

Popular with: ${u.industries.join(', ')}

${u.faqs.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}`,
).join('\n\n')}

## Security

${bullets(TRUST.map((t) => [t.title, t.detail]))}

## Industries served

${bullets(INDUSTRIES.map((i) => [i.name, i.detail]))}

## How ${SITE.name} compares

${table}

## Frequently asked questions

${FAQS.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Contact

- Sales: ${CONTACT.salesEmail}
- General: ${CONTACT.infoEmail}
- Book a demo: ${absUrl(CONTACT_LINKS.demo)}
- Console sign-in: ${LINKS.app}
`
  return textResponse(body)
}
