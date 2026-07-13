import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prose } from "@/components/ui/Prose";

/** Renders a Markdown body inside prose styles. Links open safely. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <Prose className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </Prose>
  );
}
