import type { FaqItem } from "@/components/ui/Accordion";

/**
 * FAQ copy, kept in one file so it can be reviewed in one place.
 *
 * Every answer follows docs/messaging-strategy.md: no audience-size claims, no
 * publishing-cadence claims, no promises of webinars or networking that don't
 * exist, and only the approved CTA wording. Questions are phrased the way
 * someone would actually ask them, since these blocks exist to be quoted.
 */

export const SPEAK_FAQS: FaqItem[] = [
  {
    question: "Who can speak on the Ophthalmology Business Podcast?",
    answer:
      "Anyone with firsthand experience of a business problem in eye care: practice owners and partners, administrators and operations leaders, physicians and subspecialists, and industry experts who work closely with practices. What matters is that you have made the decision being discussed, not that you hold a particular title.",
  },
  {
    question: "Does it cost anything to be a guest?",
    answer:
      "No. Speaking is never purchased and there is no fee in either direction. Contributors are invited for their experience, and a commercial relationship with OBA neither helps nor hinders an invitation.",
  },
  {
    question: "What is actually involved in recording an episode?",
    answer:
      "A conversation with one of the hosts, recorded remotely. There is no script and no slide deck. You will know the subject and the questions the host wants to explore beforehand, and the discussion follows wherever your experience leads.",
  },
  {
    question: "Can I promote my company or product on the episode?",
    answer:
      "No. Conversations are editorial and non-promotional by design. Your role, company, and expertise are introduced so listeners understand your perspective, but the discussion stays on the problem and how you approached it.",
  },
  {
    question: "What makes a good episode topic?",
    answer:
      "A specific decision with real trade-offs: what you chose, what it cost, what you would do differently. Topics that work well include premium conversion, office-based surgery, co-management, private equity, staffing, and building a subspecialty service line.",
  },
  {
    question: "How do I put myself forward as a speaker?",
    answer:
      "Share your area of expertise through the form on the speaker page. Describe the problem you have navigated and what you learned; a member of the OBA team will follow up to discuss whether it fits an upcoming conversation.",
  },
];

export const PARTNERSHIP_FAQS: FaqItem[] = [
  {
    question: "What does a partnership with OBA involve?",
    answer:
      "Supporting professional education for the ophthalmology community: the conversations, panels, and written work the academy publishes. Partnership supports the programme; it does not buy placement inside it.",
  },
  {
    question: "Can a partner choose the topics or the speakers?",
    answer:
      "No. Partners do not script, review, or approve conversations. Topics are chosen because the profession needs to work through them, and speakers are invited for their firsthand experience. Editorial independence is the reason the work is worth supporting at all.",
  },
  {
    question: "Will a supported conversation look like an advertisement?",
    answer:
      "No. Every conversation starts from a problem practices are facing rather than a product that needs an audience, and the format does not change because a partner is involved.",
  },
  {
    question: "Which kinds of organizations does OBA work with?",
    answer:
      "Organizations serving ophthalmology: diagnostics and imaging, surgical technology and AI, remote monitoring and patient engagement, clinical workflow and practice technology, therapeutics and vision rehabilitation, and professional services such as finance, law, and compliance.",
  },
  {
    question: "How are commercial relationships disclosed?",
    answer:
      "Openly. Where a commercial relationship exists it is stated plainly rather than implied, including OBA's own relationship with Ekwa Marketing, the firm led by OBA's founder.",
  },
  {
    question: "How does a partnership conversation start?",
    answer:
      "Through the form on the partnerships page. Describe your organization and what you would want to support, and the OBA team will follow up to talk through whether the standards fit both sides.",
  },
];

export const ABOUT_FAQS: FaqItem[] = [
  {
    question: "What is the Ophthalmology Business Academy?",
    answer:
      "A professional platform where experienced ophthalmology leaders discuss the business side of running an eye-care practice: operations, growth, staffing, technology, and ownership. It publishes recorded conversations, written articles, and live virtual panels, all specific to eye care.",
  },
  {
    question: "Who is OBA for?",
    answer:
      "Practice owners, administrators and operations leaders, physicians and subspecialists, and the industry experts who work alongside them. The material assumes you already run or help run a practice rather than starting from first principles.",
  },
  {
    question: "What is OBA's relationship with Ekwa Marketing?",
    answer:
      "OBA was founded by Naren Arulrajah, who is also CEO of Ekwa Marketing, a practice-marketing firm. Ekwa provides the complimentary marketing analysis offered on the marketing page and authored the free downloadable resources. Those are commercial services offered alongside OBA, and they are never promoted inside the academy's conversations.",
  },
  {
    question: "Does it cost anything to access OBA's content?",
    answer:
      "No. There is no fee, no subscription, and no account to create. The episodes, articles, and panels are open to anyone.",
  },
  {
    question: "Does OBA offer CME credit?",
    answer:
      "No. The conversations are business education for people who run practices, not clinical education, and they do not carry continuing medical education credit.",
  },
];

export const PODCAST_FAQS: FaqItem[] = [
  {
    question: "What is the Ophthalmology Business Podcast about?",
    answer:
      "The business of running an eye-care practice, discussed by the people who run them. Episodes cover practice growth, marketing, operations, staffing, technology adoption, and ownership decisions, always specific to ophthalmology rather than generic business advice.",
  },
  {
    question: "Who hosts the podcast?",
    answer:
      "Six hosts and regular contributors: Naren Arulrajah, Guido Piquet, Sarah Duval, David Lazar, Omar R. Shakir, and Deep Parikh. Between them they cover practice ownership, operations, administration, and clinical subspecialty perspectives.",
  },
  {
    question: "Where can I listen?",
    answer:
      "Every episode streams directly on the episode page. The show also publishes an RSS feed, so it can be followed in a podcast app.",
  },
  {
    question: "How much does it cost to listen?",
    answer:
      "Nothing. The full archive is open, with no account, subscription, or paywall.",
  },
  {
    question: "Are the conversations sponsored or scripted?",
    answer:
      "No. Speakers are invited for their firsthand experience rather than a commercial relationship, and no conversation is scripted or approved by a commercial interest.",
  },
];

export const EVENTS_FAQS: FaqItem[] = [
  {
    question: "What happens at an OBA live panel?",
    answer:
      "Several experienced practitioners work through one business problem together in a live virtual discussion, covering what they decided, what it cost, and where they disagree. The format is a conversation rather than a presentation.",
  },
  {
    question: "Do the panels cost anything to attend?",
    answer:
      "No. The panels are free to attend and there is no membership requirement.",
  },
  {
    question: "Are the panels held online or in person?",
    answer:
      "Online. The current series is virtual, so practice teams can join without travelling.",
  },
  {
    question: "Who should attend?",
    answer:
      "Practice owners, administrators, physicians, and industry experts working on the same decisions. The discussion assumes working familiarity with running a practice.",
  },
];
