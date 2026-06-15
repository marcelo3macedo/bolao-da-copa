import db from "@/lib/db";
import { Game } from "@/types";
import { RowDataPacket } from "mysql2";
import { formatGameDate } from "@/lib/dates";
import { calculatePoints } from "@/lib/scoring";

export const revalidate = 60;

interface BetEntry {
  participant_name: string;
  home_score: number;
  away_score: number;
}

interface GameWithBets extends Game {
  bets: BetEntry[];
}

async function fetchGamesWithBets(
  query: string,
  params: (string | number)[] = []
): Promise<GameWithBets[]> {
  const [gameRows] = await db.execute<RowDataPacket[]>(query, params);
  const games = gameRows as Game[];
  if (games.length === 0) return [];

  const gameIds = games.map((g) => g.id);
  const placeholders = gameIds.map(() => "?").join(",");
  const [betRows] = await db.execute<RowDataPacket[]>(
    `SELECT b.game_id, p.name AS participant_name, b.home_score, b.away_score
     FROM bets b
     JOIN participants p ON b.participant_id = p.id
     WHERE b.game_id IN (${placeholders})
     ORDER BY p.name ASC`,
    gameIds
  );

  const betsByGame = new Map<number, BetEntry[]>();
  for (const bet of betRows as (BetEntry & { game_id: number })[]) {
    if (!betsByGame.has(bet.game_id)) betsByGame.set(bet.game_id, []);
    betsByGame.get(bet.game_id)!.push({
      participant_name: bet.participant_name,
      home_score: bet.home_score,
      away_score: bet.away_score,
    });
  }

  return games.map((g) => ({ ...g, bets: betsByGame.get(g.id) ?? [] }));
}

export default async function HomePage() {
  let upcomingGames: GameWithBets[] = [];
  let recentGames: GameWithBets[] = [];

  try {
    [upcomingGames, recentGames] = await Promise.all([
      fetchGamesWithBets(
        `SELECT * FROM games WHERE is_finished = 0 AND game_date >= NOW()
         ORDER BY game_date ASC LIMIT 20`
      ),
      fetchGamesWithBets(
        `SELECT * FROM games WHERE is_finished = 1
         ORDER BY game_date DESC LIMIT 10`
      ),
    ]);
  } catch {
    // DB not ready yet
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4 py-8">
        <div className="text-6xl">🏆</div>
        <h1 className="text-4xl font-bold text-white">
          Bolão Copa do Mundo 2026
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Faça seus palpites para os jogos da Copa! Acerte o placar exato e
          ganhe 3 pontos. Acerte o resultado e ganhe 1 ponto.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="/resultados"
            className="bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: "#eab308" }}
          >
            Ver Classificação
          </a>
        </div>
      </div>

      {/* Pontuação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex items-center gap-4">
          <div className="text-4xl font-black text-green-400">3</div>
          <div>
            <div className="font-bold text-white">Placar Exato</div>
            <div className="text-slate-400 text-sm">
              Acertou o placar certinho
            </div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex items-center gap-4">
          <div className="text-4xl font-black text-yellow-400">1</div>
          <div>
            <div className="font-bold text-white">Resultado Correto</div>
            <div className="text-slate-400 text-sm">
              Acertou quem ganhou ou empate
            </div>
          </div>
        </div>
      </div>

      {/* Próximos jogos */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Próximos Jogos
        </h2>
        {upcomingGames.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
            Nenhum jogo agendado no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingGames.map((game) => (
              <div
                key={game.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-slate-400 font-medium">
                    {game.group_name && (
                      <span className="bg-green-700 text-green-100 px-2 py-0.5 rounded mr-2">
                        Grupo {game.group_name}
                      </span>
                    )}
                    {formatGameDate(game.game_date)}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-right flex-1 justify-end">
                    <span className="font-semibold">{game.home_team}</span>
                    <span className="text-2xl">{game.home_flag}</span>
                  </div>
                  <div className="text-slate-500 font-bold text-lg px-2">
                    VS
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{game.away_flag}</span>
                    <span className="font-semibold">{game.away_team}</span>
                  </div>
                </div>
                {game.bets.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-500 font-medium mb-2">
                      Palpites ({game.bets.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {game.bets.map((bet) => (
                        <div
                          key={bet.participant_name}
                          className="flex items-center gap-1.5 bg-slate-700 rounded-lg px-2.5 py-1 text-sm"
                        >
                          <span className="text-slate-300">{bet.participant_name}</span>
                          <span className="text-slate-500">·</span>
                          <span className="font-bold text-white">
                            {bet.home_score} × {bet.away_score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Últimos jogos */}
      {recentGames.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Últimos Jogos</h2>
          <div className="space-y-3">
            {recentGames.map((game) => (
              <div
                key={game.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-slate-400 font-medium">
                    {game.group_name && (
                      <span className="bg-green-700 text-green-100 px-2 py-0.5 rounded mr-2">
                        Grupo {game.group_name}
                      </span>
                    )}
                    {formatGameDate(game.game_date)}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Encerrado</span>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-right flex-1 justify-end">
                    <span className="font-semibold">{game.home_team}</span>
                    <span className="text-2xl">{game.home_flag}</span>
                  </div>
                  <div className="text-white font-black text-2xl px-3 bg-slate-700 rounded-lg py-1 min-w-[80px] text-center">
                    {game.home_score} – {game.away_score}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{game.away_flag}</span>
                    <span className="font-semibold">{game.away_team}</span>
                  </div>
                </div>
                {game.bets.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-xs text-slate-500 font-medium mb-2">
                      Palpites ({game.bets.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {game.bets.map((bet) => {
                        const pts = calculatePoints(
                          bet.home_score,
                          bet.away_score,
                          game.home_score!,
                          game.away_score!
                        );
                        const chipClass =
                          pts === 3
                            ? "bg-green-800 border border-green-600"
                            : pts === 1
                            ? "bg-yellow-800 border border-yellow-600"
                            : "bg-slate-700";
                        const scoreClass =
                          pts === 3
                            ? "text-green-300"
                            : pts === 1
                            ? "text-yellow-300"
                            : "text-slate-400";
                        return (
                          <div
                            key={bet.participant_name}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm ${chipClass}`}
                          >
                            <span className="text-slate-300">{bet.participant_name}</span>
                            <span className="text-slate-500">·</span>
                            <span className={`font-bold ${scoreClass}`}>
                              {bet.home_score} × {bet.away_score}
                            </span>
                            {pts > 0 && (
                              <span className={`text-xs font-bold ${scoreClass}`}>
                                +{pts}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Como participar */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-3">
          Como Participar?
        </h2>
        <p className="text-slate-400">
          Você precisa de um link personalizado para fazer seus palpites.
          Solicite ao administrador do bolão e acesse seu link único para
          registrar seus palpites nos jogos!
        </p>
      </div>
    </div>
  );
}
