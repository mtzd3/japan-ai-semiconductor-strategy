// 市場分析エンジン

import { 
  MarketMetrics, 
  MarketShareData, 
  CompetitorAnalysis, 
  TrendData 
} from '../data/types.js';
import { MarketDataManager, MarketForecastEngine } from '../data/market-data.js';

/**
 * 市場分析結果
 */
export interface MarketAnalysisResult {
  currentState: {
    marketSize: number;
    growthRate: number;
    competitionLevel: 'low' | 'medium' | 'high' | 'extreme';
    maturityStage: 'emerging' | 'growth' | 'mature' | 'declining';
  };
  competitivePosition: {
    japanMarketShare: number;
    globalRanking: number;
    keyStrengths: string[];
    criticalWeaknesses: string[];
    competitiveGaps: string[];
  };
  marketForecast: {
    projectedSize2025: number;
    projectedSize2030: number;
    expectedCAGR: number;
    confidenceLevel: number;
  };
  segmentAnalysis: {
    segment: string;
    currentShare: number;
    growthPotential: number;
    competitiveness: number;
  }[];
  keyInsights: string[];
  recommendations: string[];
}

/**
 * 市場分析エンジン
 */
export class MarketAnalyzer {
  private marketDataManager: MarketDataManager;

  constructor() {
    this.marketDataManager = new MarketDataManager();
  }

  /**
   * 包括的市場分析の実行
   */
  async analyzeMarket(
    marketMetrics: MarketMetrics[],
    marketShares: MarketShareData[],
    competitors: CompetitorAnalysis[],
    trends: TrendData[]
  ): Promise<MarketAnalysisResult> {
    
    // データの追加
    marketMetrics.forEach(metric => this.marketDataManager.addMarketMetrics(metric));
    marketShares.forEach(share => this.marketDataManager.addMarketShare(share));
    competitors.forEach(competitor => this.marketDataManager.addCompetitorAnalysis(competitor));
    trends.forEach(trend => this.marketDataManager.addTrendData(trend));

    // 各分析の実行
    const currentState = this.analyzeCurrentState(marketMetrics);
    const competitivePosition = this.analyzeCompetitivePosition(marketShares, competitors);
    const marketForecast = this.generateMarketForecast(marketMetrics);
    const segmentAnalysis = this.analyzeSegments(marketShares);
    const keyInsights = this.generateKeyInsights(currentState, competitivePosition, trends);
    const recommendations = this.generateRecommendations(currentState, competitivePosition);

    return {
      currentState,
      competitivePosition,
      marketForecast,
      segmentAnalysis,
      keyInsights,
      recommendations
    };
  }

  /**
   * 現在の市場状況分析
   */
  private analyzeCurrentState(marketMetrics: MarketMetrics[]): MarketAnalysisResult['currentState'] {
    if (marketMetrics.length === 0) {
      throw new Error('市場メトリクスデータが不足しています');
    }

    const latestMetrics = marketMetrics.sort((a, b) => b.year - a.year)[0];
    const avgGrowthRate = marketMetrics.reduce((sum, m) => sum + m.growthRate, 0) / marketMetrics.length;

    // 競争レベルの判定
    let competitionLevel: 'low' | 'medium' | 'high' | 'extreme';
    if (avgGrowthRate > 30) competitionLevel = 'extreme';
    else if (avgGrowthRate > 20) competitionLevel = 'high';
    else if (avgGrowthRate > 10) competitionLevel = 'medium';
    else competitionLevel = 'low';

    // 成熟段階の判定
    let maturityStage: 'emerging' | 'growth' | 'mature' | 'declining';
    if (avgGrowthRate > 25) maturityStage = 'emerging';
    else if (avgGrowthRate > 10) maturityStage = 'growth';
    else if (avgGrowthRate > 0) maturityStage = 'mature';
    else maturityStage = 'declining';

    return {
      marketSize: latestMetrics.marketSize,
      growthRate: avgGrowthRate,
      competitionLevel,
      maturityStage
    };
  }

