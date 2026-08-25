export const siteConfig = {
  name: "Ophthalmology Business Academy",
  shortName: "OB Academy",
  url: "https://www.obacademy.org",
  description:
    "The Ophthalmology Business Academy convenes practice owners, administrators, physicians, and industry experts for candid, non-promotional conversations about building stronger eye-care practices.",
  email: "team@obacademy.org",
  address: {
    line1: "303 Pinetree Way",
    line2: "Mississauga, Ontario L5G 2R4, Canada",
  },
  socials: {
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
  /** Primary macro-conversion CTA used across the site. */
  primaryCta: {
    label: "Contribute",
    href: "/speak",
  },
  strategyMeetingUrl: "https://ekwasales-withoutceo.youcanbook.me/",
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  children?: NavLink[];
};

export const primaryNav: NavLink[] = [
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Expert Insights Hub", href: "/resources", description: "Every OBA resource in one place" },
      { label: "Free Resources", href: "/resources/free-resources", description: "Guides, templates, and checklists" },
      { label: "Webinar Archive", href: "/resources/webinars", description: "On-demand expert sessions" },
      { label: "Webinar Replays", href: "/resources/webinars/replays", description: "Recordings of past live sessions" },
      { label: "Blog", href: "/blog", description: "Articles on practice growth" },
      { label: "Newsletter", href: "/resources/newsletter", description: "New conversations to your inbox" },
      { label: "Events", href: "/resources/events", description: "Live panels and discussions" },
    ],
  },
  {
    label: "Podcast",
    href: "/podcast",
    children: [
      { label: "Episodes", href: "/podcast/episodes", description: "Every conversation, on demand" },
      { label: "Hosts", href: "/podcast/hosts", description: "Meet the voices behind OBA" },
      { label: "About the Podcast", href: "/podcast", description: "What the show is about" },
    ],
  },
  { label: "Reviews", href: "/reviews" },
  { label: "Marketing", href: "/msm" },
  {
    label: "Participate",
    href: "/speak",
    children: [
      { label: "Become a Speaker", href: "/speak", description: "Lend your experience to the conversation" },
      { label: "Partnerships", href: "/partnerships", description: "Support credible professional education" },
      { label: "Membership", href: "/membership", description: "Free access to the full library" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Resources",
    links: [
      { label: "Expert Insights Hub", href: "/resources" },
      { label: "Free Resources", href: "/resources/free-resources" },
      { label: "Webinar Archive", href: "/resources/webinars" },
      { label: "Webinar Replays", href: "/resources/webinars/replays" },
      { label: "Blog", href: "/blog" },
      { label: "Events", href: "/resources/events" },
      { label: "Newsletter", href: "/resources/newsletter" },
    ],
  },
  {
    title: "Podcast",
    links: [
      { label: "All Episodes", href: "/podcast/episodes" },
      { label: "Hosts", href: "/podcast/hosts" },
      { label: "About the Show", href: "/podcast" },
    ],
  },
  {
    title: "Academy",
    links: [
      { label: "About", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      { label: "Become a Speaker", href: "/speak" },
      { label: "Partnerships", href: "/partnerships" },
      { label: "Membership", href: "/membership" },
      { label: "Marketing Analysis", href: "/msm" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
