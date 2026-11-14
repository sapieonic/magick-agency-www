/**
 * Single source of truth for every word on the site.
 *
 * Pages, JSON-LD structured data, /llms.txt, /llms-full.txt and the sitemap
 * all read from here — so a fact changed once is changed everywhere crawlers
 * and LLMs look.
 *
 * Every product claim here is backed by what the Magick Agency product actually does today.
 * Check with the product team before adding a capability.
 */
import { ORIGIN } from './origin.mjs'
import { pad2 } from '@/lib/format'

export const SITE = {
  name: 'Magick Agency',
  /** Other ways people write the brand. Fed to JSON-LD alternateName and llms.txt; never use them in our own copy. */
  alternateNames: ['MagickAgency', 'Magic Agency', 'Magick Agency Dialer'],
  legalName: 'MAGICKVOICE LLP',
  url: ORIGIN,
  title: 'Power Dialer for Call Centres & BPOs in India | Magick Agency',
  description:
    'Auto-dial contact lists for your agents, analyse every call with AI, score agents against your floor and email reports on schedule. Web and mobile.',
  /** One plain-language sentence an LLM can quote verbatim. */
  definition:
    'Magick Agency is an outbound power dialer for call centres, BPOs and collection agencies in India. It dials contact lists for human agents as soon as they are free, analyses every call with AI, scores each agent against the rest of the floor and sends scheduled reports, with agents working from a browser or a mobile app.',
  ogImage: '/brand/og-card.png',
  /** Indian English (British spelling) is our house style. */
  locale: 'en_IN',
  country: 'IN',
  /** Bump when marketing content changes — feeds dateModified and the sitemap. */
  lastUpdated: '2026-11-13',
  /** Bump when only the home page's content changes, so other pages keep their sitemap date. */
  homeUpdated: '2026-11-13',
  /** Date the Privacy Policy and Terms were last revised. */
  legalUpdated: '2026-11-13',
  /** Analytics stay off until both are set (see Base.astro). */
  gaMeasurementId: '',
  cookieHubId: '',
  /**
   * Site-verification tokens: the `content` value of the meta tag that Google Search Console
   * (google-site-verification) and Bing Webmaster Tools (msvalidate.01) give you. Empty: no tag.
   */
  verification: { google: '', bing: '' },
} as const

/** The home page's last change: whichever of the site-wide and home-only dates is later. */
export const HOME_UPDATED: string = SITE.homeUpdated > SITE.lastUpdated ? SITE.homeUpdated : SITE.lastUpdated

/**
 * Magick Agency's own profiles elsewhere (LinkedIn, Crunchbase, G2, app store listings). They go into
 * the Organization's JSON-LD `sameAs` and /llms.txt. Add only real, live URLs for Magick Agency itself;
 * the company's MagickVoice profiles belong in PARENT below.
 */
export const PROFILES: readonly string[] = []

/**
 * MagickVoice, the company behind Magick Agency (same legal entity). Emitted as the Organization's
 * parentOrganization in JSON-LD and listed in /llms.txt, so search and AI engines connect the two brands
 * without treating them as one product.
 */
export const PARENT = {
  name: 'MagickVoice',
  url: 'https://www.magickvoice.com',
  profiles: [
    'https://www.linkedin.com/company/magickvoice',
    'https://www.youtube.com/@MagickVoiceAgent',
    'https://www.instagram.com/magickvoiceai/',
    'https://www.facebook.com/magickvoice/',
    'https://www.producthunt.com/p/magickvoice',
  ],
} as const

export const LINKS = {
  app: 'https://app.magick-agency.com',
} as const

export const CONTACT = {
  salesEmail: 'sales@magick-agency.com',
  infoEmail: 'hello@magick-agency.com',
} as const

export const useCasePath = (slug: string) => `/use-cases/${slug}`

/** Absolute URL on this site for a path such as '/', '/use-cases' or '/#faq'. */
export const absUrl = (path: string) => new URL(path, SITE.url).href

/** In-page deep links the contact section understands (see Contact.astro). */
export const CONTACT_LINKS = {
  demo: '/#book-demo',
  sales: '/#talk-to-sales',
} as const

/** Numbered home-page sections, in page order (src/pages/index.astro). Their labels read "01 / …". */
export const HOME_SECTIONS = [
  'product',
  'features',
  'ai',
  'mobile',
  'how-it-works',
  'comparison',
  'use-cases',
  'security',
  'faq',
  'contact',
] as const

