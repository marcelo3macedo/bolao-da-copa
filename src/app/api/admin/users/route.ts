import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM participants ORDER BY name ASC"
    );
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name?.trim())
    return NextResponse.json({ error: "Name required" }, { status: 400 });

  const token = generateToken();

  try {
    const [result] = await db.execute<any>(
      "INSERT INTO participants (name, token) VALUES (?, ?)",
      [name.trim(), token]
    );
    return NextResponse.json({ id: result.insertId, name: name.trim(), token });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await db.execute("DELETE FROM participants WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 8; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
