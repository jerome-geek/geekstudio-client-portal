import type { SpikeCategory, TrendPoint } from '@/shared/models/trend';

export const MIN_DATA_POINTS = 10;

/**
 * 급상승도 = (최근 3일 평균 − 이전 7일 평균) ÷ 이전 7일 평균.
 * 데이터가 MIN_DATA_POINTS 미만이면 null (계산 제외).
 */
export function computeSpike(
  category: { categoryId: string; categoryName: string; fullPath?: string | null },
  series: TrendPoint[]
): SpikeCategory | null {
  if (series.length < MIN_DATA_POINTS) {
    return null;
  }

  const ordered = [...series].sort((a, b) => a.date.localeCompare(b.date));
  const recent = ordered.slice(-3);
  const previous = ordered.slice(-10, -3);

  const recentAvg = average(recent.map((p) => p.calibratedScore));
  const previousAvg = average(previous.map((p) => p.calibratedScore));

  if (previousAvg === 0) {
    return null;
  }

  return {
    categoryId: category.categoryId,
    categoryName: category.categoryName,
    fullPath: category.fullPath,
    recentAvg: Math.round(recentAvg),
    previousAvg: Math.round(previousAvg),
    spikeRate: (recentAvg - previousAvg) / previousAvg,
    latestScore: ordered[ordered.length - 1].calibratedScore,
    dataPoints: ordered.length
  };
}

function average(values: number[]): number {
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
