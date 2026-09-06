"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Download, Loader2 } from "lucide-react";

const BARS = 160;
/** Spectrum bands the bars are folded into. */
const BANDS = 32;
/** How many times the band ramp sweeps across the field. Neighbouring bars land
 *  in neighbouring bands, so the field shimmers coherently instead of hashing. */
const SWEEPS = 3;
/** Highest FFT bin sampled — ~9kHz at 44.1k, above which speech carries little. */
const MAX_BIN = 220;
/** Per-frame approach rate toward the target height. */
const EASE = 0.35;

/**
 * The episode transport — the mirrored waveform *is* the scrubber.
 *
 * Two independent channels, which is what lets the bars move without the
 * control losing its meaning:
 *   • colour  = position. Played bars are white, unplayed sit at the alpha
 *               ladder's `bar` value. This is the seek readout.
 *   • height  = audio. While playing, each bar is its own seeded height scaled
 *               by the live energy in the frequency band it maps to, read from
 *               a real AnalyserNode over the decoded stream. Paused, every bar
 *               settles back to that seeded silhouette.
 *
 * So the shape is the track's identity when idle and its voice when playing.
 * This is within guidelines ch.10 rather than an exception to it: the rule
 * forbids motion because a permanent pulse is a lie about state, and bars
 * driven by the audio actually decoding are the truest readout on the page.
 * `prefers-reduced-motion` drops the reactivity and keeps the static shape.
 *
 * Heights are written straight to the DOM as `scaleY` inside the rAF loop —
 * transform only, no layout, and no React render per frame. React owns colour
 * (repainted on `timeupdate`, ~4Hz) and never writes `transform`, so the two
 * never fight over the same element.
 *
 * Analysis needs a CORS-clean stream, so the element carries
 * `crossOrigin="anonymous"`. Libsyn serves `access-control-allow-origin: *` on
 * both the redirect and the object, but if that ever stops the load errors
 * rather than going quiet — so `onError` remounts a plain element without the
 * attribute and plays on without reactivity. Audio is the point; the bars aren't.
 *
 * Still `preload="none"`: nothing is fetched until someone presses play.
 */
