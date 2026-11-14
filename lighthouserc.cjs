/**
 * Lighthouse CI — load-speed, accessibility and SEO gates on the built site.
 * Runs Lighthouse's default mobile profile (throttled CPU + slow 4G), 3 runs per URL,
 * and asserts on the median run.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/use-cases.html',
        'http://localhost/use-cases/collections.html',
        'http://localhost/privacy.html',
      ],
      numberOfRuns: 3,
      settings: {
        // Measure this repo's code, not third-party CDNs: their size and latency vary run to run,
        // and CookieHub's banner would otherwise become the LCP element and fail link-text.
        blockedUrlPatterns: ['*googletagmanager.com*', '*google-analytics.com*', '*cookiehub.eu*', '*posthog.com*'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:seo': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:best-practices': ['warn', { minScore: 0.9, aggregationMethod: 'median-run' }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000, aggregationMethod: 'median-run' }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3000, aggregationMethod: 'median-run' }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, aggregationMethod: 'median-run' }],
        'total-blocking-time': ['error', { maxNumericValue: 200, aggregationMethod: 'median-run' }],
      },
    },
    // Reports stay private: written to disk and uploaded as a workflow artifact.
    upload: { target: 'filesystem', outputDir: './.lighthouseci' },
  },
}
