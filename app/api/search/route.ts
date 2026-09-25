import { NextResponse } from "next/server";
import { search } from "@/backend/src/repositories/search";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const results = await search(q);
  return NextResponse.json(results);
}