/** "01" for the first numbered home section, and so on. */
export const homeIndex = (id: (typeof HOME_SECTIONS)[number]) => pad2(HOME_SECTIONS.indexOf(id) + 1)

export const NAV = [
  { label: 'Product', href: '/#product' },
  { label: 'AI insights', href: '/#ai' },
  { label: 'Mobile app', href: '/#mobile' },
  { label: 'Use cases', href: '/use-cases' },
  { label: 'Security', href: '/#security' },
  { label: 'FAQ', href: '/#faq' },
] as const

/** Hero strip — product facts, not vanity numbers. */
export const STATS = [
  { value: '250 ms', label: 'Between pacing checks' },
  { value: '3%', label: 'Default abandon ceiling' },
  { value: 'Up to 20', label: 'Custom AI checks per call' },
  { value: 'Desk or phone', label: 'Where agents work' },
] as const

/**
 * Screenshots. Drop the real image into public/screens/ and set `src`, `width` and `height` (the
 * frame takes its shape from them). Add a half-width copy named `<name>-<width/2>.webp` for small
 * screens. Until `src` is set, the slot renders an HTML mock-up of that screen.
 */
export type Screenshot = { src: string | null; width: number; height: number; alt: string }

export const SCREENSHOTS = {
  overview: {
    src: '/screens/console-campaign-overview.webp',
    width: 2000,
    height: 1070,
    alt: 'Magick Agency campaign overview: reach, dials, connect rate, successes, overdue callbacks, items that need attention and roster progress',
  },
  analytics: {
    src: '/screens/console-analytics.webp',
    width: 2000,
    height: 1070,
    alt: 'Magick Agency analytics: connect rate, conversion of conversations, handle time, wrap-up, where connected calls went and what one handled call costs',
  },
  station: {
    src: null,
    width: 2000,
    height: 1070,
    alt: 'Magick Agency agent station: the contact’s details, the live call and the disposition picker',
  },
  analysis: {
    src: null,
    width: 2000,
    height: 1070,
    alt: 'Magick Agency AI call analysis: summary, sentiment, topics and quality scores for one call',
  },
  reports: {
    src: null,
    width: 2000,
    height: 1070,
    alt: 'Magick Agency reports: agent, campaign and account reports with scheduled email subscriptions',
  },
  mobileStation: {
    src: '/screens/mobile-station.webp',
    width: 720,
    height: 1600,
    alt: 'Magick Agency mobile app: an agent’s station, available for inbound calls while the campaign is paused',
  },
  mobileCalls: {
    src: '/screens/mobile-calls.webp',
    width: 720,
    height: 1600,
    alt: 'Magick Agency mobile app: My calls, with campaign, soft phone and missed calls and each call’s outcome',
  },
} as const satisfies Record<string, Screenshot>

export type ScreenshotKey = keyof typeof SCREENSHOTS

/** The console's main screens, shown as tabs in the product section. Ids match SCREENSHOTS. */
export const CONSOLE_SCREENS = [
  {
    id: 'overview',
    label: 'Campaign overview',
    text: 'Reach, dials, connect rate, successes, overdue callbacks and abandonment for each campaign, with what needs a supervisor first.',
  },
  {
    id: 'station',
    label: 'Agent station',
    text: 'The customer’s details are on screen before they say hello. Outcome, notes, callback and DNC in one place, and the next call follows wrap-up.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    text: 'Connect rate, conversion, handle time and wrap-up by campaign or by agent, and what one handled call costs in agent time.',
  },
  {
    id: 'reports',
    label: 'Reports',
    text: 'Agent, campaign and account reports as PDF and Excel, run now or emailed to your team every day, week or month.',
  },
] as const satisfies readonly { id: ScreenshotKey; label: string; text: string }[]

/** One line of platform facts for use-case pages. */
export const PLATFORM_SPECS =
  'Power dialling for every free agent · DNC and calling-hour checks on every dial · AI analysis of every call · PDF and Excel reports by email · browser and mobile agents · hosted in India.'

