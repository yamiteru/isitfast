export function removePercent(value: number, percent: number) {
  return value - (value / 100) * percent;
}
