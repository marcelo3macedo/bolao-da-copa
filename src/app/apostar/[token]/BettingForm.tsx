"use client";

import { useState } from "react";
import { Game, Bet } from "@/types";
import { parseUTC } from "@/lib/dates";

interface Props {
  participantId: number;
  participantName: string;
  games: Game[];
  existingBets: Record<number, Bet>;
}

const BRT = "America/Sao_Paulo";

function fmtDate(dateStr: string | Date) {
  const d = parseUTC(dateStr);
  const weekday = d.toLocaleDateString("pt-BR", { timeZone: BRT, weekday: "short" });
  const day = d.toLocaleDateString("pt-BR", { timeZone: BRT, day: "2-digit", month: "2-digit" });
  const time = d.toLocaleTimeString("pt-BR", { timeZone: BRT, hour: "2-digit", minute: "2-digit" });
  return { weekday, day, time };
}

export default function BettingForm({ participantId, participantName, games, existingBets }: Props) {
  const [bets, setBets] = useState<Record<number, { home: string; away: string }>>(() => {
    const init: Record<number, { home: string; away: string }> = {};
    games.forEach((g) => {
      const ex = existingBets[g.id];
      init[g.id] = ex
        ? { home: String(ex.home_score), away: String(ex.away_score) }
        : { home: "", away: "" };
    });
    return init;
  });

  const [saving, setSaving] = useState<Record<number, "idle" | "saving" | "saved" | "error">>({});
  const [globalStatus, setGlobalStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateBet = (gameId: number, side: "home" | "away", value: string) => {
    if (value !== "" && (!/^\d+$/.test(value) || Number(value) > 99)) return;
    setBets((prev) => ({ ...prev, [gameId]: { ...prev[gameId], [side]: value } }));
  };

  const saveBet = async (gameId: number) => {
    const bet = bets[gameId];
    if (!bet || bet.home === "" || bet.away === "") return;
    setSaving((prev) => ({ ...prev, [gameId]: "saving" }));
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: participantId,
          game_id: gameId,
          home_score: Number(bet.home),
          away_score: Number(bet.away),
        }),
      });
      if (res.ok) {
        setSaving((prev) => ({ ...prev, [gameId]: "saved" }));
        showToast("Palpite salvo!", "ok");
      } else {
        const data = await res.json().catch(() => ({}));
        setSaving((prev) => ({ ...prev, [gameId]: "error" }));
        showToast(data.error || "Erro ao salvar palpite", "err");
      }
    } catch {
      setSaving((prev) => ({ ...prev, [gameId]: "error" }));
      showToast("Sem conexão — palpite não salvo", "err");
    }
  };

  const saveAll = async () => {
    setGlobalStatus("saving");
    const pending = games.filter(
      (g) =>
        parseUTC(g.game_date) > new Date() &&
        !g.is_finished &&
        bets[g.id]?.home !== "" &&
        bets[g.id]?.away !== ""
    );
    try {
      await Promise.all(pending.map((g) => saveBet(g.id)));
      setGlobalStatus("saved");
      setTimeout(() => setGlobalStatus("idle"), 3000);
    } catch {
      setGlobalStatus("error");
    }
  };

  const openCount = games.filter((g) => parseUTC(g.game_date) > new Date() && !g.is_finished).length;
  const savedCount = Object.keys(existingBets).length;
  const pendingCount = games.filter(
    (g) =>
      parseUTC(g.game_date) > new Date() &&
      !g.is_finished &&
      bets[g.id]?.home !== "" &&
      bets[g.id]?.away !== ""
  ).length;

  return (
    <div className="space-y-4">
      {/* Cabeçalho do apostador */}
      <div className="bg-slate-800 rounded-xl p-4 border border-green-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">👤</span>
          <div>
            <div className="text-xs text-slate-400">Apostador</div>
            <div className="text-lg font-bold text-white">{participantName}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-green-400">{savedCount}</div>
          <div className="text-xs text-slate-400">de {games.length} palpites</div>
        </div>
      </div>

      {/* Toast de feedback */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-xl transition-all ${
            toast.type === "ok"
              ? "bg-green-600 text-white"
              : "bg-red-700 text-white"
          }`}
        >
          {toast.type === "ok" ? "✓ " : "✗ "}{toast.msg}
        </div>
      )}

      {/* Instrução */}
      <div className="text-xs text-slate-500 text-center px-2">
        Palpites bloqueados automaticamente no horário de início de cada jogo.
        Salvo automaticamente ao sair do campo.
      </div>

      {/* Lista plana ordenada por data */}
      {games.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-8 text-center text-slate-400">
          Nenhum jogo disponível.
        </div>
      ) : (
        <div className="space-y-2">
          {games.map((game) => {
            const bet = bets[game.id] || { home: "", away: "" };
            const status = saving[game.id] || "idle";
            const hasBet = existingBets[game.id] !== undefined;
            const isPast = game.is_finished || parseUTC(game.game_date) <= new Date();
            const { weekday, day, time } = fmtDate(game.game_date);

            /* ── JOGO JÁ ACONTECEU ── ofuscado, sem ação */
            if (isPast) {
              return (
                <div
                  key={game.id}
                  className="opacity-35 pointer-events-none select-none bg-slate-900 rounded-xl border border-slate-800"
                >
                  <div className="flex items-center gap-1.5 px-3 pt-2 pb-0.5 text-[11px] text-slate-600">
                    <span className="capitalize">{weekday}</span>
                    <span>{day}</span>
                    <span>{time}</span>
                    {game.group_name && (
                      <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded ml-1">
                        Gr.{game.group_name}
                      </span>
                    )}
                    <span className="ml-auto">
                      {game.is_finished ? "encerrado" : "em andamento"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 pb-2.5 pt-1">
                    {/* Mandante */}
                    <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
                      <span className="text-sm text-slate-500 text-right leading-tight truncate">
                        {game.home_team}
                      </span>
                      <span className="text-lg shrink-0 grayscale">{game.home_flag}</span>
                    </div>

                    {/* Placar central */}
                    <div className="shrink-0 text-center px-2">
                      {game.is_finished ? (
                        <div className="text-base font-black text-slate-500">
                          {game.home_score} × {game.away_score}
                        </div>
                      ) : (
                        <div className="text-slate-700 text-sm font-bold">vs</div>
                      )}
                      {hasBet && (
                        <div className="text-[10px] text-slate-700 mt-0.5">
                          palpite: {existingBets[game.id].home_score}×{existingBets[game.id].away_score}
                        </div>
                      )}
                    </div>

                    {/* Visitante */}
                    <div className="flex-1 flex items-center gap-1.5 min-w-0">
                      <span className="text-lg shrink-0 grayscale">{game.away_flag}</span>
                      <span className="text-sm text-slate-500 leading-tight truncate">
                        {game.away_team}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            /* ── JOGO FUTURO ── ativo com inputs */
            return (
              <div
                key={game.id}
                className={`bg-slate-800 rounded-xl border ${
                  hasBet ? "border-green-800" : "border-slate-600"
                }`}
              >
                {/* Info: data + grupo + status */}
                <div className="flex items-center justify-between px-3 pt-2.5 pb-1 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 min-w-0">
                    <span className="capitalize">{weekday}</span>
                    <span>{day}</span>
                    <span className="font-semibold text-slate-200">{time}</span>
                    {game.group_name && (
                      <span className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono ml-1">
                        Gr.{game.group_name}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] shrink-0">
                    {hasBet ? (
                      <span className="text-green-500">✓ salvo</span>
                    ) : (
                      <span className="text-slate-600">sem palpite</span>
                    )}
                  </div>
                </div>

                {/* Placar com inputs */}
                <div className="flex items-center gap-2 px-3 pb-3 pt-0.5">
                  <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
                    <span className="font-semibold text-sm text-right leading-tight truncate">
                      {game.home_team}
                    </span>
                    <span className="text-xl shrink-0">{game.home_flag}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max="99"
                      value={bet.home}
                      onChange={(e) => updateBet(game.id, "home", e.target.value)}
                      onBlur={() => saveBet(game.id)}
                      placeholder="–"
                      className="w-11 h-10 text-center text-xl font-black bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-slate-500 font-bold">×</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max="99"
                      value={bet.away}
                      onChange={(e) => updateBet(game.id, "away", e.target.value)}
                      onBlur={() => saveBet(game.id)}
                      placeholder="–"
                      className="w-11 h-10 text-center text-xl font-black bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="w-4 text-center ml-0.5">
                      {status === "saving" && <span className="text-slate-400 text-xs">…</span>}
                      {status === "saved"  && <span className="text-green-400 text-sm">✓</span>}
                      {status === "error"  && <span className="text-red-400 text-xs">!</span>}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-1.5 min-w-0">
                    <span className="text-xl shrink-0">{game.away_flag}</span>
                    <span className="font-semibold text-sm leading-tight truncate">
                      {game.away_team}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botão salvar todos — fixo no rodapé */}
      {openCount > 0 && (
        <div className="sticky bottom-4 pt-2">
          <button
            onClick={saveAll}
            disabled={globalStatus === "saving" || pendingCount === 0}
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-base transition-colors shadow-lg shadow-green-900/40"
          >
            {globalStatus === "saving"
              ? "Salvando…"
              : globalStatus === "saved"
              ? "✓ Palpites salvos!"
              : globalStatus === "error"
              ? "Erro — tente novamente"
              : pendingCount > 0
              ? `Salvar ${pendingCount} palpite${pendingCount !== 1 ? "s" : ""}`
              : "Preencha os placares acima"}
          </button>
        </div>
      )}
    </div>
  );
}
