export function formatScore(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.round(value));
}

export function formatPercent(rate: number): string {
  const sign = rate > 0 ? '+' : '';
  return `${sign}${(rate * 100).toFixed(1)}%`;
}

export function formatPrice(price?: number | null): string {
  if (price == null) {
    return '가격 정보 없음';
  }
  return `${new Intl.NumberFormat('ko-KR').format(price)}원`;
}
