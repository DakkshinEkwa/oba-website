import { Button } from "./Button";

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-canvas-subtle px-6 py-16 text-center">
      <div className="inline-flex size-14 items-center justify-center rounded-full bg-accent-50 text-accent-500">
        <Icon className="size-7" />
      </div>
      <h3 className="mt-5 text-h3 font-normal text-ink-900">{title}</h3>
      <p className="mt-2 max-w-md text-body text-ink-500">{body}</p>
      {action ? (
        <Button href={action.href} variant="primary" className="mt-6">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