/** Short, scannable facts — rendered on the page and quoted in llms.txt. */
export const KEY_FACTS = [
  ['What it is', 'An outbound power dialer for teams of human agents, with AI call analysis and reports'],
  ['Built for', 'Call centres, BPOs, collection agencies, telesales and support teams in India'],
  [
    'Dialling',
    'Dials as soon as an agent is free, splits capacity fairly across live campaigns and pauses a campaign when abandoned calls cross your ceiling',
  ],
  [
    'AI',
    'Transcription (including Sarvam for Indian languages), sentiment, topics, quality scores, a summary and up to 20 custom checks per call',
  ],
  ['Agent scorecards', 'Each agent compared with the 25th percentile, median and 75th percentile of their own floor'],
  ['Reports', 'Agent, campaign and account reports as PDF and Excel, on demand or emailed daily, weekly or monthly'],
  ['Agents work from', 'A browser on a desk, or the Android and iOS app over any data connection'],
  ['Inbound', 'Sticky-agent routing, queues with hold audio and route hours, and a missed-call follow-up list'],
  ['Telephony', 'VoiceLink, or Plivo on your own account'],
  ['Data', 'Hosted in India (AWS Mumbai region); every tenant and account isolated'],
] as const

export const FEATURES = [
  {
    title: 'A dialer that keeps agents talking',
    description:
      'Upload a CSV and Magick Agency dials for every free agent. It checks the floor every 250 ms, splits capacity fairly across live campaigns and never rings two calls to one number.',
  },
  {
    title: 'Guardrails on every dial',
    description:
      'Calling windows and days per campaign, each contact’s own timezone, Do Not Call lists checked before each dial, and an auto-pause when abandoned calls go over your ceiling.',
  },
  {
    title: 'Retries and callbacks that run themselves',
    description:
      'Set retry rules per outcome and disposition. Callbacks are booked for a time and tracked as on time, late or missed, so no promised call slips.',
  },
  {
    title: 'AI analysis on every call',
    description:
      'Transcripts, sentiment, key topics, a short summary and quality scores, plus up to 20 checks of your own, such as “Did the agent confirm the EMI date?”',
  },
  {
    title: 'Scorecards against your own floor',
    description:
      'See each agent’s connect rate, success rate, occupancy and handling time next to the floor’s median and top quartile, with a leaderboard and the best hours to call.',
  },
  {
    title: 'Reports that reach your inbox',
    description:
      'Agent, campaign and account reports as PDF and Excel. Run one now, or subscribe your team to daily, weekly or monthly emails.',
  },
  {
    title: 'Inbound that finds the right agent',
    description:
      'Customers who call back reach the agent they spoke to before. Queues, hold audio, route hours and holidays included, with every missed call on a follow-up list.',
  },
  {
    title: 'One customer, every call',
    description:
      'Search a number to see every contact, call, callback and DNC status for that customer across all your campaigns, on one timeline.',
  },
  {
    title: 'A mobile app for agents',
    description:
      'Agents take dialled and inbound calls on Android or iOS over a data connection. No desk, headset or SIM needed, and recordings never reach the phone.',
  },
] as const

/** The AI section: what each call's analysis contains. */
export const AI_ANALYSIS = [
  {
    title: 'Transcript',
    detail: 'Speech-to-text with Gemini, or Sarvam for Indian languages, with a language hint per campaign.',
  },
  { title: 'Sentiment', detail: 'Overall and turn by turn, with a label and a score.' },
  { title: 'Topics', detail: 'The three to seven things the call was really about.' },
  {
    title: 'Quality',
    detail: 'Coherence and effectiveness out of 10, and whether the customer’s issue was resolved.',
  },
  { title: 'Summary', detail: 'Two or three sentences a supervisor can read in seconds.' },
  {
    title: 'Your own checks',
    detail: 'Up to 20 questions per analysis profile, answered for every call, with your business context.',
  },
] as const

/** Scorecard: an example agent against the floor. Illustrative numbers for the visual only. */
export const SCORECARD = {
  agent: 'Example agent',
  metrics: [
    { label: 'Connect rate', unit: '%', p25: 31, median: 38, p75: 45, agent: 47 },
    { label: 'Success rate', unit: '%', p25: 12, median: 17, p75: 23, agent: 19 },
    { label: 'Occupancy', unit: '%', p25: 58, median: 66, p75: 74, agent: 62 },
  ],
} as const

