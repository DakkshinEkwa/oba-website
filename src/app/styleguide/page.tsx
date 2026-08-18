import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { FaqAccordion } from "@/components/ui/Accordion";
import { Prose } from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Style Guide", robots: { index: false } };

const inkSwatches = [
  { cls: "bg-ink-900", label: "ink-900", light: false },
  { cls: "bg-ink-800", label: "ink-800", light: false },
  { cls: "bg-ink-700", label: "ink-700", light: false },
  { cls: "bg-ink-600", label: "ink-600", light: false },
  { cls: "bg-ink-500", label: "ink-500", light: false },
  { cls: "bg-ink-400", label: "ink-400", light: true },
  { cls: "bg-ink-300", label: "ink-300", light: true },
  { cls: "bg-ink-200", label: "ink-200", light: true },
];
const accentSwatches = [
  { cls: "bg-accent-900", label: "900", light: false },
  { cls: "bg-accent-800", label: "800", light: false },
  { cls: "bg-accent-700", label: "700", light: false },
  { cls: "bg-accent-600", label: "600", light: false },
  { cls: "bg-accent-500", label: "500", light: false },
  { cls: "bg-accent-400", label: "400", light: false },
  { cls: "bg-accent-300", label: "300", light: false },
  { cls: "bg-accent-200", label: "200", light: true },
  { cls: "bg-accent-100", label: "100", light: true },
  { cls: "bg-accent-50", label: "50", light: true },
];

export default function StyleguidePage() {
  return (
    <>
      <Section spacing="tight">
        <Eyebrow>Internal</Eyebrow>
        <h1 className="mt-3 text-h1 font-light tracking-tight">Design System</h1>
        <p className="mt-3 text-lede text-ink-500">
          Tokens and primitives that compose the OBA site.
        </p>
      </Section>

      <Section tone="subtle" spacing="tight">
        <SectionHeader eyebrow="Type" title="Typographic scale" />
        <div className="mt-8 space-y-3">
          <p className="text-display font-light tracking-tight">Display: practice growth</p>
          <p className="text-h1 font-light tracking-tight">H1: Business insight for ophthalmology</p>
          <p className="text-h2 font-light">H2: Section heading</p>
          <p className="text-h3 font-normal">H3: Subsection heading</p>
          <p className="text-lede text-ink-500">Lede: a slightly larger intro paragraph.</p>
          <p className="text-body-lg">Body large: comfortable reading size.</p>
          <p className="text-body">Body: default paragraph text.</p>
          <p className="text-small text-ink-500">Small: metadata and captions.</p>
          <Eyebrow>Eyebrow label</Eyebrow>
        </div>
      </Section>

      <Section spacing="tight">
        <SectionHeader eyebrow="Color" title="Palette" />
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-small font-semibold text-ink-700">Ink</p>
            <div className="flex flex-wrap gap-2">
              {inkSwatches.map((s) => (
                <Swatch key={s.label} className={s.cls} label={s.label} light={s.light} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-small font-semibold text-ink-700">Accent (teal)</p>
            <div className="flex flex-wrap gap-2">
              {accentSwatches.map((s) => (
                <Swatch key={s.label} className={s.cls} label={s.label} light={s.light} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="subtle" spacing="tight">
        <SectionHeader eyebrow="Buttons" title="Actions" />
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link →</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="outline">Outline</Badge>
        </div>
      </Section>

      <Section spacing="tight">
        <SectionHeader eyebrow="Surfaces" title="Cards & forms" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card interactive>
            <CardBody>
              <h3 className="text-h3 font-normal">Interactive card</h3>
              <p className="mt-2 text-body text-ink-500">Hairline border, shadow on hover.</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-4">
              <Field label="Full name" htmlFor="sg-name" required>
                <Input id="sg-name" placeholder="Jane Doe" />
              </Field>
              <Field label="Specialty" htmlFor="sg-specialty">
                <Select id="sg-specialty" defaultValue="">
                  <option value="" disabled>
                    Select…
                  </option>
                  <option>Cataract & Refractive</option>
                  <option>Retina</option>
                  <option>Glaucoma</option>
                </Select>
              </Field>
              <Field label="Message" htmlFor="sg-message">
                <Textarea id="sg-message" placeholder="How can we help?" />
              </Field>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section tone="subtle" spacing="tight" containerSize="narrow">
        <SectionHeader eyebrow="Content" title="Prose & FAQ" />
        <Prose className="mt-8">
          <p>
            This is long-form <a href="#">rich text</a> rendered with the <strong>prose</strong> styles.
            It sets a comfortable measure and rhythm for MDX content.
          </p>
          <ul>
            <li>Podcast show notes</li>
            <li>Blog articles</li>
            <li>Webinar descriptions</li>
          </ul>
        </Prose>
        <div className="mt-10">
          <FaqAccordion
            items={[
              { question: "What is the Ophthalmology Business Academy?", answer: "A resource hub for practice growth." },
              { question: "Who is it for?", answer: "Ophthalmologists and practice owners." },
            ]}
          />
        </div>
      </Section>
    </>
  );
}

function Swatch({ className, label, light }: { className: string; label: string; light?: boolean }) {
  return (
    <div
      className={`flex size-16 items-end rounded-md border border-line p-1.5 ${className}`}
    >
      <span className={`font-mono text-micro ${light ? "text-ink-700" : "text-white"}`}>
        {label}
      </span>
    </div>
  );
}
