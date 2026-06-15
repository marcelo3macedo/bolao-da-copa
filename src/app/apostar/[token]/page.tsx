import { notFound } from "next/navigation";
import db from "@/lib/db";
import { Participant, Game, Bet } from "@/types";
import { RowDataPacket } from "mysql2";
import BettingForm from "./BettingForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ApostarPage({ params }: Props) {
  const { token } = await params;

  let participant: Participant | null = null;
  let games: Game[] = [];
  let existingBets: Record<number, Bet> = {};

  try {
    const [pRows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM participants WHERE token = ? LIMIT 1",
      [token]
    );
    if (pRows.length === 0) notFound();
    participant = pRows[0] as Participant;

    const [gRows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM games ORDER BY game_date ASC`
    );
    games = gRows as Game[];

    const [bRows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM bets WHERE participant_id = ?",
      [participant.id]
    );
    (bRows as Bet[]).forEach((b) => {
      existingBets[b.game_id] = b;
    });
  } catch {
    return (
      <div className="text-center py-20 text-slate-400">
        Erro ao conectar ao banco de dados. Tente novamente.
      </div>
    );
  }

  if (!participant) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">
          Faça seus Palpites!
        </h1>
        <p className="text-slate-400 mt-1">
          Copa do Mundo 2026
        </p>
      </div>
      <BettingForm
        participantId={participant.id}
        participantName={participant.name}
        games={games}
        existingBets={existingBets}
      />
    </div>
  );
}
