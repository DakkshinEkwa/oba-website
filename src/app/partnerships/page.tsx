import type { Metadata } from "next";
import { ScanEye, Cpu, Workflow, Pill, Briefcase, MonitorSmartphone, ShieldCheck, Handshake } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { Button } from "@/components/ui/Button";
import { IconCard } from "@/components/ui/IconCard";
import { ChecklistItem } from "@/components/ui/ChecklistItem";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "How organizations serving ophthalmology can support credible, non-promotional professional education with the Ophthalmology Business Academy.",
};

const partnerFields = [
  { icon: ScanEye, title: "Diagnostics & imaging", body: "Organizations advancing how eye disease is detected, monitored, and understood." },
  { icon: Cpu, title: "Surgical technology & AI", body: "Teams building the tools practices are deciding whether — and how — to adopt." },
  { icon: MonitorSmartphone, title: "Remote monitoring & engagement", body: "Platforms changing how practices stay connected to patients between visits." },
  { icon: Workflow, title: "Clinical workflow & practice technology", body: "Systems that shape how a practice actually runs day to day." },
  { icon: Pill, title: "Therapeutics & vision rehabilitation", body: "Organizations supporting treatment, adherence, and life with low vision." },
  { icon: Briefcase, title: "Professional services", body: "Advisors in finance, law, compliance, and operations who serve medical practices." },
];

const standards = [
  {
    title: "Education comes first",
    body: "Every conversation starts from a problem the profession needs to solve — not from a product that needs an audience.",
  },
  {
    title: "Speakers are chosen for experience",
    body: "Participation in a conversation is never for sale. Contributors are invited because they've faced the problem firsthand.",
  },
  {
    title: "Partners don't script the conversation",
    body: "Supporting a discussion doesn't buy control of it. Hosts and speakers keep their independence, always.",
  },
  {
    title: "Commercial relationships are disclosed",
    body: "When an organization supports OBA's work, the audience knows. We apply the same standard to our own founding relationship with Ekwa Marketing.",
  },
];

const possibilities = [
  "Supporting a panel, webinar, or podcast series on a problem your field understands deeply",
  "Contributing implementation expertise to a conversation where it genuinely belongs",
  "Helping convene a discussion the profession needs — and being credited for making it possible",
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title="Support the conversation — without controlling it"
        lede="OBA gives organizations serving ophthalmology a way to back credible professional education. Not by buying attention, but by helping important conversations happen."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Partnerships" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="#enquiry" variant="primary">
            <Handshake className="size-4" aria-hidden /> Start a partnership conversation
          </Button>
          <Button href="/podcast/episodes" variant="outline">
            See the conversations we convene
          </Button>
        </div>
      </PageHero>

      <Section spacing="default" containerSize="narrow">
        <div className="text-body-lg text-ink-600">
          <p>
            The organizations building ophthalmology&apos;s tools and services hold real
            expertise — about implementation, adoption, and what actually happens when
            technology meets a working practice. That expertise belongs in the profession&apos;s
            conversations. What doesn&apos;t belong is advertising dressed up as education.
          </p>
          <p className="mt-5">
            OBA partnerships are built on that distinction. Partners help meaningful
            conversations happen and are credited transparently for it; the conversations
            themselves stay independent, experience-led, and non-promotional. That protects the
            audience&apos;s trust — which is the only reason partnering here is worth anything.
          </p>
        </div>
      </Section>

      <Section tone="subtle" spacing="default">
        <SectionHeader
          eyebrow="Who partners with OBA"
          title="Organizations serving ophthalmology"
          lede="If your work touches how eye-care practices diagnose, treat, operate, or grow, there's likely a conversation where your field's perspective matters."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partnerFields.map((f) => (
            <IconCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
          ))}
        </div>
      </Section>

      <Section spacing="default">
        <SectionHeader
          eyebrow="Our standards"
          title="The rules that make partnership worth it"
          lede="These commitments protect the audience, the speakers, and — not incidentally — the value of being associated with OBA."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {standards.map((s) => (
            <div key={s.title} className="flex items-start gap-4 rounded-lg border border-line p-7">
              <ShieldCheck className="mt-1 size-6 shrink-0 text-accent-600" aria-hidden />
              <div>
                <h3 className="text-h3 font-normal">{s.title}</h3>
                <p className="mt-2 text-body text-ink-500">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="subtle" spacing="default" containerSize="narrow">
        <SectionHeader
          eyebrow="What it can look like"
          title="Possibilities worth discussing"
          lede="Partnerships are shaped case by case around a conversation worth having. Openings typically look like:"
        />
        <ul className="mt-10 space-y-4">
          {possibilities.map((p) => (
            <ChecklistItem key={p} icon={Handshake}>
              {p}
            </ChecklistItem>
          ))}
        </ul>
        <p className="mt-6 text-body text-ink-400">
          We&apos;d rather be clear now than disappointing later: OBA doesn&apos;t sell speaking
          slots, editorial influence, endorsements, or audience data.
        </p>
      </Section>

      <Section spacing="default" containerSize="narrow">
        <div id="enquiry" className="scroll-mt-28">
          <SectionHeader
            eyebrow="Get in touch"
            title="Start a partnership conversation"
            lede="Tell us who you are and what you'd like to explore. A member of the OBA team will follow up to discuss whether — and where — a collaboration makes sense."
          />
          <div className="mt-10 rounded-xl border border-line bg-canvas p-6 sm:p-8">
            <ContactForm variant="partnership" />
          </div>
        </div>
      </Section>
    </>
  );
}
