import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prose } from "@/components/ui/Prose";

/** Renders a Markdown body inside prose styles. External links open safely in a new tab; internal links stay in place. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <Prose className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Keep heading levels below the page's single h1.
          h1: (props) => <h2 {...props} />,
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            if (external) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              );
            }
            return <a href={href}>{children}</a>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </Prose>
  );
}
