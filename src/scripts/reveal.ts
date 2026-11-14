/**
 * Gentle scroll-reveal for [data-reveal]. Content is only hidden while the
 * `js` class is on <html>; an inline failsafe in Base.astro removes that class
 * if this module hasn't signalled readiness within a few seconds.
 */
declare global {
  interface Window {
    __mvRevealReady?: boolean
  }
}

const items = document.querySelectorAll<HTMLElement>('[data-reveal]')

if (!('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('is-visible'))
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  items.forEach((el) => io.observe(el))
}

window.__mvRevealReady = true

export {}
