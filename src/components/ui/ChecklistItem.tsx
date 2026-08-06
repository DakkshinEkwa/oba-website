/** Bordered checklist row: icon + copy. */
export function ChecklistItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-line bg-canvas p-5 text-body text-ink-600">
      <Icon className="mt-0.5 size-5 shrink-0 text-accent-600" aria-hidden />
      {children}
    </li>
  );
}
