import { Eyebrow } from "@/components/ui/Eyebrow";
import { CopyMarkdownButton } from "./CopyMarkdownButton";
import type { Transcript } from "@/lib/schemas";
import {
  formatTimestamp,
  speakerLabel,
  toTranscriptMarkdown,
  transcriptStatusLabel,
} from "@/lib/transcripts";

export function TranscriptPanel({
  title,
  slug,
  transcript,
}: {
  title: string;
  slug: string;
  transcript: Transcript;
}) {
  const markdown = toTranscriptMarkdown({ title, slug, transcript });

  return (
    <section className="mt-10 border-t border-line pt-8" aria-labelledby="transcript-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Transcript</Eyebrow>
          <h2 id="transcript-heading" className="mt-2 text-h3 font-normal text-ink-900">
            Episode transcript
          </h2>
          <p className="mt-1 text-small text-ink-500">{transcriptStatusLabel(transcript.status)}</p>
        </div>
        <CopyMarkdownButton markdown={markdown} />
      </div>
      <ol className="mt-6 space-y-5">
        {transcript.segments.map((seg, i) => (
          <li key={`${seg.startSec}-${i}`}>
            <p className="font-mono text-eyebrow uppercase text-ink-400">
              {formatTimestamp(seg.startSec)}
              <span aria-hidden> · </span>
              {speakerLabel(transcript, seg.speaker)}
            </p>
            <p className="mt-1 text-body text-ink-700">{seg.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
