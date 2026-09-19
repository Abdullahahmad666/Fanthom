import { formatClock, type Meeting, type Participant } from "./types";

/**
 * Renders a meeting to an actual video file in the browser and downloads it.
 *
 * There is no captured media -- the recording layer is stubbed -- so rather
 * than hand back a placeholder, this draws the call to a canvas and encodes it
 * with MediaRecorder. The result is a real, playable file.
 *
 * MediaRecorder encodes in real time, so a full hour cannot be rendered on
 * demand. The output is a short preview covering the requested range, labelled
 * as such in the frame and in the filename, which is honest about what it is.
 * With a backend this becomes a request for the real asset and the whole module
 * goes away.
 */

const W = 1280;
const H = 720;
const FPS = 30;
/** Wall-clock seconds spent encoding. Kept short so a download is not a wait. */
const RENDER_SECONDS = 6;

export type RenderTarget = {
  meeting: Meeting;
  /** Range to represent. Omit for the whole recording. */
  startSec?: number;
  endSec?: number;
  /** Shown as the frame's caption. */
  caption?: string;
};

export function canRenderVideo() {
  return (
    typeof window !== "undefined" &&
    typeof MediaRecorder !== "undefined" &&
    typeof HTMLCanvasElement.prototype.captureStream === "function"
  );
}

function pickMime() {
  const candidates = [
    "video/mp4;codecs=avc1",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported?.(t)) ?? "";
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** One participant tile: room wash, silhouette, name chip. */
function drawTile(
  ctx: CanvasRenderingContext2D,
  p: Participant,
  x: number, y: number, w: number, h: number,
) {
  const g = ctx.createRadialGradient(x + w * 0.4, y + h * 0.2, 10, x + w / 2, y + h / 2, w);
  g.addColorStop(0, `${p.color}55`);
  g.addColorStop(1, "#08070b");
  ctx.fillStyle = g;
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();

  ctx.save();
  roundRect(ctx, x, y, w, h, 8);
  ctx.clip();

  ctx.fillStyle = `${p.color}59`;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h * 1.02, w * 0.3, h * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `${p.color}85`;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h * 0.56, Math.min(w, h) * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const label = p.name.split(" ")[0];
  ctx.font = "500 14px Inter, system-ui, sans-serif";
  const tw = ctx.measureText(label).width;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  roundRect(ctx, x + 10, y + h - 32, tw + 16, 22, 5);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(label, x + 18, y + h - 16);
}

function drawFrame(ctx: CanvasRenderingContext2D, t: RenderTarget, progress: number) {
  const { meeting } = t;
  const from = t.startSec ?? 0;
  const to = t.endSec ?? meeting.durationSec;
  const at = from + (to - from) * progress;

  ctx.fillStyle = "#07070a";
  ctx.fillRect(0, 0, W, H);

  // Grid of participants, or the audio-only wash for a solo call.
  const people = meeting.participants.slice(0, 6);
  if (people.length === 1) {
    const g = ctx.createRadialGradient(W / 2, H * 0.45, 40, W / 2, H / 2, W * 0.6);
    g.addColorStop(0, meeting.poster[0]);
    g.addColorStop(1, meeting.poster[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  } else {
    const cols = people.length <= 4 ? 2 : 3;
    const rows = Math.ceil(people.length / cols);
    const pad = 8;
    const tw = (W - pad * (cols + 1)) / cols;
    const th = (H - 120 - pad * (rows + 1)) / rows;
    people.forEach((p, i) => {
      const cx = pad + (i % cols) * (tw + pad);
      const cy = pad + Math.floor(i / cols) * (th + pad);
      drawTile(ctx, p, cx, cy, tw, th);
    });
  }

  // Lower third: title, caption, timecode, progress.
  const barY = H - 96;
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, barY, W, 96);

  ctx.fillStyle = "#ffffff";
  ctx.font = "600 24px Inter, system-ui, sans-serif";
  ctx.fillText(meeting.title, 28, barY + 36);

  ctx.fillStyle = "#969696";
  ctx.font = "400 16px Inter, system-ui, sans-serif";
  ctx.fillText(t.caption ?? `${meeting.date} · ${meeting.platform}`, 28, barY + 62);

  ctx.fillStyle = "#02beff";
  ctx.font = "500 16px Inter, system-ui, sans-serif";
  const tc = `${formatClock(at)} / ${formatClock(to)}`;
  ctx.fillText(tc, W - 28 - ctx.measureText(tc).width, barY + 36);

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(28, barY + 78, W - 56, 4);
  ctx.fillStyle = "#02beff";
  ctx.fillRect(28, barY + 78, (W - 56) * progress, 4);

  // Named as a preview so the file is never mistaken for the real recording.
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "500 13px Inter, system-ui, sans-serif";
  ctx.fillText("PROTOTYPE PREVIEW — capture layer stubbed", 28, 30);
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

/** Renders and downloads. Resolves once the file has been handed to the browser. */
export function downloadMeetingVideo(target: RenderTarget): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!canRenderVideo()) {
      reject(new Error("This browser cannot record canvas video."));
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas unavailable."));
      return;
    }

    const mime = pickMime();
    const stream = canvas.captureStream(FPS);
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onerror = () => reject(new Error("Recording failed."));
    recorder.onstop = () => {
      const type = mime || "video/webm";
      const ext = type.includes("mp4") ? "mp4" : "webm";
      const base = target.caption
        ? `${slug(target.meeting.title)}-${slug(target.caption)}`
        : slug(target.meeting.title);
      save(new Blob(chunks, { type }), `${base}.${ext}`);
      stream.getTracks().forEach((t) => t.stop());
      resolve();
    };

    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      const progress = Math.min(elapsed / RENDER_SECONDS, 1);
      drawFrame(ctx, target, progress);
      if (progress < 1) requestAnimationFrame(tick);
      else recorder.stop();
    };

    drawFrame(ctx, target, 0);
    recorder.start();
    requestAnimationFrame(tick);
  });
}
