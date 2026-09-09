import { siteConfig } from "@/lib/site";
import type { Transcript } from "@/lib/schemas";

export function formatTimestamp(sec: number | undefined): string | null {
  if (sec === undefined) return null;
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function speakerLabel(transcript: Transcript, speakerId: string): string {
  return transcript.speakers.find((s) => s.id === speakerId)?.name ?? speakerId;
}

export function transcriptStatusLabel(status: Transcript["status"]): string {
  return status === "reviewed" ? "Reviewed" : "Machine-generated, not yet reviewed";
}

export function toTranscriptMarkdown(input: {
  title: string;
  slug: string;
  transcript: Transcript;
}): string {
  const canonical = `${siteConfig.url}/podcast/episodes/${input.slug}`;
  const blocks = input.transcript.segments.map((seg) => {
    const who = speakerLabel(input.transcript, seg.speaker);
    const at = formatTimestamp(seg.startSec);
    return `## ${at ? `[${at}] ` : ""}${who}\n\n${seg.text.trim()}`;
  });
  return [
    `# ${input.title}`,
    "",
    `- Source: ${canonical}`,
    `- Transcript status: ${transcriptStatusLabel(input.transcript.status)}`,
    "",
    // Blocks are joined with a blank line: each already ends with its own text,
    // so a single newline would run the next speaker heading onto it.
    blocks.join("\n\n"),
    "",
  ].join("\n");
}
