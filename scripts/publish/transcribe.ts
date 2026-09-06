import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import matter from "gray-matter";
import { CONTENT_DIR, downloadAsset } from "../scrape/util";
import { episodeSchema, transcriptSchema, type Transcript } from "../../src/lib/schemas";

const CACHE_DIR = path.join(process.cwd(), "scripts", "publish", ".cache");
const AUDIO_DIR = path.join(CACHE_DIR, "audio");
const WHISPER_DIR = path.join(CACHE_DIR, "whisperx");
const TRANSCRIPTS_DIR = path.join(CONTENT_DIR, "transcripts");

type WhisperSegment = {
  start?: number;
  end?: number;
  text?: string;
  speaker?: string;
};

function listEpisodeFiles(): { slug: string; audioUrl?: string }[] {
  const dir = path.join(CONTENT_DIR, "episodes");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = episodeSchema.parse(matter(raw).data);
      return { slug: parsed.slug, audioUrl: parsed.audioUrl };
    });
}

function missingTranscripts() {
  return listEpisodeFiles().filter((ep) => {
    if (!ep.audioUrl) return false;
    return !fs.existsSync(path.join(TRANSCRIPTS_DIR, `${ep.slug}.json`));
  });
}

function requestedSlugs(): string[] {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (args.length) return args;
  if (process.argv.includes("--missing")) return missingTranscripts().map((e) => e.slug);
  const importedFile = path.join(CACHE_DIR, "imported-slugs.json");
  if (fs.existsSync(importedFile)) {
    const imported = JSON.parse(fs.readFileSync(importedFile, "utf8")) as string[];
    return imported.filter((slug) => !fs.existsSync(path.join(TRANSCRIPTS_DIR, `${slug}.json`)));
  }
  return missingTranscripts()
    .slice(0, 1)
    .map((e) => e.slug);
}

function whisperxAvailable(): boolean {
  const r = spawnSync("whisperx", ["--help"], { encoding: "utf8" });
  return r.status === 0;
}

function runWhisperx(audioPath: string) {
  fs.mkdirSync(WHISPER_DIR, { recursive: true });
  const args = [
    audioPath,
    "--model",
    process.env.WHISPER_MODEL ?? "small",
    "--output_format",
    "json",
    "--output_dir",
    WHISPER_DIR,
    "--compute_type",
    process.env.WHISPER_COMPUTE ?? "int8",
  ];
  if (process.env.HF_TOKEN) {
    args.push("--diarize", "--hf_token", process.env.HF_TOKEN);
  }
  const r = spawnSync("whisperx", args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error("whisperx failed");
}

function readWhisperJson(slug: string): WhisperSegment[] {
  const match = fs
    .readdirSync(WHISPER_DIR)
    .find((f) => f.startsWith(slug) && f.endsWith(".json"));
  if (!match) throw new Error(`No WhisperX JSON for ${slug}`);
  const raw = JSON.parse(fs.readFileSync(path.join(WHISPER_DIR, match), "utf8")) as {
    segments?: WhisperSegment[];
  };
  return raw.segments ?? [];
}

function toTranscript(slug: string, audioUrl: string, segments: WhisperSegment[]): Transcript {
  const mapped = segments
    .map((seg) => ({
      startSec: Number(seg.start ?? 0),
      endSec: Number(seg.end ?? 0),
      speaker: seg.speaker?.trim() || "SPEAKER_00",
      text: (seg.text ?? "").trim(),
    }))
    .filter((seg) => seg.text.length > 0);
  const speakerIds = [...new Set(mapped.map((s) => s.speaker))];
  return transcriptSchema.parse({
    slug,
    status: "machine",
    language: "en",
    model: process.env.WHISPER_MODEL ?? "small",
    generatedAt: new Date().toISOString(),
    audioUrl,
    speakers: speakerIds.map((id) => ({ id })),
    segments: mapped,
  });
}

async function transcribeOne(slug: string, audioUrl: string) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
  const audioPath = path.join(AUDIO_DIR, `${slug}.mp3`);
  const ok = await downloadAsset(audioUrl, audioPath);
  if (!ok) throw new Error(`Could not download audio for ${slug}`);
  runWhisperx(audioPath);
  const transcript = toTranscript(slug, audioUrl, readWhisperJson(slug));
  fs.writeFileSync(path.join(TRANSCRIPTS_DIR, `${slug}.json`), JSON.stringify(transcript, null, 2) + "\n");
  console.log(`transcribed ${slug} (${transcript.segments.length} segments)`);
}

async function main() {
  if (!whisperxAvailable()) {
    throw new Error("whisperx is not on PATH. Install it locally or in CI before generating transcripts.");
  }
  const episodes = listEpisodeFiles();
  const slugs = requestedSlugs();
  if (!slugs.length) {
    console.log("no episodes need transcription");
    return;
  }
  for (const slug of slugs) {
    const ep = episodes.find((e) => e.slug === slug);
    if (!ep?.audioUrl) {
      console.warn(`skip ${slug}: missing audioUrl`);
      continue;
    }
    await transcribeOne(slug, ep.audioUrl);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