export const MOBILE = {
  points: [
    {
      title: 'Every station in a pocket',
      detail:
        'Sign in, pick a campaign, run the pre-flight check and go on duty. Calls, notes, dispositions, breaks and the soft phone all work on the phone.',
    },
    {
      title: 'Calls over data, not the SIM',
      detail:
        'Audio runs inside the app with echo cancellation, so agents need only a data connection. The customer never sees the agent’s own number.',
    },
    {
      title: 'Nothing sensitive stays on the device',
      detail:
        'Recordings and transcripts never reach the phone. Each agent can be on one device at a time, and logs on the device are masked.',
    },
    {
      title: 'Pauses itself when the agent steps away',
      detail:
        'The agent is paused automatically when the app goes to the background or a mobile call comes in, so no customer waits for nobody.',
    },
  ],
  sizes: [
    { title: 'A team of five', detail: 'Start with phones only. No office, no hardware, no telephony setup.' },
    { title: 'A floor of hundreds', detail: 'Desk agents in the browser and field or remote agents on the app.' },
    {
      title: 'Same rules for both',
      detail: 'One server, one set of roles, one set of reports. A phone agent is just another agent.',
    },
  ],
} as const

export const STEPS = [
  {
    title: 'Upload your list',
    detail: 'Drop in a CSV, map the columns and remove duplicates. DNC numbers are dropped on the way in.',
  },
  {
    title: 'Set the rules',
    detail: 'Calling hours, caller IDs, retry rules, dispositions and the abandon ceiling, once per campaign.',
  },
  {
    title: 'Agents go on duty',
    detail: 'From a browser or the mobile app. Magick Agency dials the moment each agent is free.',
  },
  {
    title: 'Watch the floor',
    detail: 'Supervisors see every agent’s state, what needs attention and how today is going, live.',
  },
  {
    title: 'Learn and improve',
    detail: 'AI analysis, scorecards and scheduled reports show who to coach and when to call.',
  },
] as const

export type UseCase = {
  slug: string
  title: string
  short: string
  /** <title> / meta description for the detail page. */
  seoTitle: string
  seoDescription: string
  headline: string
  intro: string
  helps: readonly string[]
  flow: readonly { title: string; detail: string }[]
  industries: readonly string[]
  faqs: readonly { q: string; a: string }[]
}

