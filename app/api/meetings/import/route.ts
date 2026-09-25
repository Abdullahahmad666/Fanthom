import { NextResponse } from "next/server";
import { importTranscript } from "@/backend/src/services/import";

/** Transcripts are text; a generous ceiling that still refuses a wrong file. */
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ ok: false, error: "Expected a file upload." }, { status: 400 });
  }

  const file = form.get("file");
  const pasted = form.get("text");
  const title = (form.get("title") as string | null) ?? undefined;

  let raw: string;
  let filename: string;

  if (file instanceof File) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: "That file is larger than 4 MB. Transcripts are text, so this is probably a recording." },
        { status: 413 },
      );
    }
    raw = await file.text();
    filename = file.name;
  } else if (typeof pasted === "string" && pasted.trim()) {
    raw = pasted;
    filename = `${(title ?? "Pasted transcript").slice(0, 60)}.txt`;
  } else {
    return NextResponse.json({ ok: false, error: "No transcript was provided." }, { status: 400 });
  }

  const result = await importTranscript({ raw, filename, title });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
