import { getEpisodeStats } from "@/lib/content";
import type { FaqItem } from "@/components/ui/Accordion";

/**
 * General OBA FAQ, shared by the homepage teaser and the full /faq page.
 * Answered with the same build-time-derived stats as StatBand — never hardcoded counts.
 */
export function getGeneralFaqs(): FaqItem[] {
  const stats = getEpisodeStats();

  return [
    {
      question: "What is the Ophthalmology Business Academy?",
      answer: `OBA convenes practice owners, administrators, physicians, and industry experts for candid, non-promotional conversations about the business decisions behind stronger eye-care practices: growth, operations, patient experience, leadership, and technology. It's published ${stats.count}+ conversations, 100% ophthalmology-specific, since ${stats.firstYear}.`,
    },
    {
      question: "Is OBA free to access?",
      answer:
        "Yes. The full podcast library, articles, and newsletter are free, with no account or paid membership required.",
    },
    {
      question: "Who are the conversations for?",
      answer:
        "Practice owners and partners, administrators and operations leaders, industry and technology leaders, and emerging leaders such as residents and fellows preparing for those responsibilities.",
    },
    {
      question: "Can I contribute as a speaker?",
      answer:
        "Yes. If you've navigated a problem your peers are still facing, OBA invites experienced operators and physicians to join a conversation as a speaker or panelist.",
    },
    {
      question: "Is OBA affiliated with a marketing company?",
      answer:
        "OBA was founded by Naren Arulrajah, CEO of Ekwa Marketing, and Ekwa offers a separate, clearly labeled complimentary marketing analysis to practices that want one. That commercial service is kept distinct from OBA's editorial conversations, which stay non-promotional.",
    },
    {
      question: "Where can I listen to episodes?",
      answer:
        "Every episode streams directly from the site, with no app, account, or subscription required.",
    },
    {
      question: "How do I find out about new panels and events?",
      answer:
        "Newsletter subscribers hear about upcoming panels first, and a replay follows each session for anyone who couldn't attend live.",
    },
    {
      question: "Can my organization partner with OBA?",
      answer:
        "Yes. Organizations serving ophthalmology can support the conversation through a partnership, without turning it into advertising.",
    },
  ];
}

export const membershipFaqs: FaqItem[] = [
  {
    question: "How much does membership cost?",
    answer:
      "Nothing. Membership is free: join the newsletter and the full library of conversations and resources is yours, with no account required.",
  },
  {
    question: "Who is membership for?",
    answer:
      "Ophthalmologists, practice owners, administrators, operations and patient-experience leaders, and anyone responsible for the business side of an eye-care practice, including residents and fellows preparing for those responsibilities.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, there's no commitment of any kind. Unsubscribe from the newsletter whenever you like.",
  },
];

export const msmFaqs: FaqItem[] = [
  {
    question: "Who actually performs the analysis?",
    answer:
      "Ekwa Marketing, the practice-marketing firm led by OBA's founder, Naren Arulrajah. It works with medical practices, including ophthalmology. This is a commercial service offered alongside OBA, not part of OBA's educational programming.",
  },
  {
    question: "Is this really free?",
    answer: "Yes. The analysis is complimentary and there is no obligation to buy anything.",
  },
  {
    question: "How long does it take?",
    answer: "The review takes a few business days, after which an advisor walks you through the findings.",
  },
  {
    question: "What do you need from me?",
    answer:
      "Just your name, your practice website, and a contact email. The more context you share, the more tailored the analysis.",
  },
  {
    question: "Will this be promoted inside OBA's content?",
    answer:
      "No. OBA's panels, podcasts, and webinars stay non-promotional by design. This service is never promoted inside the academy's conversations.",
  },
];