export const USE_CASES: readonly UseCase[] = [
  {
    slug: 'collections',
    title: 'Collections & EMI reminders',
    short: 'Work large overdue books with retries, callbacks and promise-to-pay outcomes tracked for you.',
    seoTitle: 'Collections Dialer for Agencies & NBFCs in India | Magick Agency',
    seoDescription:
      'A power dialer for collection agencies: dial overdue books for your agents, book promise-to-pay callbacks, respect calling hours and DNC, and review every call with AI.',
    headline: 'Reach more borrowers in a shift, and keep every promise on track.',
    intro:
      'Collections is a numbers game with rules. Magick Agency dials your overdue list for every free agent, keeps to the calling hours you set and each borrower’s timezone, and books callbacks when a borrower asks for one. AI analysis then checks the calls your QA team never has time to hear.',
    helps: [
      'Dials overdue accounts for every free agent, in priority order',
      'Books callbacks for a promised time and flags any that are late or missed',
      'Retries unanswered and busy numbers on rules you set per outcome',
      'Checks every dial against your Do Not Call lists and calling hours',
      'Asks AI your own QA questions on every call, such as whether the agent stated the due amount',
    ],
    flow: [
      { title: 'Upload the book', detail: 'A CSV of accounts with any extra columns you need.' },
      { title: 'Dial', detail: 'Agents talk; Magick Agency handles the dialling.' },
      { title: 'Record the outcome', detail: 'Dispositions, notes and promise-to-pay callbacks.' },
      { title: 'Review', detail: 'AI checks and scorecards for every agent.' },
    ],
    industries: ['Collection agencies', 'NBFCs & banks', 'Fintech lenders'],
    faqs: [
      {
        q: 'Can agents book a callback for a promise-to-pay date?',
        a: 'Yes. Agents book a callback for a date and time during wrap-up. Magick Agency tracks each callback as on time, late or missed, and hands it to someone else on the team if the owner is not available.',
      },
      {
        q: 'Does Magick Agency stop calls outside permitted hours?',
        a: 'Yes. Each campaign has a calling window and calling days, and each contact can carry their own timezone. Numbers on your Do Not Call lists are checked before every dial, and the check fails closed.',
      },
    ],
  },
  {
    slug: 'telesales',
    title: 'Telesales & lead follow-up',
    short: 'Call every lead on the list, follow up on schedule and see which agents and hours convert.',
    seoTitle: 'Telesales Auto Dialer for Sales Teams in India | Magick Agency',
    seoDescription:
      'Auto-dial lead lists for your telesales team, keep agents talking instead of dialling, and see which agents and hours convert best with AI call analysis.',
    headline: 'More conversations per hour. Better ones, too.',
    intro:
      'Manual dialling eats a sales agent’s day. Magick Agency dials the next lead the moment an agent is free, shows the lead’s details before the customer says hello, and tells you which hours and which agents turn calls into sales.',
    helps: [
      'Dials lead lists for every free agent, with no time lost between calls',
      'Shows the lead’s details on screen before the call connects',
      'Rotates caller IDs per campaign and shows connect rates for each',
      'Shows the best hours to call and a leaderboard per campaign',
      'Scores each agent against the floor’s median and top quartile',
    ],
    flow: [
      { title: 'Load leads', detail: 'Upload a CSV and map the columns.' },
      { title: 'Dial', detail: 'One agent, one call, no idle time.' },
      { title: 'Disposition', detail: 'Interested, call back, not interested, DNC.' },
      { title: 'Improve', detail: 'Best hours, leaderboard and AI insights.' },
    ],
    industries: ['EdTech', 'Real estate', 'Insurance', 'Banking'],
    faqs: [
      {
        q: 'How does Magick Agency decide when to dial?',
        a: 'It dials one call for each free agent and checks the floor every 250 milliseconds, so an agent who finishes wrap-up gets the next call almost at once. When several campaigns run together, spare capacity is shared fairly between them.',
      },
      {
        q: 'Can I see which caller IDs connect best?',
        a: 'Yes. Each campaign can use a pool of caller IDs, and its Health tab shows connect statistics for each one.',
      },
    ],
  },
  {
    slug: 'bpo',
    title: 'BPO client campaigns',
    short: 'Run many client campaigns on one floor, each with its own rules, team and reports.',
    seoTitle: 'Multi-Client Dialer for BPOs & Call Centres | Magick Agency',
    seoDescription:
      'Run every client campaign on one power dialer: separate accounts, rules and reports per client, agents on desk or mobile, and scheduled PDF and Excel reports.',
    headline: 'Every client on one floor, kept apart where it matters.',
    intro:
      'A BPO runs many processes at once. In Magick Agency each client can have its own account, with its own campaigns, team, numbers and reports, while your supervisors see the whole floor from one place.',
    helps: [
      'Separate accounts per client, each with its own data, team and settings',
      'Several campaigns live at once, with capacity shared fairly',
      'Six roles, from owner to viewer, so each person sees only what they should',
      'Account and campaign reports emailed to your team on a schedule',
      'Audit logs of what changed, who changed it and when',
    ],
    flow: [
      { title: 'Set up the client', detail: 'An account with its own team and numbers.' },
      { title: 'Launch campaigns', detail: 'Rules, dispositions and caller IDs per process.' },
      { title: 'Run the floor', detail: 'Desk and mobile agents, one live view.' },
      { title: 'Report', detail: 'Scheduled PDF and Excel reports per account.' },
    ],
    industries: ['BPOs', 'Call centres', 'Outsourced collections'],
    faqs: [
      {
        q: 'Can I keep each client’s data separate?',
        a: 'Yes. A tenant can hold several accounts, and every account’s data is isolated in every query. People are invited to the accounts they work on, with one of six roles.',
      },
      {
        q: 'Can I send reports to a client’s team?',
        a: 'Subscriptions send report emails to members of your workspace, daily, weekly or monthly. Each email links to the report in the console, and downloads use short-lived signed links.',
      },
    ],
  },
  {
    slug: 'customer-support',
    title: 'Support & callbacks',
    short: 'Answer customers who call back, route them to the agent they know, and follow up on every miss.',
    seoTitle: 'Inbound and Callback Dialer for Support Teams | Magick Agency',
    seoDescription:
      'Route returning callers to the agent they spoke to, queue the rest with hold audio and route hours, and follow up on every missed call. Outbound and inbound together.',
    headline: 'When a customer calls back, they reach the right person.',
    intro:
      'Outbound calls create inbound ones. Magick Agency sends a returning caller to the agent they spoke to before, queues everyone else with hold audio and opening hours, and puts every missed call on a list your team can call back in one tap.',
    helps: [
      'Sticky-agent routing to the agent the caller spoke to last',
      'Queues with greetings, hold audio, route hours and holidays',
      'Inbound calls take priority over outbound dialling',
      'A missed-call list with owners, Mark handled and one-tap call back',
      'Customer history across every campaign for context before you call',
    ],
    flow: [
      { title: 'Customer calls', detail: 'On one of your inbound numbers.' },
      { title: 'Route', detail: 'To their last agent, or the team queue.' },
      { title: 'Answer or follow up', detail: 'Missed calls land on a list with an owner.' },
      { title: 'Close the loop', detail: 'Outcome, notes and history in one place.' },
    ],
    industries: ['E-commerce', 'Telecom', 'Healthcare', 'Utilities'],
    faqs: [
      {
        q: 'Which numbers can take inbound calls?',
        a: 'Inbound works on Plivo numbers on your own Plivo account. Each number has a route with its own hours, queue and messages.',
      },
      {
        q: 'What happens if the customer’s last agent is busy?',
        a: 'Magick Agency waits up to 30 seconds for that agent, then falls back to the rest of the team. You can make the routing strict, loose or turn it off.',
      },
    ],
  },
  {
    slug: 'field-and-remote-teams',
    title: 'Remote & field agents',
    short: 'Put agents on the dialer from anywhere with a phone and a data connection.',
    seoTitle: 'Mobile Dialer App for Remote Call Centre Agents | Magick Agency',
    seoDescription:
      'Let remote and field agents take dialled and inbound calls on Android or iOS over data, with the same rules, reports and security as desk agents.',
    headline: 'A call-centre seat that fits in a pocket.',
    intro:
      'Not every agent sits at a desk. With the Magick Agency app, an agent at home or in the field signs in, runs a quick pre-flight check and goes on duty, taking the same dialled and inbound calls as everyone in the office.',
    helps: [
      'Dialled and inbound calls over a data connection, not the SIM',
      'A pre-flight check of the microphone, network and battery before going on duty',
      'Notes, dispositions, callbacks, DNC and the soft phone, all on the phone',
      'Recordings and transcripts never reach the device',
      'Agents paused automatically when they leave the app',
    ],
    flow: [
      { title: 'Invite', detail: 'An email invite with a single-use link.' },
      { title: 'Check', detail: 'Mic, network and battery, before going on duty.' },
      { title: 'Take calls', detail: 'Dialled and inbound, like any desk agent.' },
      { title: 'Track', detail: 'My performance and my calls, on the phone.' },
    ],
    industries: ['Small call centres', 'Field sales', 'Work-from-home teams'],
    faqs: [
      {
        q: 'Do mobile agents use their own SIM to call?',
        a: 'No. Calls run inside the app over a data connection, so customers never see the agent’s personal number.',
      },
      {
        q: 'Can an agent use two devices at once?',
        a: 'No. Each agent has one station at a time. To move to another phone, the agent picks “Use this phone” on the new device.',
      },
    ],
  },
]