  /**
   * 競争ポジション分析
   */
  private analyzeCompetitivePosition(
    marketShares: MarketShareData[],
    competitors: CompetitorAnalysis[]
  ): MarketAnalysisResult['competitivePosition'] {
    
    // 日本企業の市場シェア計算
    const japaneseCompanies = ['ソニー', '東芝', 'ルネサス', 'キオクシア', '富士通'];
    const japanShares = marketShares.filter(share => 
      japaneseCompanies.some(company => share.company.includes(company))
    );
    const japanMarketShare = japanShares.reduce((sum, share) => sum + share.marketShare, 0);

    // グローバルランキング計算
    const companyShares = this.calculateCompanyTotalShares(marketShares);
    const japanTotalShare = Object.entries(companyShares)
      .filter(([company]) => japaneseCompanies.some(jp => company.includes(jp)))
      .reduce((sum, [, share]) => sum + share, 0);
    
    const sortedShares = Object.entries(companyShares)
      .sort(([, a], [, b]) => b - a);
    const globalRanking = sortedShares.findIndex(([company]) => 
      japaneseCompanies.some(jp => company.includes(jp))
    ) + 1;

    // 強み・弱みの分析
    const japaneseCompetitors = competitors.filter(c => c.country === '日本');
    const keyStrengths = this.extractTopItems(
      japaneseCompetitors.flatMap(c => c.strengths), 3
    );
    const criticalWeaknesses = this.extractTopItems(
      japaneseCompetitors.flatMap(c => c.weaknesses), 3
    );

    // 競争ギャップの特定
    const competitiveGaps = this.identifyCompetitiveGaps(competitors);

    return {
      japanMarketShare,
      globalRanking,
      keyStrengths,
      criticalWeaknesses,
      competitiveGaps
    };
  }

  /**
   * 市場予測の生成
   */
  private generateMarketForecast(marketMetrics: MarketMetrics[]): MarketAnalysisResult['marketForecast'] {
    try {
      const forecast2025 = MarketForecastEngine.forecastMarketSize(marketMetrics, 2025);
      const forecast2030 = MarketForecastEngine.forecastMarketSize(marketMetrics, 2030);
      
      const sortedMetrics = marketMetrics.sort((a, b) => a.year - b.year);
      const startYear = sortedMetrics[0].year;
      const endYear = sortedMetrics[sortedMetrics.length - 1].year;
      const cagr = this.marketDataManager.calculateCAGR(startYear, endYear);

      return {
        projectedSize2025: forecast2025.predictedSize,
        projectedSize2030: forecast2030.predictedSize,
        expectedCAGR: cagr,
        confidenceLevel: Math.min(forecast2025.confidence, forecast2030.confidence)
      };
    } catch (error) {
      return {
        projectedSize2025: 0,
        projectedSize2030: 0,
        expectedCAGR: 0,
        confidenceLevel: 1
      };
    }
  }

  /**
   * セグメント分析
   */
  private analyzeSegments(marketShares: MarketShareData[]): MarketAnalysisResult['segmentAnalysis'] {
    const segments = [...new Set(marketShares.map(share => share.segment))];
    
    return segments.map(segment => {
      const segmentShares = marketShares.filter(share => share.segment === segment);
      const currentShare = segmentShares.reduce((sum, share) => sum + share.marketShare, 0);
      
      // 成長ポテンシャルの計算（簡易版）
      const growthPotential = this.calculateSegmentGrowthPotential(segment);
      
      // 競争力の計算
      const competitiveness = this.calculateSegmentCompetitiveness(segmentShares);

      return {
        segment,
        currentShare,
        growthPotential,
        competitiveness
      };
    });
  }

  /**
   * 主要インサイトの生成
   */
  private generateKeyInsights(
    currentState: MarketAnalysisResult['currentState'],
    competitivePosition: MarketAnalysisResult['competitivePosition'],
    trends: TrendData[]
  ): string[] {
    const insights: string[] = [];

    // 市場状況に基づくインサイト
    if (currentState.maturityStage === 'emerging') {
      insights.push('AI半導体市場は急成長期にあり、早期参入による先行者利益の獲得が可能');
    }

    if (currentState.competitionLevel === 'extreme') {
      insights.push('競争が極めて激しく、差別化戦略と技術革新が生存の鍵');
    }

    // 競争ポジションに基づくインサイト
    if (competitivePosition.japanMarketShare < 10) {
      insights.push('日本の市場シェアは限定的で、戦略的な巻き返しが急務');
    }

    if (competitivePosition.globalRanking > 5) {
      insights.push('グローバル競争力の向上には大胆な投資と戦略転換が必要');
    }

    // トレンドに基づくインサイト
    const highImpactTrends = trends.filter(trend => trend.impactLevel >= 8);
    if (highImpactTrends.length > 0) {
      insights.push(`${highImpactTrends[0].trendName}が市場に大きな影響を与える見込み`);
    }

    return insights;
  }

