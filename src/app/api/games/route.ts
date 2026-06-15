import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM games ORDER BY game_date ASC"
    );
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
