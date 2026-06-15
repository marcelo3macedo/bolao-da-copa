import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { parseUTC } from "@/lib/dates";

export async function GET(req: NextRequest) {
  const participantId = req.nextUrl.searchParams.get("participant_id");
  if (!participantId)
    return NextResponse.json({ error: "Missing participant_id" }, { status: 400 });

  try {
    const [rows] = await db.execute(
      "SELECT * FROM bets WHERE participant_id = ?",
      [participantId]
    );
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { participant_id, game_id, home_score, away_score } = body;

  if (participant_id == null || game_id == null || home_score == null || away_score == null)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
    const [rows] = await db.execute<any[]>(
      "SELECT game_date, is_finished FROM games WHERE id = ?",
      [game_id]
    );
    if (!rows.length)
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });

    const game = rows[0];

    // parseUTC handles both string ("YYYY-MM-DD HH:MM:SS") and Date objects
    const gameStart = parseUTC(game.game_date);

    if (game.is_finished)
      return NextResponse.json({ error: "Jogo já encerrado" }, { status: 400 });

    if (gameStart <= new Date())
      return NextResponse.json({ error: "Jogo já iniciado" }, { status: 400 });

    await db.execute(
      `INSERT INTO bets (participant_id, game_id, home_score, away_score)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         home_score = VALUES(home_score),
         away_score = VALUES(away_score),
         updated_at = NOW()`,
      [participant_id, game_id, home_score, away_score]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[bets POST]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