export const INDUSTRIES = [
  { name: 'BPOs & call centres', detail: 'Client campaigns at scale' },
  { name: 'Collection agencies', detail: 'Overdue books, promises to pay' },
  { name: 'NBFCs & banks', detail: 'EMI reminders, cross-sell' },
  { name: 'Insurance', detail: 'Renewals, lead follow-up' },
  { name: 'EdTech', detail: 'Admissions, counselling' },
  { name: 'Real estate', detail: 'Site-visit follow-ups' },
  { name: 'E-commerce', detail: 'COD and order confirmation' },
  { name: 'Healthcare', detail: 'Appointments, follow-ups' },
] as const

/** Security & compliance — every line is backed by how the product works today. */
export const TRUST = [
  {
    icon: 'map-pin',
    title: 'Hosted in India',
    detail: 'The service and its database run in the AWS Asia Pacific (Mumbai) region.',
  },
  {
    icon: 'building',
    title: 'Every account kept apart',
    detail: 'Tenant and account isolation is enforced on every query, so one client never sees another’s data.',
  },
  {
    icon: 'users',
    title: 'Six roles, invite only',
    detail: 'Owner, admin, account admin, operator, viewer and agent. People join only by a single-use email invite.',
  },
  {
    icon: 'file-text',
    title: 'Audit logs',
    detail: 'Dialer, console and admin actions are logged, including every Do Not Call override and its note.',
  },
  {
    icon: 'lock',
    title: 'Signed links, masked numbers',
    detail:
      'Recordings and report downloads use short-lived signed links. Logs mask phone numbers and email addresses.',
  },
  {
    icon: 'clock',
    title: 'Retention you control',
    detail: 'Transcripts are deleted after 30 days by default, and old call records can be purged on a schedule.',
  },
] as const