export function LibsynPlayer({
  audioUrl,
  title,
  episodeNumber,
  /** Seeds the waveform silhouette. Pass the episode slug. */
  seed,
}: {
  audioUrl?: string;
  title: string;
  episodeNumber?: number;
  seed?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number>(undefined);
  const ctxRef = useRef<AudioContext>(undefined);
  const analyserRef = useRef<AnalyserNode>(undefined);
  const binsRef = useRef<Uint8Array>(undefined);
  /** Current on-screen scale per bar, so easing survives across frames. */
  const liveRef = useRef<number[]>([]);

  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  /** False once the CORS-clean element has failed and been swapped out. */
  const [analysed, setAnalysed] = useState(true);

  const shape = useMemo(() => silhouette(seed ?? title, BARS), [seed, title]);
  const shapeRef = useRef(shape);
  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  /** Log-spaced band edges over the sampled bin range. */
  const edges = useMemo(() => {
    const lo = 2;
    return Array.from({ length: BANDS + 1 }, (_, b) =>
      Math.round(lo * Math.pow(MAX_BIN / lo, b / BANDS)),
    );
  }, []);

  const paint = useCallback(
    (reactive: boolean) => {
      const analyser = reactive ? analyserRef.current : undefined;
      const bins = binsRef.current;
      const live = liveRef.current;
      const shp = shapeRef.current;

      let band: number[] | undefined;
      if (analyser && bins) {
        analyser.getByteFrequencyData(bins as Uint8Array<ArrayBuffer>);
        band = new Array(BANDS);
        for (let b = 0; b < BANDS; b++) {
          let peak = 0;
          for (let k = edges[b]!; k < Math.max(edges[b]! + 1, edges[b + 1]!); k++) {
            const v = bins[k] ?? 0;
            if (v > peak) peak = v;
          }
          // Speech spectra roll off steeply; the curve lifts the quiet bands
          // enough to be visible without flattening the loud ones.
          band[b] = Math.pow(peak / 255, 0.7);
        }
      }

      for (let i = 0; i < BARS; i++) {
        const el = barsRef.current[i];
        if (!el) continue;
        let target = shp[i]!;
        if (band) {
          const b = Math.min(BANDS - 1, Math.floor((((i * SWEEPS) / BARS) % 1) * BANDS));
          target = shp[i]! * (0.3 + 0.7 * band[b]!);
        }
        const prev = live[i] ?? target;
        const next = prev + (target - prev) * EASE;
        live[i] = next;
        el.style.transform = `scaleY(${next.toFixed(3)})`;
      }
    },
    [edges],
  );

  // Reactive loop. Runs only while audio is genuinely playing, and not at all
  // under reduced motion — where the shape holds still and the playhead, which
  // is position rather than decoration, keeps moving.
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!playing || reduced) {
      // Settle back to the silhouette rather than snapping to it.
      let frames = 0;
      const settle = () => {
        paint(false);
        if (++frames < 24) rafRef.current = requestAnimationFrame(settle);
      };
      rafRef.current = requestAnimationFrame(settle);
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const loop = () => {
      paint(true);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, paint]);

  useEffect(() => {
    return () => {
      void ctxRef.current?.close();
    };
  }, []);

  if (!audioUrl) {
    return (
      <div
        className="rounded-(--radius-brand) border border-white/[0.14] px-6 py-7"
        style={{ background: "rgb(255 255 255 / 0.03)" }}
      >
        <p className="font-mono text-eyebrow uppercase text-pale-accent">Audio</p>
        <p className="mt-2 text-body text-white/[0.66]">
          This conversation isn&apos;t published as audio yet. The show notes below carry it.
        </p>
      </div>
    );
  }

  /** Build the analysis graph on the first play — an AudioContext may only be
   *  started from a gesture, and a media element may be captured only once. */
  function connectAnalyser() {
    const el = audioRef.current;
    if (!analysed || !el || ctxRef.current) return;
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    try {
      const ctx = new Ctor();
      const source = ctx.createMediaElementSource(el);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      // The graph is now the only route to the speakers, so it must reach them.
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      binsRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch {
      // No analysis; the silhouette simply stays still. Audio is unaffected.
    }
  }

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      if (error) {
        setError(undefined);
        el.load();
      }
      connectAnalyser();
      void ctxRef.current?.resume();
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
    const pct = Number(e.target.value);
    setProgress(pct);
    const el = audioRef.current;
    if (!el || !duration) return;
    el.currentTime = (pct / 100) * duration;
  }

  const seekable = duration > 0 && !error;

  return (
    <div role="region" aria-label="Episode audio player" aria-busy={buffering}>
      <div className="flex items-center gap-5 sm:gap-7">
        <button
          onClick={toggle}
          aria-label={error ? "Retry playback" : playing ? "Pause episode" : "Play episode"}
          aria-pressed={playing}
          className="inline-flex size-14 shrink-0 items-center justify-center rounded-pill bg-white text-page-bg transition-colors duration-200 hover:bg-glow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-16"
        >
          {buffering ? (
            <Loader2 className="size-6 animate-spin" aria-hidden />
          ) : playing ? (
            <Pause className="size-6" aria-hidden />
          ) : (
            <Play className="size-6 translate-x-0.5" aria-hidden />
          )}
        </button>

        {/* Seek field: bars are paint, the range input is the control. */}
        <div className="relative min-w-0 flex-1">
          {/* Mirrored about the centre line — bars scale from their middle, so
              the field opens symmetrically. 3px bars on a 6px pitch (the 1:1
              ratio of design/waveform.svg); holding the gap at 3px and dropping
              bars per breakpoint keeps the bar near 3px at every width. Each
              tier addresses a disjoint set, so the rules never depend on CSS
              emission order. Indices never change, so thinning does not move
              the played/unplayed split. */}
          <div
            aria-hidden
            className="flex h-14 items-center gap-[3px] sm:h-20 [&>span:nth-child(4n+2)]:hidden [&>span:nth-child(4n+3)]:hidden [&>span:nth-child(4n+4)]:hidden sm:[&>span:nth-child(4n+3)]:block lg:[&>span:nth-child(4n+2)]:block lg:[&>span:nth-child(4n+4)]:block"
          >
            {shape.map((h, i) => {
              const played = seekable && (i + 1) / BARS <= progress / 100;
              return (
                <span
                  key={i}
                  ref={(node) => {
                    barsRef.current[i] = node;
                  }}
                  className="h-full min-w-px flex-1 origin-center rounded-pill"
                  style={{
                    // First paint is the silhouette; the rAF loop owns
                    // `transform` from then on and React never rewrites it.
                    transform: `scaleY(${h.toFixed(3)})`,
                    backgroundColor: played ? "#ffffff" : "rgb(255 255 255 / var(--alpha-bar))",
                  }}
                />
              );
            })}
          </div>

          {seekable ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-px"
              style={{
                left: `${progress}%`,
                backgroundColor: "rgb(255 255 255 / var(--alpha-dim))",
              }}
            />
          ) : null}

          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={onSeek}
            disabled={!seekable}
            aria-label="Seek"
            aria-valuetext={
              seekable
                ? `${fmt(current)} of ${fmt(duration)}`
                : "Position unavailable until the episode loads"
            }
            className="peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 outline-none disabled:cursor-default [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:border-0 [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:appearance-none"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-(--radius-tile) opacity-0 outline-2 outline-white peer-focus-visible:opacity-100"
          />
        </div>

        <a
          href={audioUrl}
          download
          aria-label={`Download episode audio${episodeNumber ? ` ${episodeNumber}` : ""}`}
          className="hidden size-12 shrink-0 items-center justify-center rounded-pill border border-white/[0.14] text-white/[0.66] transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
        >
          <Download className="size-4" aria-hidden />
        </a>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 font-mono text-eyebrow uppercase text-pale-accent">
        <span>{fmt(current)}</span>
        {/* State chip only exists when there is state to report. */}
        {error ? null : buffering ? (
          <span>Loading</span>
        ) : playing ? (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="size-1.5 rounded-pill bg-white animate-live-dot" />
            Playing
          </span>
        ) : null}
        <span>{duration ? fmt(duration) : "--:--"}</span>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-small text-white">
          {error} <span className="text-white/[0.66]">Press play to try again.</span>
        </p>
      ) : null}

      <audio
        // Swapping the key remounts a clean element: one that has already been
        // captured for analysis can never be un-captured.
        key={analysed ? "analysed" : "plain"}
        ref={audioRef}
        src={audioUrl}
        preload="none"
        crossOrigin={analysed ? "anonymous" : undefined}
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
          // The CORS request is the only thing this element does that a plain
          // one doesn't, so a first failure is worth retrying without it —
          // losing the reactive bars but keeping the episode playable.
          if (analysed) {
            setAnalysed(false);
            return;
          }
          setError("This episode's audio couldn't be loaded.");
        }}
      />
    </div>
  );
}

function fmt(s: number): string {
  if (!s || Number.isNaN(s) || !Number.isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/**
 * A stable per-episode bar profile in [0.4, 1] — the same dynamic range as the
 * WAVE token. Seeded so the server and the client agree and the shape survives
 * a rebuild; smoothed with a 3-tap mean so it has the rise and fall of speech
 * instead of reading as a barcode. This is the episode's fingerprint, not
 * amplitude data, and it is never labelled as any.
 */
function silhouette(seed: string, bars: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const raw = Array.from({ length: bars }, next);
  const smoothed = raw.map((v, i) => {
    const a = raw[(i - 1 + bars) % bars]!;
    const b = raw[(i + 1) % bars]!;
    return (a + v * 2 + b) / 4;
  });
  // Smoothing pulls the extremes toward the middle, so rescale back out to the
  // WAVE token's own 40-100 range — otherwise the resting shape reads flat.
  const lo = Math.min(...smoothed);
  const span = Math.max(...smoothed) - lo || 1;
  return smoothed.map((v) => 0.4 + 0.6 * ((v - lo) / span));
}
