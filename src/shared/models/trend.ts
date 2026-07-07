export interface TrendCategory {
  categoryId: string;
  categoryName: string;
  parentCategoryId?: string | null;
  fullPath?: string | null;
  repKeyword?: string | null;
  active: boolean;
}

export interface TrendPoint {
  date: string;
  rawRatio: number;
  calibratedScore: number;
}

export interface SpikeCategory {
  categoryId: string;
  categoryName: string;
  fullPath?: string | null;
  recentAvg: number;
  previousAvg: number;
  spikeRate: number; // (recentAvg - previousAvg) / previousAvg
  latestScore: number;
  dataPoints: number;
}

export interface BestProduct {
  rank: number;
  productName: string;
  price?: number | null;
  productUrl: string;
  imageUrl?: string | null;
  storeName?: string | null;
}

export interface BestProductsResult {
  date: string | null;
  isStale: boolean; // 당일 데이터 없어 과거 수집일로 대체됐는지
  products: BestProduct[];
}
