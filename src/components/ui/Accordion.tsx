"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * `answer` is the canonical plain-text answer and is the ONLY thing that reaches
 * FAQPage structured data. Supply `answerNode` when the rendered answer needs
 * links or markup; it never leaks into JSON-LD.
 */
export type FaqItem = {
  question: string;
  answer: string;
  answerNode?: React.ReactNode;
};

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => (
        <AccordionPrimitive.Item key={i} value={`item-${i}`} className="py-1">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left text-body-lg font-semibold text-ink-900 transition-colors hover:text-accent-700">
              {item.question}
              <Plus
                className="size-5 shrink-0 text-ink-400 transition-transform duration-300 group-data-[state=open]:rotate-45"
                aria-hidden
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-none data-[state=open]:animate-none">
            <div className="pb-5 pr-10 text-body text-ink-500">{item.answerNode ?? item.answer}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
