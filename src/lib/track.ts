/**
 * Side-effect-free analytics API: GA4 (consent-mode gated in <head>) and
 * PostHog (loaded lazily, opted out until the visitor grants analytics consent
 * in CookieHub). Boot logic lives in src/scripts/boot.ts.
 */
import { SITE } from '@/data/site'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    cookiehub?: { hasConsented?: (category: string) => boolean }
  }
}

type Props = Record<string, string | number | boolean | undefined>
type PostHog = typeof import('posthog-js').default

const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY ?? ''
/** With no GA or PostHog id, the boot skips tracking, so web-vitals and PostHog are never fetched. */
export const ANALYTICS_ENABLED = Boolean(SITE.gaMeasurementId || POSTHOG_KEY)
const POSTHOG_HOST = import.meta.env.PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

/**
 * Only production traffic reaches PostHog — never localhost or preview deploys.
 * Accepts both www and the apex, so a host redirect flipping one day can't silently switch analytics off.
 */
const PRODUCTION_HOSTS = (() => {
  const host = new URL(SITE.url).hostname.replace(/^www\./, '')
  return [host, `www.${host}`]
})()
const isProductionHost = () => PRODUCTION_HOSTS.includes(location.hostname)

let posthog: PostHog | null = null
const queue: Array<(ph: PostHog) => void> = []

function withPostHog(fn: (ph: PostHog) => void) {
  if (!POSTHOG_KEY || !isProductionHost()) return
  if (posthog) fn(posthog)
  else queue.push(fn)
}

function hasAnalyticsConsent(): boolean {
  try {
    return window.cookiehub?.hasConsented?.('analytics') === true
  } catch {
    return false
  }
}

/** Apply the visitor's current CookieHub choice to PostHog. */
export function syncConsent() {
  if (!posthog) return
  if (hasAnalyticsConsent()) {
    if (posthog.has_opted_out_capturing()) {
      posthog.set_config({ persistence: 'localStorage+cookie' })
      posthog.opt_in_capturing()
      posthog.capture('$pageview')
    }
  } else if (!posthog.has_opted_out_capturing()) {
    posthog.opt_out_capturing()
    posthog.set_config({ persistence: 'memory' })
  }
}

export async function initPostHog() {
  if (!POSTHOG_KEY || !isProductionHost() || posthog) return
  const { default: ph } = await import('posthog-js')
  ph.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    // Nothing is captured or stored until analytics consent is granted.
    opt_out_capturing_by_default: true,
    persistence: 'memory',
  })
  posthog = ph
  syncConsent()
  queue.splice(0).forEach((fn) => fn(ph))
}

export function track(event: string, props: Props = {}) {
  window.gtag?.('event', event, { ...props, send_to: SITE.gaMeasurementId })
  withPostHog((ph) => ph.capture(event, props))
}

/* ------------------------------------------------------------------ */
/* First-touch attribution                                             */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = 'mv_attribution'
const TTL_MS = 30 * 86_400_000
const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'li_fat_id',
  'msclkid',
] as const

interface AttributionRecord {
  values: Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>>
  landing_page: string
  captured_at: number
}

export function captureAttribution() {
  const params = new URLSearchParams(location.search)
  const values: AttributionRecord['values'] = {}
  for (const key of ATTRIBUTION_KEYS) {
    const v = params.get(key)
    if (v) values[key] = v
  }
  if (!Object.keys(values).length) return
  try {
    const record: AttributionRecord = { values, landing_page: location.pathname, captured_at: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    /* storage unavailable (private mode) */
  }
}

export function getAttribution(): AttributionRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const record = JSON.parse(raw) as AttributionRecord
    if (Date.now() - record.captured_at > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return record
  } catch {
    return null
  }
}
