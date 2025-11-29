export interface ProductRecommendation {
  brand: string;
  productName: string;
  shade: string;
  reason: string;
}

export interface AnalysisResult {
  skinTone: string;
  undertone: 'Cool' | 'Warm' | 'Neutral' | 'Olive';
  skinTexture: string;
  foundations: ProductRecommendation[];
  concealers: ProductRecommendation[];
  blushes: ProductRecommendation[];
  lipsticks: ProductRecommendation[];
}

export type AppState = 'home' | 'analyzing' | 'results' | 'error';
