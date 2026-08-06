"use client";

import { useRef, useState } from "react";
import { Play, Pause, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Lightweight custom audio player over the direct MP3 (preload="none" = no load until play). */
export function LibsynPlayer({
  audioUrl,
  title,
  episodeNumber,
}: {
  audioUrl?: string;
  title: string;
  episodeNumber?: number;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  if (!audioUrl) {
    return (
      <div className="rounded-xl border border-line bg-canvas-subtle p-4 sm:p-5">
        <p className="text-body text-ink-500">Audio for this episode isn&apos;t available yet.</p>
      </div>
    );
  }

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      // After a failed load the element stays errored; reload resets it so
      // "Retry playback" actually works.
      if (error) {
        setError(undefined);
        el.load();
      }
      setBuffering(true);
      el.play().catch(() => {
        setPlaying(false);
        setBuffering(false);
        setError("This episode's audio couldn't be played right now. Try again in a moment.");
      });
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function onSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const el = audioRef.current;
    if (!el || !duration) return;
    const t = (Number(e.target.value) / 100) * duration;
    el.currentTime = t;
    setProgress(Number(e.target.value));
  }

  return (
    <div role="region" aria-label="Episode audio player" aria-busy={buffering}>
      <div className="rounded-xl border border-line bg-canvas-subtle p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            aria-label={error ? "Retry playback" : playing ? "Pause episode" : "Play episode"}
            aria-pressed={playing}
            className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white transition-colors hover:bg-ink-700"
          >
            {buffering ? (
              <Loader2 className="size-6 animate-spin" aria-hidden />
            ) : playing ? (
              <Pause className="size-6" aria-hidden />
            ) : (
              <Play className="size-6 translate-x-0.5" aria-hidden />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-small font-semibold text-ink-800">
              {episodeNumber ? `Episode ${episodeNumber} · ` : ""}
              {title}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={onSeek}
                disabled={!!error}
                aria-label="Seek"
                className={cn(
                  "h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-line-strong disabled:opacity-50",
                  "[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-600",
                  "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent-600",
                )}
                style={{
                  background: `linear-gradient(to right, var(--color-accent-500) ${progress}%, var(--color-line-strong) ${progress}%)`,
                }}
              />
              <span className="w-24 shrink-0 text-right font-mono text-micro text-ink-400">
                {fmt(current)} / {fmt(duration)}
              </span>
            </div>
          </div>

          <a
            href={audioUrl}
            download
            aria-label="Download episode"
            className="hidden size-10 shrink-0 items-center justify-center rounded-md border border-line text-ink-500 transition-colors hover:border-line-strong hover:text-ink-800 sm:inline-flex"
          >
            <Download className="size-4" aria-hidden />
          </a>
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-small text-error">
            {error}
          </p>
        ) : null}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        preload="none"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setCurrent(el.currentTime);
          if (el.duration) setProgress((el.currentTime / el.duration) * 100);
        }}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => {
          setBuffering(false);
          setPlaying(true);
        }}
        onCanPlay={() => setBuffering(false)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
          setProgress(0);
        }}
        onError={() => {
          setPlaying(false);
          setBuffering(false);
          setError("This episode's audio couldn't be loaded. Please try again later.");
        }}
      />
    </div>
  );
}

function fmt(s: number): string {
  if (!s || Number.isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}
