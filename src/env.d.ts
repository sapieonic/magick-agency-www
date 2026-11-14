interface ImportMetaEnv {
  /** Where the demo form POSTs JSON. Unset: the form opens the visitor's email app instead. */
  readonly PUBLIC_CONTACT_ENDPOINT?: string
  readonly PUBLIC_POSTHOG_KEY?: string
  readonly PUBLIC_POSTHOG_HOST?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
