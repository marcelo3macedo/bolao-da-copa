export function calculatePoints(
  betHome: number,
  betAway: number,
  actualHome: number,
  actualAway: number
): number {
  if (betHome === actualHome && betAway === actualAway) return 3;

  const getResult = (h: number, a: number) =>
    h > a ? "H" : h < a ? "A" : "D";

  if (getResult(betHome, betAway) === getResult(actualHome, actualAway))
    return 1;

  return 0;
}
