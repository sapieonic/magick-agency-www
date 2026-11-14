// @ts-check
import { defineConfig } from 'astro/config'
import { ORIGIN } from './src/data/origin.mjs'

export default defineConfig({
  site: ORIGIN,
  // Every page is pre-rendered to static HTML — crawlers and LLMs get the
  // full content without executing JavaScript.
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssTarget: ['chrome109', 'edge109', 'firefox115', 'safari15.4', 'ios15.4'],
    },
  },
})
