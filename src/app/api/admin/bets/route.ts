import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const participantId = req.nextUrl.searchParams.get("participant_id");
  if (!participantId)
    return NextResponse.json({ error: "Missing participant_id" }, { status: 400 });

  try {
    const [rows] = await db.execute(
      `SELECT g.id as game_id, g.home_team, g.away_team, g.home_flag, g.away_flag,
              g.game_date, g.stage, g.group_name, g.is_finished,
              b.id as bet_id, b.home_score, b.away_score
       FROM games g
       LEFT JOIN bets b ON b.game_id = g.id AND b.participant_id = ?
       ORDER BY g.game_date ASC`,
      [participantId]
    );
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { participant_id, game_id, home_score, away_score } = body;

  if (participant_id == null || game_id == null || home_score == null || away_score == null)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
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
    console.error("[admin/bets PUT]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const participantId = req.nextUrl.searchParams.get("participant_id");
  const gameId = req.nextUrl.searchParams.get("game_id");

  if (!participantId || !gameId)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });

  try {
    await db.execute(
      "DELETE FROM bets WHERE participant_id = ? AND game_id = ?",
      [participantId, gameId]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
