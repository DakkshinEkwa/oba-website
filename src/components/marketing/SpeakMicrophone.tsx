"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const REST = { x: -8, y: 18 };
const MAX_PITCH = 22;
const DRAG = 0.4;
const SPIN_DEG_PER_MS = 0.018;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function SpeakMicrophone() {
  const [spin, setSpin] = useState(false);
  const [rot, setRot] = useState(REST);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!spin) return;
    let frame = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      if (!dragging.current) {
        setRot((r) => ({ ...r, y: r.y + dt * SPIN_DEG_PER_MS }));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spin]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setRot((r) => ({
      x: clamp(r.x - dy * DRAG, -MAX_PITCH, MAX_PITCH),
      y: r.y + dx * DRAG,
    }));
  }

  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <div className="flex flex-col items-center">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-[28rem] w-full max-w-xs cursor-grab touch-none select-none active:cursor-grabbing [perspective:960px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-16 bottom-4 h-5 rounded-[100%] bg-ink-900/40 blur-md"
        />
        <div
          className="absolute inset-0 flex items-center justify-center will-change-transform"
          style={{
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          }}
        >
          <Image
            src="/images/speak/studio-microphone.webp"
            alt=""
            width={323}
            height={640}
            draggable={false}
            className="h-[26rem] w-auto drop-shadow-lg"
          />
        </div>
      </div>
      <div className="mt-1 flex w-full max-w-xs items-center justify-between px-1">
        <p className="font-mono text-micro uppercase tracking-wide text-white/40">Drag to turn</p>
        <Button
          variant="frosted"
          size="sm"
          aria-pressed={spin}
          aria-label={spin ? "Pause microphone spin" : "Spin microphone"}
          onClick={() => setSpin((v) => !v)}
          className={cn(spin && "bg-white/20")}
        >
          {spin ? "Pause" : "Spin"}
        </Button>
      </div>
    </div>
  );
}
