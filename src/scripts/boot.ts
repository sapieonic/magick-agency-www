/**
 * Site-wide analytics boot: attribution, declarative click tracking, section
 * views, web vitals and (consent-gated) PostHog. Scroll-reveal is separate
 * (src/scripts/reveal.ts) so content never depends on this bundle loading.
 */
import { ANALYTICS_ENABLED, captureAttribution, getAttribution, initPostHog, syncConsent, track } from '@/lib/track'

/** Append stored attribution to every link into the app. Existing params win. */
function decorateAppLinks() {
  const record = getAttribution()
  if (!record) return
  document.querySelectorAll<HTMLAnchorElement>('a[data-app-link]').forEach((a) => {
    try {
      const url = new URL(a.href)
      for (const [k, v] of Object.entries(record.values)) {
        if (v && !url.searchParams.has(k)) url.searchParams.set(k, v)
      }
      a.href = url.toString()
    } catch {
      /* leave link as-is */
    }
  })
}

const TRACKED = '[data-track-cta],[data-track-email]'

function bindClickTracking() {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>(TRACKED)
    if (!el) return
    const d = el.dataset
    if (d.trackCta) {
      track('signup_cta_clicked', { cta_location: d.trackCta, cta_label: d.ctaLabel ?? el.textContent?.trim() ?? '' })
    } else if (d.trackEmail) {
      const email = (el.getAttribute('href') ?? '').replace(/^mailto:/, '').split('?')[0]
      track('email_link_clicked', { email_address: email, location: d.trackEmail })
    }
  })
}

function observeSections() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id
        if (!entry.isIntersecting || !id) continue
        io.unobserve(entry.target)
        track('section_viewed', { section_id: id, time_since_load_ms: Math.round(performance.now()) })
      }
    },
    { rootMargin: '0px 0px -50% 0px' },
  )
  document.querySelectorAll<HTMLElement>('section[id]').forEach((s) => io.observe(s))
}

async function startWebVitals() {
  const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import('web-vitals')
  const send = (m: {
    name: string
    value: number
    delta: number
    id: string
    rating: string
    navigationType: string
  }) => {
    const scale = m.name === 'CLS' ? 1000 : 1
    track('web_vitals', {
      metric_name: m.name,
      metric_value: Math.round(m.value * scale),
      metric_delta: Math.round(m.delta * scale),
      metric_id: m.id,
      metric_rating: m.rating,
      metric_navigation_type: m.navigationType,
    })
  }
  onCLS(send)
  onINP(send)
  onLCP(send)
  onFCP(send)
  onTTFB(send)
}

// Attribution rides along to the app even while site analytics is off.
captureAttribution()
decorateAppLinks()
if (ANALYTICS_ENABLED) {
  bindClickTracking()
  observeSections()
  void startWebVitals()
  // Fires from the CookieHub callbacks wired up in Base.astro.
  window.addEventListener('mv:consent', syncConsent)
  void initPostHog()
}
