import type {
  BestProductsResult,
  SpikeCategory,
  TrendCategory,
  TrendPoint
} from '@/shared/models/trend';

/**
 * Supabase 트렌드 테이블이 아직 없거나(로컬/미적용) 비어 있을 때 쓰는 목 데이터.
 * 대시보드 UI를 키·수집 없이 확인하기 위한 용도.
 */

export const MOCK_CATEGORIES: TrendCategory[] = [
  { categoryId: '50000164', categoryName: '수영', fullPath: '스포츠/레저 > 수영', repKeyword: '실내수영복', active: true },
  { categoryId: '50000028', categoryName: '캠핑', fullPath: '스포츠/레저 > 캠핑', repKeyword: '캠핑용품', active: true },
  { categoryId: '50000029', categoryName: '골프', fullPath: '스포츠/레저 > 골프', repKeyword: '골프공', active: true },
  { categoryId: '50000027', categoryName: '등산', fullPath: '스포츠/레저 > 등산', repKeyword: '등산화', active: true }
];

function seededSeries(seed: number, days: number, base: number, trendUp: number): TrendPoint[] {
  const points: TrendPoint[] = [];
  const today = new Date('2026-07-07T00:00:00Z');
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - i);
    const wave = Math.sin((i + seed) / 4) * 12;
    const drift = ((days - i) / days) * trendUp;
    const ratio = Math.max(5, Math.min(100, base + wave + drift));
    points.push({
      date: date.toISOString().slice(0, 10),
      rawRatio: Math.round(ratio * 100) / 100,
      calibratedScore: Math.round(ratio * 850)
    });
  }
  return points;
}

const SERIES_CONFIG: Record<string, { seed: number; base: number; trendUp: number }> = {
  '50000164': { seed: 1, base: 55, trendUp: 40 }, // 수영 — 여름 급상승
  '50000028': { seed: 5, base: 60, trendUp: 15 },
  '50000029': { seed: 9, base: 45, trendUp: 5 },
  '50000027': { seed: 3, base: 50, trendUp: -10 }
};

export function mockSeries(categoryId: string, days: number): TrendPoint[] {
  const config = SERIES_CONFIG[categoryId] ?? { seed: 2, base: 50, trendUp: 0 };
  return seededSeries(config.seed, days, config.base, config.trendUp);
}

export function mockSpikes(): SpikeCategory[] {
  return MOCK_CATEGORIES.map((category) => {
    const series = mockSeries(category.categoryId, 10);
    const recent = series.slice(-3);
    const previous = series.slice(0, 7);
    const recentAvg = recent.reduce((sum, p) => sum + p.calibratedScore, 0) / recent.length;
    const previousAvg = previous.reduce((sum, p) => sum + p.calibratedScore, 0) / previous.length;
    return {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      fullPath: category.fullPath,
      recentAvg: Math.round(recentAvg),
      previousAvg: Math.round(previousAvg),
      spikeRate: previousAvg ? (recentAvg - previousAvg) / previousAvg : 0,
      latestScore: series[series.length - 1].calibratedScore,
      dataPoints: series.length
    };
  }).sort((a, b) => b.spikeRate - a.spikeRate);
}

export function mockProducts(categoryId: string): BestProductsResult {
  const names = [
    '3부 래쉬가드 세트', '여성 원피스 수영복', '남성 사각 수영복', '수경 물안경 김서림방지',
    '실리콘 수모 수영모', '방수 수영가방', '아쿠아슈즈 커플', '수영 핸드패들',
    '오리발 훈련용', '방수팩 스마트폰'
  ];
  return {
    date: '2026-07-07',
    isStale: false,
    products: names.map((name, index) => ({
      rank: index + 1,
      productName: `[${MOCK_CATEGORIES.find((c) => c.categoryId === categoryId)?.categoryName ?? ''}] ${name}`,
      price: 12000 + index * 3500,
      productUrl: 'https://search.shopping.naver.com/',
      imageUrl: null,
      storeName: `스토어${index + 1}`
    }))
  };
}
