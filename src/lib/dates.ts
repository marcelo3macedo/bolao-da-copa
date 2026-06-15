const BRT = "America/Sao_Paulo";

// Handles MySQL "YYYY-MM-DD HH:MM:SS" strings, ISO strings, and Date objects
export function parseUTC(value: string | Date): Date {
  if (value instanceof Date) return value;
  // ISO format already (has "T" separator — e.g. from JSON serialization of Date)
  if (value.includes("T")) return new Date(value);
  // MySQL DATETIME format "YYYY-MM-DD HH:MM:SS" → interpret as UTC
  return new Date(value.replace(" ", "T") + "Z");
}

export function formatGameDate(dateStr: string | Date): string {
  return parseUTC(dateStr).toLocaleDateString("pt-BR", {
    timeZone: BRT,
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(dateStr: string | Date): string {
  return parseUTC(dateStr).toLocaleDateString("pt-BR", {
    timeZone: BRT,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isGamePast(dateStr: string | Date): boolean {
  return parseUTC(dateStr) <= new Date();
}
