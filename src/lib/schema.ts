/**
 * schema.org JSON-LD builders. Every page emits one @graph that links back to
 * the shared Organization / WebSite / SoftwareApplication nodes by @id, so
 * search engines and LLMs resolve them as one entity.
 */
import { CONTACT, CONTACT_LINKS, FEATURES, KEY_FACTS, PROFILES, SITE, absUrl, useCasePath } from '@/data/site'

export const ORG_ID = absUrl('/#organization')
export const SITE_ID = absUrl('/#website')
export const APP_ID = absUrl('/#software')

type Node = Record<string, unknown>

export function organization(): Node {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: SITE.alternateNames,
    url: absUrl('/'),
    ...(PROFILES.length ? { sameAs: PROFILES } : {}),
    logo: {
      '@type': 'ImageObject',
      url: absUrl('/brand/logo-512.png'),
      width: 512,
      height: 582,
    },
    image: absUrl(SITE.ogImage),
    description: SITE.definition,
    email: CONTACT.infoEmail,
    address: { '@type': 'PostalAddress', addressCountry: SITE.country },
    areaServed: SITE.country,
    knowsAbout: [
      'Power dialer',
      'Auto dialer',
      'Outbound call centre software',
      'Call centre analytics',
      'AI call analysis',
      'Agent performance scorecards',
      'Debt collection calling',
      'Telesales',
      'BPO operations',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: CONTACT.salesEmail,
        contactType: 'sales',
        areaServed: SITE.country,
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  }
}

export function website(): Node {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: absUrl('/'),
    name: SITE.name,
    alternateName: SITE.alternateNames,
    description: SITE.description,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  }
}

export function software(): Node {
  return {
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: SITE.name,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Call centre power dialer',
    operatingSystem: 'Web, Android, iOS',
    url: absUrl('/'),
    image: absUrl(SITE.ogImage),
    screenshot: absUrl(SITE.ogImage),
    description: SITE.description,
    featureList: [...FEATURES.map((f) => `${f.title}: ${f.description}`), ...KEY_FACTS.map(([k, v]) => `${k}: ${v}`)],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      description: 'Pricing on request. Book a demo to get a quote for your team.',
      url: absUrl(CONTACT_LINKS.demo),
    },
    publisher: { '@id': ORG_ID },
    creator: { '@id': ORG_ID },
  }
}

export function webPage(opts: {
  path: string
  title: string
  description: string
  type?: string
  dateModified?: string
  /** Set false on pages whose graph doesn't include the SoftwareApplication node. */
  aboutProduct?: boolean
  breadcrumbs?: { name: string; path: string }[]
}): Node[] {
  const url = absUrl(opts.path)
  const graph: Node[] = [
    {
      '@type': opts.type ?? 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: opts.title,
      description: opts.description,
      inLanguage: 'en',
      isPartOf: { '@id': SITE_ID },
      ...(opts.aboutProduct === false ? {} : { about: { '@id': APP_ID } }),
      publisher: { '@id': ORG_ID },
      primaryImageOfPage: absUrl(SITE.ogImage),
      dateModified: opts.dateModified ?? SITE.lastUpdated,
      ...(opts.breadcrumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    },
  ]
  if (opts.breadcrumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: opts.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: absUrl(b.path),
      })),
    })
  }
  return graph
}

export function faqPage(path: string, faqs: readonly { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${absUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function useCaseList(id: string, items: readonly { slug: string; title: string; short: string }[]): Node {
  return {
    '@type': 'ItemList',
    '@id': id,
    name: `${SITE.name} use cases`,
    itemListElement: items.map((u, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: u.title,
      description: u.short,
      url: absUrl(useCasePath(u.slug)),
    })),
  }
}

export function graph(...nodes: (Node | Node[])[]) {
  return { '@context': 'https://schema.org', '@graph': nodes.flat() }
}

/** Serialise JSON-LD safely for inline <script> embedding. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
