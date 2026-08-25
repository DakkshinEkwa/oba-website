export const siteConfig = {
  name: "Ophthalmology Business Academy",
  shortName: "OB Academy",
  url: "https://www.obacademy.org",
  description:
    "The Ophthalmology Business Academy convenes practice owners, administrators, physicians, and industry experts for candid, non-promotional conversations about building stronger eye-care practices.",
  email: "team@obacademy.org",
  ga4Id: "G-6GDGK5QGS4",
  address: {
    line1: "303 Pinetree Way",
    line2: "Mississauga, Ontario L5G 2R4, Canada",
  },
  socials: {
    facebook: "https://www.facebook.com/Opthos",
    linkedin: "https://www.linkedin.com/company/ophthalmology-business-academy",
    instagram: "https://www.instagram.com/ophthalmology_business_podcast",
  },
  /** Primary macro-conversion CTA used across the site. */
  primaryCta: {
    label: "Contribute",
    href: "/speak",
  },
  strategyMeetingUrl: "https://ekwasales-withoutceo.youcanbook.me/",
} as const;

export const aiSummary = {
  label: "Get an AI summary of Ophthalmology Business Academy",
  prompt: `I'm exploring the **Ophthalmology Business Academy (OBA)** and want to understand how it could actually help me as an ophthalmologist, ophthalmology practice owner, administrator, or practice leader.

Visit and review:

**https://www.obacademy.org/**

Then explain OBA to me in practical, straightforward terms.

I don't just want a summary of the website. Help me understand **what OBA can actually do for me and my practice.**

Please explain:

1. **What is Ophthalmology Business Academy?**
   Explain its purpose, who it is built for, and why business education matters for ophthalmologists and ophthalmology practice leaders.

2. **What can I get from OBA?**
   Walk me through the useful resources currently available, such as:

   * Expert educational content
   * Ophthalmology business podcasts
   * Webinars and expert discussions
   * Events and panels
   * Articles and practice-growth resources
   * Business insights from ophthalmology and industry experts
   * Newsletter and educational updates

3. **What kinds of practice problems can OBA help me think through?**
   Based on OBA's actual content, identify areas that may include:

   * Practice growth
   * Profitability
   * Marketing and patient acquisition
   * Patient experience
   * Staffing and team challenges
   * Practice operations
   * Technology and AI
   * Leadership
   * Practice ownership
   * Strategic decision-making
   * Building a more sustainable ophthalmology practice

4. **What would participating actually look like?**
   Describe the experience realistically. For example, how I might discover a topic relevant to my practice, attend an OBA expert panel or webinar, listen to an expert conversation, learn different approaches, and turn those insights into decisions or improvements inside my own practice.

5. **Why OBA instead of generic business content?**
   Explain what is valuable about learning business concepts specifically in the context of ophthalmology instead of relying only on generic business podcasts, consultants, conferences, or management advice.

6. **Where should I start?**
   Based on what you find on the OBA website, recommend the most relevant OBA content, podcast, webinar, event, article, or next step for me.

If possible, briefly ask me what my biggest challenge is right now — for example:

* Growing patient volume
* Increasing referrals
* Improving profitability
* Improving practice capacity
* Marketing
* Staffing
* Patient experience
* Technology / AI
* Practice ownership
* Premium services
* Planning future growth

Then tailor your recommendations around my answer.

### Important

Use **https://www.obacademy.org/** as your primary source.

Prioritize information that is clearly about the **Ophthalmology Business Academy**. If you encounter old, mismatched, incomplete, or legacy website content that appears to refer to another organization, do not treat it as a current OBA offering.

Do not invent programs, pricing, memberships, guarantees, events, services, or benefits that you cannot verify.

Keep your explanation conversational and easy to understand. Talk to me like a knowledgeable advisor helping an ophthalmology practice leader decide whether OBA is worth exploring — not like you're rewriting the website's marketing copy.

At the end, give me:

**My OBA Starting Point**

* The biggest way OBA could potentially help me
* The first resource or action I should explore
* A direct OBA link where possible`,
  providers: [
    { name: "ChatGPT", chatUrl: "https://chatgpt.com/" },
    { name: "Claude", chatUrl: "https://claude.ai/new" },
    { name: "Gemini", chatUrl: "https://gemini.google.com/app" },
    { name: "Grok", chatUrl: "https://grok.com/" },
  ],
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
