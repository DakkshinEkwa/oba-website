"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { eventImage, formatDate } from "@/lib/utils";

const TILT_MAX = 10;
const GLOW_MAX = 0.16;

export function FeaturedEventCard({ event }: { event: Event }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });
  const actionLabel = event.registrationUrl ? "Reserve" : "Details";
  // Always the panel page, never the registration host directly: the page is
  // the landing page now, and it carries the register link itself.
  const href = `/resources/events/${event.slug}`;

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = -py * TILT_MAX * 2;
    const rotY = px * TILT_MAX * 2;
    setStyle({
      transform: `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.02)`,
    });
    const x = (px + 0.5) * 100;
    const y = (py + 0.5) * 100;
    setGlow({ x, y, opacity: Math.hypot(px, py) * 2 * GLOW_MAX });
  }

  function onMouseLeave() {
    setStyle({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)" });
    setGlow({ x: 50, y: 50, opacity: 0 });
  }

  return (
    <div className="[perspective:900px]">
      <div
        ref={frameRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setGlow((g) => ({ ...g, opacity: g.opacity || GLOW_MAX }))}
        onMouseLeave={onMouseLeave}
        className="relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-xl transition-transform duration-200 ease-out will-change-transform"
        style={style}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-900">
          <Image
            src={eventImage(event.image)}
            alt=""
            fill
            sizes="(max-width: 1024px) 90vw, 26rem"
            className="object-cover"
            priority
          />
          <span className="absolute top-4 right-4 rounded-md bg-black/45 px-2.5 py-1 font-mono text-micro font-semibold text-white backdrop-blur-sm">
            {event.isVirtual ? "Virtual" : "In person"}
          </span>
        </div>

        <div className="flex flex-col gap-3 bg-canvas p-6">
          <Eyebrow tone="default" className="text-accent-600">
            Next panel
          </Eyebrow>
          <h2 className="text-body-lg font-medium leading-snug text-ink-900">{event.title}</h2>
          <time dateTime={event.startDate} className="text-small text-ink-500">
            {formatDate(event.startDate)}
          </time>
          <Button variant="primary" className="pointer-events-none mt-2 w-full">
            {actionLabel}
          </Button>
        </div>

        <Link
          href={href}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={`${actionLabel} ${event.title}`}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            background: `radial-gradient(260px circle at ${glow.x}% ${glow.y}%, rgba(255,255,255,${glow.opacity.toFixed(3)}) 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
}
