import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { home_team, away_team, home_flag, away_flag, game_date, stage, group_name } = body;

  if (!home_team || !away_team || !game_date) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  try {
    const [result] = await db.execute<any>(
      `INSERT INTO games (home_team, away_team, home_flag, away_flag, game_date, stage, group_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        home_team,
        away_team,
        home_flag || "",
        away_flag || "",
        game_date,
        stage || "Fase de Grupos",
        group_name || null,
      ]
    );
    return NextResponse.json({ id: result.insertId });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await db.execute("DELETE FROM games WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
