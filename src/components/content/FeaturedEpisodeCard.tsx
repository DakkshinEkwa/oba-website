"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Mic } from "lucide-react";
import type { Episode } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Waveform } from "@/components/ui/Waveform";
import { formatDate } from "@/lib/utils";

const TILT_MAX = 10; // degrees of rotation at the edges
const GLOW_MAX = 0.16; // glow intensity at the edges

/** Floating episode-preview card for the episodes-archive hero `aside` slot. */
export function FeaturedEpisodeCard({ episode }: { episode: Episode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalized cursor position, -0.5 (top-left) to +0.5 (bottom-right)
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = -py * TILT_MAX * 2;
    const rotY = px * TILT_MAX * 2;
    setStyle({
      transform: `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.02)`,
    });
    // Position a radial glow near the cursor.
    const x = (px + 0.5) * 100;
    const y = (py + 0.5) * 100;
    setGlow({ x, y, opacity: (Math.hypot(px, py) * 2) * GLOW_MAX });
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
        className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-800 shadow-xl transition-transform duration-200 ease-out will-change-transform"
        style={style}
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-ink-900">
          {episode.image ? (
            <Image
              src={episode.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 90vw, 26rem"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />
              <div aria-hidden className="absolute inset-0 opacity-70" style={{ background: "var(--gradient-hero-glow)" }} />
              <div className="relative flex size-16 items-center justify-center rounded-full border border-white/25 bg-white/10">
                <Mic className="size-7 text-white" aria-hidden />
              </div>
              <Waveform bars={16} baseHeight={22} animated className="relative text-white/40" />
            </div>
          )}

          {episode.episodeNumber ? (
            <span className="absolute top-4 right-4 rounded-md bg-black/45 px-2.5 py-1 font-mono text-micro font-semibold text-white backdrop-blur-sm">
              EP {episode.episodeNumber}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 bg-canvas p-6">
          <Eyebrow tone="default" className="text-accent-600">
            Latest episode
          </Eyebrow>
          <h3 className="text-body-lg font-medium leading-snug text-ink-900">{episode.title}</h3>
          <time dateTime={episode.publishedAt} className="text-small text-ink-500">
            {formatDate(episode.publishedAt)}
          </time>
          <Button href={`/podcast/episodes/${episode.slug}`} variant="primary" className="mt-2 w-full">
            Listen now
          </Button>
        </div>

        {/* Cursor-following glow */}
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
