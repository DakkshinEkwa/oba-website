import Image from "next/image";
import type { Host } from "@/lib/schemas";

export function HostCard({ host }: { host: Host }) {
  const initials = host.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  return (
    <article className="flex flex-col rounded-lg border border-line bg-canvas p-6">
      <div className="flex items-center gap-4">
        {host.avatar ? (
          <Image
            src={host.avatar}
            alt={host.name}
            width={112}
            height={112}
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-50 font-display text-h3 font-normal text-accent-700">
            {initials}
          </div>
        )}
        <div>
          <h3 className="text-h3 font-normal leading-tight">{host.name}</h3>
          {host.title ? <p className="mt-0.5 text-small text-ink-500">{host.title}</p> : null}
        </div>
      </div>
      {host.bio ? <p className="mt-4 text-body text-ink-500">{host.bio}</p> : null}
    </article>
  );
}
