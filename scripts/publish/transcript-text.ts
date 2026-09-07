import { transcriptSchema, type Transcript } from "../../src/lib/schemas";

/**
 * Parse a hand-authored transcript out of one spreadsheet cell.
 *
 * Transcripts are written and reviewed by a person in the episode sheet, not
 * generated here, so this accepts the shapes a human actually pastes — the
 * exports of Otter, Descript, YouTube, Libsyn and Zoom all reduce to "an
 * optional timestamp, a speaker, then what they said":
 *
 *     [00:12:34] Sarah Duval: text        00:12:34 Sarah Duval: text
 *     (12:34) Sarah Duval: text           12:34 Sarah Duval: text
 *     Sarah Duval: text                   Sarah Duval [12:34]: text
 *
 * Lines that carry no speaker continue the previous turn, so a paragraph that
 * wraps stays one segment. Timestamps are optional throughout: a transcript
 * pasted without them is still a valid transcript, and the page simply shows
 * speaker names with no clock.
 */

/** `[00:12:34]`, `(12:34)`, `00:12:34` or `12:34`, with optional decimals. */
const LEADING_TIMESTAMP = /^\s*[[(]?\s*(?:(\d{1,3}):)?(\d{1,2}):(\d{2})(?:\.\d+)?\s*[\])]?[\s–—-]*/;

/** A trailing `[12:34]` or `(12:34)` after the speaker name, before the colon. */
const TRAILING_TIMESTAMP = /[[(]\s*(?:(\d{1,3}):)?(\d{1,2}):(\d{2})(?:\.\d+)?\s*[\])]\s*$/;

function toSeconds(h: string | undefined, m: string, s: string): number {
  return (h ? Number(h) * 3600 : 0) + Number(m) * 60 + Number(s);
}

/**
 * Is this the "Name:" part of a speaker line, rather than prose that happens to
 * contain a colon? A speaker label is short and has no sentence punctuation —
 * which keeps "Here's the thing: we hired two techs" from being read as a
 * speaker named "Here's the thing".
 */
function isSpeakerLabel(candidate: string): boolean {
  const name = candidate.trim();
  if (!name || name.length > 60) return false;
  if (name.split(/\s+/).length > 8) return false;
  // Sentence punctuation, or a period that isn't an honorific/initial full stop.
  if (/[?!;]/.test(name)) return false;
  if (/\.\s+[a-z]/.test(name)) return false;
  return true;
}

/** Index of the first `:` not enclosed in brackets or parentheses, or -1. */
function firstColonOutsideBrackets(line: string): number {
  let depth = 0;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === "[" || c === "(") depth += 1;
    else if (c === "]" || c === ")") depth = Math.max(0, depth - 1);
    else if (c === ":" && depth === 0) return i;
  }
  return -1;
}

type Draft = { startSec?: number; speaker: string; lines: string[] };

export function parseTranscriptText(raw: string): {
  segments: { startSec?: number; endSec?: number; speaker: string; text: string }[];
  speakers: { id: string; name?: string }[];
} {
  const drafts: Draft[] = [];

  for (const rawLine of raw.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    let rest = line;
    let startSec: number | undefined;

    const lead = rest.match(LEADING_TIMESTAMP);
    if (lead) {
      startSec = toSeconds(lead[1], lead[2], lead[3]);
      rest = rest.slice(lead[0].length);
    }

    // Speaker labels end at the first colon — but only one outside brackets, or
    // "Sarah Duval [12:34]:" would terminate inside its own timestamp.
    const colon = firstColonOutsideBrackets(rest);
    if (colon > 0) {
      let name = rest.slice(0, colon);
      const trailing = name.match(TRAILING_TIMESTAMP);
      if (trailing) {
        startSec ??= toSeconds(trailing[1], trailing[2], trailing[3]);
        name = name.slice(0, trailing.index);
      }
      if (isSpeakerLabel(name)) {
        drafts.push({
          startSec,
          speaker: name.trim(),
          lines: [rest.slice(colon + 1).trim()].filter(Boolean),
        });
        continue;
      }
    }

    // No speaker on this line: it continues the current turn. A transcript that
    // opens with unattributed prose still gets a segment, credited to nobody.
    const current = drafts.at(-1);
    if (current) {
      current.lines.push(rest);
    } else {
      drafts.push({ startSec, speaker: "Unattributed", lines: [rest] });
    }
  }

  const segments = drafts
    .map((d) => ({ startSec: d.startSec, speaker: d.speaker, text: d.lines.join(" ").trim() }))
    .filter((seg) => seg.text.length > 0)
    // A turn runs until the next one starts; the last has no known end.
    .map((seg, i, all) => {
      const next = all[i + 1]?.startSec;
      return next !== undefined && seg.startSec !== undefined && next > seg.startSec
        ? { ...seg, endSec: next }
        : seg;
    });

  const speakers = [...new Set(segments.map((s) => s.speaker))].map((name) => ({
    id: name,
    name,
  }));

  return { segments, speakers };
}

/**
 * Build a validated transcript record from sheet input.
 *
 * `status` defaults to "reviewed" — unlike a machine transcript, a person wrote
 * this one into the sheet, and the page's status line says so. Pass "machine"
 * explicitly for anything pasted straight out of an ASR tool without a read-through.
 */
export function transcriptFromText(input: {
  slug: string;
  text: string;
  status?: "machine" | "reviewed";
  audioUrl?: string;
}): Transcript | null {
  const { segments, speakers } = parseTranscriptText(input.text);
  if (!segments.length) return null;
  return transcriptSchema.parse({
    slug: input.slug,
    status: input.status ?? "reviewed",
    language: "en",
    generatedAt: new Date().toISOString(),
    ...(input.audioUrl ? { audioUrl: input.audioUrl } : {}),
    speakers,
    segments,
  });
}