  /**
   * 推奨事項の生成
   */
  private generateRecommendations(
    currentState: MarketAnalysisResult['currentState'],
    competitivePosition: MarketAnalysisResult['competitivePosition']
  ): string[] {
    const recommendations: string[] = [];

    // 市場状況に基づく推奨事項
    if (currentState.maturityStage === 'emerging') {
      recommendations.push('新興技術への積極的な投資と人材確保');
      recommendations.push('エコシステム構築による市場主導権の獲得');
    }

    // 競争ポジションに基づく推奨事項
    if (competitivePosition.japanMarketShare < 15) {
      recommendations.push('戦略的パートナーシップによる市場シェア拡大');
      recommendations.push('ニッチ分野での技術的優位性の確立');
    }

    if (competitivePosition.criticalWeaknesses.includes('マーケティング')) {
      recommendations.push('グローバルマーケティング能力の強化');
    }

    if (competitivePosition.criticalWeaknesses.includes('エコシステム')) {
      recommendations.push('ソフトウェア・ハードウェア統合エコシステムの構築');
    }

    return recommendations;
  }

  // ヘルパーメソッド
  private calculateCompanyTotalShares(marketShares: MarketShareData[]): Record<string, number> {
    const companyShares: Record<string, number> = {};
    
    marketShares.forEach(share => {
      companyShares[share.company] = (companyShares[share.company] || 0) + share.marketShare;
    });

    return companyShares;
  }

  private extractTopItems(items: string[], count: number): string[] {
    const itemCounts: Record<string, number> = {};
    
    items.forEach(item => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });

    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([item]) => item);
  }

  private identifyCompetitiveGaps(competitors: CompetitorAnalysis[]): string[] {
    const gaps: string[] = [];
    
    const japaneseCompetitors = competitors.filter(c => c.country === '日本');
    const globalCompetitors = competitors.filter(c => c.country !== '日本');

    if (japaneseCompetitors.length === 0 || globalCompetitors.length === 0) {
      return gaps;
    }

    // R&D投資比率の比較
    const japanAvgRD = japaneseCompetitors.reduce((sum, c) => 
      sum + (c.rdInvestment / c.annualRevenue), 0) / japaneseCompetitors.length;
    const globalAvgRD = globalCompetitors.reduce((sum, c) => 
      sum + (c.rdInvestment / c.annualRevenue), 0) / globalCompetitors.length;

    if (japanAvgRD < globalAvgRD * 0.8) {
      gaps.push('R&D投資比率が国際水準を下回る');
    }

    // 売上規模の比較
    const japanMaxRevenue = Math.max(...japaneseCompetitors.map(c => c.annualRevenue));
    const globalMaxRevenue = Math.max(...globalCompetitors.map(c => c.annualRevenue));

    if (japanMaxRevenue < globalMaxRevenue * 0.5) {
      gaps.push('企業規模が国際競合に劣る');
    }

    return gaps;
  }

  private calculateSegmentGrowthPotential(segment: string): number {
    // セグメント別成長ポテンシャルの簡易計算
    const growthMap: Record<string, number> = {
      'AI Training Chips': 9,
      'AI Inference Chips': 8,
      'Edge AI': 9,
      'Automotive AI': 8,
      'Mobile AI': 7,
      'Server AI': 6
    };

    return growthMap[segment] || 5;
  }

  private calculateSegmentCompetitiveness(segmentShares: MarketShareData[]): number {
    // 競争力の簡易計算（市場集中度ベース）
    const totalShare = segmentShares.reduce((sum, share) => sum + share.marketShare, 0);
    const hhi = segmentShares.reduce((sum, share) => 
      sum + Math.pow(share.marketShare, 2), 0);

    // HHI値を1-10スケールに変換
    return Math.max(1, Math.min(10, 10 - (hhi / 1000)));
  }
}