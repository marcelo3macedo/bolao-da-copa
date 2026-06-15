"use client";

import { useState, useEffect, useCallback } from "react";

interface Participant {
  id: number;
  name: string;
  token: string;
}

interface Game {
  id: number;
  home_team: string;
  away_team: string;
  home_flag: string;
  away_flag: string;
  game_date: string;
  stage: string;
  group_name: string | null;
  home_score: number | null;
  away_score: number | null;
  is_finished: boolean;
}

function parseUTC(dateStr: string) {
  return new Date(dateStr.replace(" ", "T") + "Z");
}

function formatDate(dateStr: string) {
  return parseUTC(dateStr).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const baseUrl =
  typeof window !== "undefined" ? window.location.origin : "";

interface GameWithBet {
  game_id: number;
  home_team: string;
  away_team: string;
  home_flag: string;
  away_flag: string;
  game_date: string;
  stage: string;
  group_name: string | null;
  is_finished: boolean;
  bet_id: number | null;
  home_score: number | null;
  away_score: number | null;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<"participants" | "games" | "results" | "bets">("results");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Bets editing state
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [participantBets, setParticipantBets] = useState<GameWithBet[]>([]);
  const [loadingBets, setLoadingBets] = useState(false);
  const [editedBets, setEditedBets] = useState<Record<number, { home: string; away: string }>>({});
  const [savingBet, setSavingBet] = useState<Record<number, boolean>>({});

  // New participant form
  const [newName, setNewName] = useState("");
  const [addingParticipant, setAddingParticipant] = useState(false);

  // New game form
  const [newGame, setNewGame] = useState({
    home_team: "",
    away_team: "",
    home_flag: "",
    away_flag: "",
    game_date: "",
    stage: "Fase de Grupos",
    group_name: "",
  });
  const [addingGame, setAddingGame] = useState(false);

  // Results
  const [results, setResults] = useState<Record<number, { home: string; away: string }>>({});
  const [savingResult, setSavingResult] = useState<Record<number, boolean>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [pRes, gRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/games"),
    ]);
    if (pRes.ok) setParticipants(await pRes.json());
    if (gRes.ok) setGames(await gRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addParticipant = async () => {
    if (!newName.trim()) return;
    setAddingParticipant(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      setNewName("");
      fetchData();
    }
    setAddingParticipant(false);
  };

  const deleteParticipant = async (id: number) => {
    if (!confirm("Remover este participante e todos seus palpites?")) return;
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const addGame = async () => {
    if (!newGame.home_team || !newGame.away_team || !newGame.game_date) return;
    setAddingGame(true);
    const res = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGame),
    });
    if (res.ok) {
      setNewGame({ home_team: "", away_team: "", home_flag: "", away_flag: "", game_date: "", stage: "Fase de Grupos", group_name: "" });
      fetchData();
    }
    setAddingGame(false);
  };

  const saveResult = async (gameId: number) => {
    const r = results[gameId];
    if (!r || r.home === "" || r.away === "") return;
    setSavingResult((prev) => ({ ...prev, [gameId]: true }));
    await fetch(`/api/admin/results/${gameId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        home_score: Number(r.home),
        away_score: Number(r.away),
        is_finished: true,
      }),
    });
    setSavingResult((prev) => ({ ...prev, [gameId]: false }));
    fetchData();
  };

  const reopenGame = async (gameId: number) => {
    await fetch(`/api/admin/results/${gameId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home_score: null, away_score: null, is_finished: false }),
    });
    fetchData();
  };

  const loadParticipantBets = async (participant: Participant) => {
    setSelectedParticipant(participant);
    setLoadingBets(true);
    setEditedBets({});
    const res = await fetch(`/api/admin/bets?participant_id=${participant.id}`);
    if (res.ok) {
      const data: GameWithBet[] = await res.json();
      setParticipantBets(data);
      const initial: Record<number, { home: string; away: string }> = {};
      data.forEach((g) => {
        initial[g.game_id] = {
          home: g.home_score != null ? String(g.home_score) : "",
          away: g.away_score != null ? String(g.away_score) : "",
        };
      });
      setEditedBets(initial);
    }
    setLoadingBets(false);
  };

  const saveBetAdmin = async (gameId: number) => {
    if (!selectedParticipant) return;
    const bet = editedBets[gameId];
    if (!bet || bet.home === "" || bet.away === "") return;
    setSavingBet((p) => ({ ...p, [gameId]: true }));
    await fetch("/api/admin/bets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participant_id: selectedParticipant.id,
        game_id: gameId,
        home_score: Number(bet.home),
        away_score: Number(bet.away),
      }),
    });
    setSavingBet((p) => ({ ...p, [gameId]: false }));
  };

  const deleteBetAdmin = async (gameId: number) => {
    if (!selectedParticipant) return;
    if (!confirm("Remover este palpite?")) return;
    await fetch(`/api/admin/bets?participant_id=${selectedParticipant.id}&game_id=${gameId}`, {
      method: "DELETE",
    });
    setEditedBets((p) => ({ ...p, [gameId]: { home: "", away: "" } }));
    setParticipantBets((prev) =>
      prev.map((g) => g.game_id === gameId ? { ...g, bet_id: null, home_score: null, away_score: null } : g)
    );
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  const upcomingGames = games.filter((g) => !g.is_finished);
  const finishedGames = games.filter((g) => g.is_finished);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
        <button
          onClick={logout}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800 p-1 rounded-xl flex-wrap">
        {(["results", "participants", "games", "bets"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? "bg-green-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "results" ? "Resultados" : t === "participants" ? "Participantes" : t === "games" ? "Jogos" : "Palpites"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Carregando...</div>
      ) : (
        <>
          {/* RESULTS TAB */}
          {tab === "results" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">
                Registrar Resultados
              </h2>
              {upcomingGames.length === 0 ? (
                <div className="bg-slate-800 rounded-xl p-6 text-center text-slate-400">
                  Nenhum jogo pendente de resultado.
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingGames.map((game) => (
                    <div key={game.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <div className="text-xs text-slate-400 mb-2">{formatDate(game.game_date)}</div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex-1 text-right font-semibold text-sm">
                          {game.home_flag} {game.home_team}
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="99"
                            placeholder="0"
                            value={results[game.id]?.home ?? ""}
                            onChange={(e) =>
                              setResults((p) => ({
                                ...p,
                                [game.id]: { home: e.target.value, away: p[game.id]?.away ?? "" },
                              }))
                            }
                            className="w-12 h-10 text-center text-lg font-bold bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                          />
                          <span className="text-slate-500">×</span>
                          <input
                            type="number"
                            min="0"
                            max="99"
                            placeholder="0"
                            value={results[game.id]?.away ?? ""}
                            onChange={(e) =>
                              setResults((p) => ({
                                ...p,
                                [game.id]: { home: p[game.id]?.home ?? "", away: e.target.value },
                              }))
                            }
                            className="w-12 h-10 text-center text-lg font-bold bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div className="flex-1 font-semibold text-sm">
                          {game.away_team} {game.away_flag}
                        </div>
                        <button
                          onClick={() => saveResult(game.id)}
                          disabled={savingResult[game.id]}
                          className="bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm px-4 py-2 rounded-lg"
                        >
                          {savingResult[game.id] ? "..." : "Finalizar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {finishedGames.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-bold text-slate-400 mb-3">Jogos Finalizados</h3>
                  <div className="space-y-2">
                    {finishedGames.map((game) => (
                      <div key={game.id} className="bg-slate-800 rounded-xl p-3 border border-slate-700 flex items-center gap-3">
                        <div className="flex-1 text-sm">
                          {game.home_flag} {game.home_team} <strong className="text-green-400">{game.home_score}</strong> × <strong className="text-green-400">{game.away_score}</strong> {game.away_team} {game.away_flag}
                        </div>
                        <button
                          onClick={() => reopenGame(game.id)}
                          className="text-xs text-yellow-400 hover:text-yellow-300"
                        >
                          Corrigir
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PARTICIPANTS TAB */}
          {tab === "participants" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Participantes</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addParticipant()}
                  placeholder="Nome do participante"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={addParticipant}
                  disabled={addingParticipant || !newName.trim()}
                  className="bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium"
                >
                  Adicionar
                </button>
              </div>

              <div className="space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-slate-400 mt-1 break-all">
                          {baseUrl}/apostar/{p.token}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              `${baseUrl}/apostar/${p.token}`
                            )
                          }
                          className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg"
                        >
                          Copiar Link
                        </button>
                        <button
                          onClick={() => deleteParticipant(p.id)}
                          className="text-xs bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1.5 rounded-lg"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GAMES TAB */}
          {tab === "games" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Gerenciar Jogos</h2>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 space-y-3">
                <h3 className="text-sm font-medium text-slate-300">Adicionar Jogo</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400">Mandante</label>
                    <input
                      value={newGame.home_team}
                      onChange={(e) => setNewGame((p) => ({ ...p, home_team: e.target.value }))}
                      placeholder="Ex: Brasil"
                      className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Visitante</label>
                    <input
                      value={newGame.away_team}
                      onChange={(e) => setNewGame((p) => ({ ...p, away_team: e.target.value }))}
                      placeholder="Ex: Argentina"
                      className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Bandeira Mandante (emoji)</label>
                    <input
                      value={newGame.home_flag}
                      onChange={(e) => setNewGame((p) => ({ ...p, home_flag: e.target.value }))}
                      placeholder="🇧🇷"
                      className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Bandeira Visitante (emoji)</label>
                    <input
                      value={newGame.away_flag}
                      onChange={(e) => setNewGame((p) => ({ ...p, away_flag: e.target.value }))}
                      placeholder="🇦🇷"
                      className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Data e Hora</label>
                    <input
                      type="datetime-local"
                      value={newGame.game_date}
                      onChange={(e) => setNewGame((p) => ({ ...p, game_date: e.target.value }))}
                      className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Fase</label>
                    <input
                      value={newGame.stage}
                      onChange={(e) => setNewGame((p) => ({ ...p, stage: e.target.value }))}
                      placeholder="Fase de Grupos"
                      className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Grupo (opcional)</label>
                    <input
                      value={newGame.group_name}
                      onChange={(e) => setNewGame((p) => ({ ...p, group_name: e.target.value }))}
                      placeholder="A, B, C..."
                      maxLength={5}
                      className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={addGame}
                  disabled={addingGame || !newGame.home_team || !newGame.away_team || !newGame.game_date}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  {addingGame ? "Adicionando..." : "Adicionar Jogo"}
                </button>
              </div>

              <div className="space-y-2">
                {games.map((game) => (
                  <div key={game.id} className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-sm">
                    <div className="flex items-center justify-between">
                      <span>
                        {game.home_flag} {game.home_team} × {game.away_team} {game.away_flag}
                      </span>
                      <span className="text-slate-400 text-xs">{formatDate(game.game_date)}</span>
                    </div>
                    {game.group_name && (
                      <span className="text-xs text-green-400">Grupo {game.group_name}</span>
                    )}
                    {game.is_finished && (
                      <span className="ml-2 text-xs text-yellow-400">
                        Resultado: {game.home_score}×{game.away_score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* BETS TAB */}
          {tab === "bets" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Editar Palpites</h2>

              {/* Participant selector */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Selecione um participante:</p>
                <div className="flex flex-wrap gap-2">
                  {participants.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => loadParticipantBets(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedParticipant?.id === p.id
                          ? "bg-green-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {loadingBets && (
                <div className="text-center py-6 text-slate-400">Carregando palpites...</div>
              )}

              {selectedParticipant && !loadingBets && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Palpites de <span className="text-white font-semibold">{selectedParticipant.name}</span> — edição sem restrições de horário.
                  </p>
                  {participantBets.map((g) => {
                    const bet = editedBets[g.game_id] ?? { home: "", away: "" };
                    const hasBet = bet.home !== "" && bet.away !== "";
                    return (
                      <div
                        key={g.game_id}
                        className="bg-slate-800 rounded-xl p-4 border border-slate-700"
                      >
                        <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
                          <span>{formatDate(g.game_date)}</span>
                          {g.is_finished && (
                            <span className="bg-slate-700 text-yellow-400 text-xs px-2 py-0.5 rounded">encerrado</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex-1 text-right font-semibold text-sm">
                            {g.home_flag} {g.home_team}
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="99"
                              placeholder="?"
                              value={bet.home}
                              onChange={(e) =>
                                setEditedBets((p) => ({
                                  ...p,
                                  [g.game_id]: { home: e.target.value, away: p[g.game_id]?.away ?? "" },
                                }))
                              }
                              className="w-12 h-10 text-center text-lg font-bold bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                            <span className="text-slate-500">×</span>
                            <input
                              type="number"
                              min="0"
                              max="99"
                              placeholder="?"
                              value={bet.away}
                              onChange={(e) =>
                                setEditedBets((p) => ({
                                  ...p,
                                  [g.game_id]: { home: p[g.game_id]?.home ?? "", away: e.target.value },
                                }))
                              }
                              className="w-12 h-10 text-center text-lg font-bold bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                            />
                          </div>
                          <div className="flex-1 font-semibold text-sm">
                            {g.away_team} {g.away_flag}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => saveBetAdmin(g.game_id)}
                              disabled={savingBet[g.game_id] || !hasBet}
                              className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white text-sm px-3 py-2 rounded-lg"
                            >
                              {savingBet[g.game_id] ? "..." : "Salvar"}
                            </button>
                            {g.bet_id != null && (
                              <button
                                onClick={() => deleteBetAdmin(g.game_id)}
                                className="bg-red-900 hover:bg-red-800 text-red-300 text-sm px-3 py-2 rounded-lg"
                              >
                                Apagar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
