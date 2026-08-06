import { Button } from "./Button";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  level = "h3",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: { label: string; href: string };
  /** Heading level — h3 for sections under an h2, h2 when directly under the page h1. */
  level?: "h2" | "h3";
}) {
  const Heading = level;
  return (
    <div
      role="status"
      className="flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-canvas-subtle px-6 py-16 text-center"
    >
      <div className="inline-flex size-14 items-center justify-center rounded-full bg-accent-50 text-accent-500">
        <Icon className="size-7" />
      </div>
      <Heading className="mt-5 text-h3 font-normal text-ink-900">{title}</Heading>
      <p className="mt-2 max-w-md text-body text-ink-500">{body}</p>
      {action ? (
        <Button href={action.href} variant="primary" className="mt-6">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
