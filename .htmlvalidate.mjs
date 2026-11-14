import { defineConfig } from 'html-validate'

export default defineConfig({
  extends: ['html-validate:recommended'],
  rules: {
    // Inline `style` only carries CSS custom properties (reveal --delay) and logo dimensions.
    'no-inline-style': 'off',
    // The comparison table sets explicit ARIA roles on purpose: Safari drops table
    // semantics when the phone layout restyles rows with `display: block`.
    'no-redundant-role': 'off',
    // Counts `&amp;` as five characters. scripts/validate-dist.mjs checks the title length
    // (20–70) on the text searchers actually see.
    'long-title': 'off',
    // Comes from Astro's generated output, not source.
    'no-trailing-whitespace': 'off',
    // Base.astro writes a lowercase `<!doctype html>`, which is valid HTML5.
    'doctype-style': 'off',
  },
})
