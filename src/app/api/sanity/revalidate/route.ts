import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (secret) {
    const provided =
      request.headers.get("x-sanity-secret") ||
      new URL(request.url).searchParams.get("secret");
    if (provided !== secret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  revalidatePath("/stories");
  revalidatePath("/stories/[slug]", "page");

  return NextResponse.json({ ok: true, revalidated: true });
}
