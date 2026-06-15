import { NextResponse } from "next/server";
import db from "@/lib/db";
import { calculatePoints } from "@/lib/scoring";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [participants] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM participants ORDER BY name"
    );

    const leaderboard = [];

    for (const p of participants) {
      const [bets] = await db.execute<RowDataPacket[]>(
        `SELECT b.home_score, b.away_score, g.home_score as actual_home, g.away_score as actual_away
         FROM bets b JOIN games g ON b.game_id = g.id
         WHERE b.participant_id = ? AND g.is_finished = 1`,
        [p.id]
      );

      let points = 0;
      let exact = 0;
      let correct = 0;

      for (const bet of bets) {
        const pts = calculatePoints(
          bet.home_score,
          bet.away_score,
          bet.actual_home,
          bet.actual_away
        );
        points += pts;
        if (pts === 3) exact++;
        if (pts === 1) correct++;
      }

      leaderboard.push({
        participant_id: p.id,
        name: p.name,
        total_points: points,
        exact_scores: exact,
        correct_results: correct,
        total_bets: bets.length,
      });
    }

    leaderboard.sort(
      (a, b) =>
        b.total_points - a.total_points || b.exact_scores - a.exact_scores
    );

    return NextResponse.json(leaderboard);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
