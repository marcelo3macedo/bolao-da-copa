import db from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { LeaderboardEntry, BetWithGame } from "@/types";
import { calculatePoints } from "@/lib/scoring";
import { parseUTC } from "@/lib/dates";

export const revalidate = 30;

function formatDate(dateStr: string) {
  return parseUTC(dateStr).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ResultadosPage() {
  let leaderboard: LeaderboardEntry[] = [];
  let finishedGames: { id: number; home_team: string; away_team: string; home_flag: string; away_flag: string; home_score: number; away_score: number; game_date: string }[] = [];
  let participantBets: Record<number, BetWithGame[]> = {};
  let whatsappText = "";

  try {
    const [participants] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM participants ORDER BY name"
    );

    const [games] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM games WHERE is_finished = 1 ORDER BY game_date DESC"
    );

    finishedGames = games as typeof finishedGames;

    const leaderMap: Record<number, LeaderboardEntry> = {};

    for (const p of participants) {
      leaderMap[p.id] = {
        participant_id: p.id,
        name: p.name,
        total_points: 0,
        exact_scores: 0,
        correct_results: 0,
        total_bets: 0,
      };

      const [bets] = await db.execute<RowDataPacket[]>(
        `SELECT b.*, g.home_team, g.away_team, g.home_flag, g.away_flag,
                g.game_date, g.stage, g.home_score as actual_home,
                g.away_score as actual_away, g.is_finished
         FROM bets b JOIN games g ON b.game_id = g.id
         WHERE b.participant_id = ? AND g.is_finished = 1
         ORDER BY g.game_date DESC`,
        [p.id]
      );

      const betsWithPoints: BetWithGame[] = (bets as RowDataPacket[]).map((b) => {
        const pts = calculatePoints(
          b.home_score,
          b.away_score,
          b.actual_home,
          b.actual_away
        );
        leaderMap[p.id].total_points += pts;
        leaderMap[p.id].total_bets += 1;
        if (pts === 3) leaderMap[p.id].exact_scores += 1;
        if (pts === 1) leaderMap[p.id].correct_results += 1;
        return { ...(b as BetWithGame), points: pts };
      });

      participantBets[p.id] = betsWithPoints;
    }

    leaderboard = Object.values(leaderMap).sort(
      (a, b) => b.total_points - a.total_points || b.exact_scores - a.exact_scores
    );

    // Build WhatsApp text
    const lines = [
      "🏆 *BOLÃO COPA 2026* 🏆",
      "─────────────────",
      ...leaderboard.map(
        (e, i) =>
          `${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} ${e.name} - *${e.total_points} pts*`
      ),
      "─────────────────",
      `Jogos encerrados: ${finishedGames.length}`,
    ];
    whatsappText = encodeURIComponent(lines.join("\n"));
  } catch {
    return (
      <div className="text-center py-20 text-slate-400">
        Erro ao carregar resultados.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Classificação</h1>
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.122 1.522 5.856L0 24l6.335-1.51A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 01-5.017-1.376l-.36-.213-3.724.887.925-3.613-.234-.372A9.8 9.8 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
          Compartilhar no WhatsApp
        </a>
      </div>

      {/* Leaderboard */}
      {leaderboard.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
          Nenhum resultado disponível ainda.
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.participant_id}
              className={`bg-slate-800 rounded-xl p-4 border flex items-center gap-4 ${
                index === 0
                  ? "border-yellow-500"
                  : index === 1
                  ? "border-slate-400"
                  : index === 2
                  ? "border-amber-600"
                  : "border-slate-700"
              }`}
            >
              <div className="text-2xl w-8 text-center">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white">{entry.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {entry.exact_scores} placar(es) exato(s) · {entry.correct_results} resultado(s) certo(s) · {entry.total_bets} apostas
                </div>
              </div>
              <div className="text-2xl font-black text-green-400">
                {entry.total_points}
                <span className="text-sm font-normal text-slate-500 ml-1">pts</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Jogos encerrados */}
      {finishedGames.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Jogos Encerrados</h2>
          <div className="space-y-3">
            {finishedGames.map((game) => (
              <div
                key={game.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700"
              >
                <div className="text-xs text-slate-500 mb-2">
                  {formatDate(game.game_date)}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="font-semibold">{game.home_team}</span>
                    <span className="text-2xl">{game.home_flag}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-black text-white">
                      {game.home_score} × {game.away_score}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{game.away_flag}</span>
                    <span className="font-semibold">{game.away_team}</span>
                  </div>
                </div>
                {/* Palpites de cada participante */}
                <div className="mt-3 border-t border-slate-700 pt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {leaderboard.map((entry) => {
                    const bet = participantBets[entry.participant_id]?.find(
                      (b) => b.game_id === game.id
                    );
                    if (!bet) return null;
                    return (
                      <div
                        key={entry.participant_id}
                        className={`text-xs rounded px-2 py-1 ${
                          bet.points === 3
                            ? "bg-green-900 text-green-300"
                            : bet.points === 1
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        <span className="font-medium">{entry.name.split(" ")[0]}</span>:{" "}
                        {bet.home_score}×{bet.away_score}{" "}
                        {bet.points === 3 ? "🎯" : bet.points === 1 ? "✓" : "✗"}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