export const COMPARISON = {
  columns: ['Magick Agency', 'Manual dialling', 'Typical legacy dialer'],
  rows: [
    ['Dialling', 'Automatic, the moment an agent is free', 'Agent dials each number', 'Automatic'],
    ['AI call analysis', 'Every call: transcript, sentiment, quality, your own checks', 'None', 'Add-on, if at all'],
    ['Agent scorecards', 'Against your floor’s median and top quartile', 'Spreadsheets', 'Basic call counts'],
    ['Reports', 'PDF and Excel, emailed on schedule', 'Built by hand', 'Exports to clean up'],
    ['Mobile agents', 'Android and iOS app over data', 'Personal phones and SIMs', 'Rarely'],
    ['Setup', 'In the browser, no hardware', 'Phones and spreadsheets', 'Servers, SIP trunks, IT'],
  ],
} as const

export const FAQS = [
  {
    q: 'What is Magick Agency?',
    a: SITE.definition,
  },
  {
    q: 'What is a power dialer?',
    a: 'A power dialer calls the next number on a list automatically when an agent is free, so agents spend their time talking instead of dialling. Magick Agency reserves an agent before each dial, which keeps abandoned calls low and means the customer reaches a person when they pick up.',
  },
  {
    q: 'Who is Magick Agency for?',
    a: 'BPOs, call centres, collection agencies, telesales and support teams that make a high volume of calls with human agents. It works for a team of five on phones as well as a floor of hundreds on desks.',
  },
  {
    q: 'How does Magick Agency handle abandoned calls?',
    a: 'If a customer answers and no agent is free, Magick Agency plays a short message you upload and ends the call. It tracks the abandon rate over a rolling 24 hours and pauses the campaign when it goes over your ceiling, which is 3% by default.',
  },
  {
    q: 'What does the AI do?',
    a: 'After each call, Magick Agency can transcribe it (with Gemini, or Sarvam for Indian languages) and analyse it: overall and turn-by-turn sentiment, key topics, quality scores, whether the issue was resolved, a short summary and up to 20 questions of your own.',
  },
  {
    q: 'How do agent scorecards work?',
    a: 'Each agent’s connect rate, success rate, occupancy and handling time are shown against the 25th percentile, median and 75th percentile of their own floor. Insights also show a leaderboard and the best hours to call for each campaign.',
  },
  {
    q: 'Which reports can I get, and can they be emailed?',
    a: 'Agent performance reviews, campaign reports and account reports, as PDF or Excel. Run one at any time, or subscribe up to 20 members of your team to daily, weekly or monthly emails with a link to the latest report.',
  },
  {
    q: 'Can agents work from a mobile phone?',
    a: 'Yes. The Magick Agency app for Android and iOS lets agents take dialled and inbound calls over a data connection, with notes, dispositions, callbacks and their own performance. Recordings and transcripts never reach the phone.',
  },
  {
    q: 'Does Magick Agency support inbound calls?',
    a: 'Yes, on Plivo numbers. Returning callers can be routed to the agent they spoke to before, others wait in a queue with hold audio and route hours, and missed calls go on a follow-up list.',
  },
  {
    q: 'Which telephony providers does it work with?',
    a: 'VoiceLink, or Plivo on your own Plivo account. Your Plivo credentials are stored encrypted.',
  },
  {
    q: 'How do Do Not Call lists work?',
    a: 'You keep Do Not Call lists per workspace, account or campaign, and agents can mark a number DNC during a call. Listed numbers are removed when you upload a list and checked again before every dial. If the check cannot run, the call is not placed.',
  },
  {
    q: 'Where is my data stored?',
    a: 'In India, in the AWS Asia Pacific (Mumbai) region. Each tenant and account is isolated, recordings use signed links, and transcripts are deleted after 30 days by default.',
  },
  {
    q: 'How do I get started?',
    a: `Book a demo and we will set up a workspace for your team. Or write to ${CONTACT.salesEmail}.`,
  },
] as const
