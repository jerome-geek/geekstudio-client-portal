import { describe, expect, it } from 'vitest';
import { computeSpike, MIN_DATA_POINTS } from '@/shared/lib/spike';
import type { TrendPoint } from '@/shared/models/trend';

const category = { categoryId: '50000164', categoryName: '수영', fullPath: '스포츠/레저 > 수영' };

function series(scores: number[]): TrendPoint[] {
  return scores.map((score, index) => ({
    date: `2026-06-${String(index + 1).padStart(2, '0')}`,
    rawRatio: 50,
    calibratedScore: score
  }));
}

describe('computeSpike', () => {
  it('데이터가 최소치 미만이면 null', () => {
    const short = series(Array(MIN_DATA_POINTS - 1).fill(100));
    expect(computeSpike(category, short)).toBeNull();
  });

  it('최근 3일이 이전 7일보다 높으면 양의 급상승률', () => {
    // 이전 7일=100, 최근 3일=200
    const points = series([100, 100, 100, 100, 100, 100, 100, 200, 200, 200]);
    const spike = computeSpike(category, points);
    expect(spike).not.toBeNull();
    expect(spike!.previousAvg).toBe(100);
    expect(spike!.recentAvg).toBe(200);
    expect(spike!.spikeRate).toBeCloseTo(1.0); // +100%
    expect(spike!.latestScore).toBe(200);
    expect(spike!.dataPoints).toBe(10);
  });

  it('하락 시 음의 급상승률', () => {
    const points = series([200, 200, 200, 200, 200, 200, 200, 100, 100, 100]);
    const spike = computeSpike(category, points);
    expect(spike!.spikeRate).toBeCloseTo(-0.5); // -50%
  });

  it('정렬되지 않은 입력도 날짜순으로 계산한다', () => {
    const points = series([100, 100, 100, 100, 100, 100, 100, 200, 200, 200]);
    const shuffled = [points[9], points[0], points[5], points[8], points[2], points[7], points[1], points[6], points[3], points[4]];
    const spike = computeSpike(category, shuffled);
    expect(spike!.recentAvg).toBe(200);
  });

  it('이전 평균이 0이면 null (0 나눗셈 방지)', () => {
    const points = series([0, 0, 0, 0, 0, 0, 0, 100, 100, 100]);
    expect(computeSpike(category, points)).toBeNull();
  });
});
