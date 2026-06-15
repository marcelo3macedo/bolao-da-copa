import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

interface Props {
  params: Promise<{ gameId: string }>;
}

export async function PUT(req: NextRequest, { params }: Props) {
  const { gameId } = await params;
  const body = await req.json();
  const { home_score, away_score, is_finished } = body;

  try {
    await db.execute(
      "UPDATE games SET home_score = ?, away_score = ?, is_finished = ? WHERE id = ?",
      [
        home_score ?? null,
        away_score ?? null,
        is_finished ? 1 : 0,
        gameId,
      ]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
