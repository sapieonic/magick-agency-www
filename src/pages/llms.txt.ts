/**
 * /llms.txt — a concise, markdown summary of Magick Agency for LLMs and AI
 * search engines (https://llmstxt.org). Generated from src/data/site.ts so it
 * never drifts from the website.
 */
import type { APIRoute } from 'astro'
import {
  CONTACT,
  CONTACT_LINKS,
  KEY_FACTS,
  LINKS,
  PARENT,
  PROFILES,
  SITE,
  TRUST,
  USE_CASES,
  absUrl as url,
  useCasePath,
} from '@/data/site'
import { bullets, textResponse } from '@/lib/text'

export const GET: APIRoute = () => {
  const body = `# ${SITE.name}

> ${SITE.definition}

Sometimes written as ${SITE.alternateNames.join(', ')}; the correct name is ${SITE.name}.

${SITE.name} is operated by ${SITE.legalName} (India). Call centres, BPOs, collection agencies and telesales teams use it to dial contact lists for their human agents, keep to calling hours and Do Not Call lists, analyse every call with AI, compare each agent with the rest of the floor, and send PDF and Excel reports by email. Agents work from a browser or from the Android and iOS app.

Key facts:

${bullets(KEY_FACTS)}

Security:

${bullets(TRUST.map((t) => [t.title, t.detail]))}

## Pages

- [Home](${url('/')}): Overview — the console, features, AI insights, the mobile app, how it works, comparison, security and FAQ
- [AI insights](${url('/#ai')}): What the AI analysis of each call contains, and how agent scorecards work
- [Mobile app](${url('/#mobile')}): The Android and iOS app for agents
- [FAQ](${url('/#faq')}): Answers about dialling, abandoned calls, AI, reports, inbound, DNC and data storage
- [Use cases](${url('/use-cases')}): All use cases
${USE_CASES.map((u) => `- [${u.title}](${url(useCasePath(u.slug))}): ${u.short}`).join('\n')}
- [Full reference for LLMs](${url('/llms-full.txt')}): Every fact, feature, use case and FAQ in one plain-text file

## Product

- [Book a demo](${url(CONTACT_LINKS.demo)}): Pricing is on request; a demo is the way to start
- [Sign in](${LINKS.app}): The Magick Agency console for existing customers

## Contact

- [Sales](mailto:${CONTACT.salesEmail}): ${CONTACT.salesEmail}
- [General enquiries](mailto:${CONTACT.infoEmail}): ${CONTACT.infoEmail}
${PROFILES.length ? `\nOfficial profiles:\n\n${PROFILES.map((p) => `- ${p}`).join('\n')}\n` : ''}
## Company

Magick Agency is made by ${PARENT.name} (${SITE.legalName}).

- [${PARENT.name}](${PARENT.url}): The company's main website
${PARENT.profiles.map((p) => `- ${p}`).join('\n')}

## Optional

- [Privacy policy](${url('/privacy')}): How we handle your data
- [Terms of service](${url('/terms')}): Accounts, acceptable use and liability
`
  return textResponse(body)
}
