import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";

const perks = [
  "The full conversation library",
  "Articles and practical resources",
  "Invitations to panels and events",
];

/** Two-column auth layout: form card on the left, value panel on the right. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  showPerks = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showPerks?: boolean;
}) {
  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-line lg:grid-cols-2">
        <div className="bg-canvas p-8 sm:p-10">
          <h1 className="text-h2 font-light tracking-tight text-ink-900">{title}</h1>
          {subtitle ? <p className="mt-2 text-body text-ink-500">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-small text-ink-500">{footer}</div> : null}
        </div>

        <div className="hidden flex-col justify-between bg-ink-900 p-8 text-ink-200 sm:p-10 lg:flex">
          <Logo tone="light" />
          <div>
            {showPerks ? (
              <>
                <p className="text-h3 font-normal text-white">
                  Free access to every OBA conversation, article, and resource.
                </p>
                <ul className="mt-6 space-y-3">
                  {perks.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-body text-ink-200">
                      <Check className="size-5 text-accent-400" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-h3 font-normal text-white">
                Practical business education, built for eye care.
              </p>
            )}
          </div>
          <p className="text-small text-ink-400">Free to join · No credit card required</p>
        </div>
      </div>
    </Container>
  );
}
