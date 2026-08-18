/** Bordered checklist row: icon + copy. */
export function ChecklistItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className="relative flex items-start gap-4 overflow-hidden rounded-[20px] border border-line bg-canvas px-6 py-6 text-body font-light text-ink-400 before:absolute before:inset-y-0 before:left-0 before:w-0 before:bg-accent-600 before:transition-[width] before:duration-200 before:ease-in-out hover:before:w-[3px]">
      <Icon className="mt-0.5 size-5 shrink-0 text-accent-600" aria-hidden />
      {children}
    </li>
  );
}
