"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { Host } from "@/lib/schemas";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.5 },
  },
};

const avatar: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/** Overlapping headshot stack: the real people behind the show, not stock art. */
export function HeroHostStack({ hosts }: { hosts: Host[] }) {
  const shown = hosts.filter((h) => h.avatar).slice(0, 6);
  if (shown.length === 0) return null;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="flex items-center gap-4"
    >
      <div className="flex">
        {shown.map((host, i) => (
          <motion.div
            key={host.slug}
            variants={avatar}
            style={{ zIndex: i }}
            whileHover={{ y: -4, scale: 1.08, zIndex: 20 }}
            className="-ml-3 shrink-0 first:ml-0"
          >
            <div className="size-11 overflow-hidden rounded-full bg-ink-700 shadow-lg ring-1 ring-white/15 sm:size-12">
              <Image
                src={host.avatar!}
                alt={host.name}
                width={96}
                height={96}
                className="size-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        variants={avatar}
        className="font-mono text-eyebrow uppercase text-white/45"
      >
        {shown.length} hosts
        <br />
        since 2022
      </motion.p>
    </motion.div>
  );
}
