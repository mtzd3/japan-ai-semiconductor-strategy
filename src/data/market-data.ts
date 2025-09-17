// AI半導体市場データ管理システム

import { 
  MarketShareData, 
  MarketMetrics, 
  CompetitorAnalysis, 
  TrendData 
} from './types.js';

/**
 * 市場データ管理クラス
 */
export class MarketDataManager {
  private marketMetrics: MarketMetrics[] = [];
  private marketShares: MarketShareData[] = [];
  private competitors: CompetitorAnalysis[] = [];
  private trends: TrendData[] = [];

  /**
   * 市場メトリクスの追加
   */
  addMarketMetrics(metrics: MarketMetrics): void {
    this.validateMarketMetrics(metrics);
    this.marketMetrics.push(metrics);
  }

  /**
   * 市場シェアデータの追加
   */
  addMarketShare(shareData: MarketShareData): void {
    this.validateMarketShare(shareData);
    this.marketShares.push(shareData);
  }

  /**
   * 競合他社分析の追加
   */
  addCompetitorAnalysis(competitor: CompetitorAnalysis): void {
    this.validateCompetitorAnalysis(competitor);
    this.competitors.push(competitor);
  }

  /**
   * トレンドデータの追加
   */
  addTrendData(trend: TrendData): void {
    this.validateTrendData(trend);
    this.trends.push(trend);
  }

  /**
   * 年別市場規模の取得
   */
  getMarketSizeByYear(year: number): MarketMetrics[] {
    return this.marketMetrics.filter(metric => metric.year === year);
  }

  /**
   * 地域別市場シェアの取得
   */
  getMarketShareByRegion(region: string): MarketShareData[] {
    return this.marketShares.filter(share => share.region === region);
  }

  /**
   * 日本企業の競合分析取得
   */
  getJapaneseCompetitors(): CompetitorAnalysis[] {
    return this.competitors.filter(competitor => competitor.country === '日本');
  }

  /**
   * 高影響度トレンドの取得
   */
  getHighImpactTrends(): TrendData[] {
    return this.trends.filter(trend => trend.impactLevel >= 7);
  }

  /**
   * 市場成長率の計算
   */
  calculateCAGR(startYear: number, endYear: number): number {
    const startMetrics = this.getMarketSizeByYear(startYear);
    const endMetrics = this.getMarketSizeByYear(endYear);
    
    if (startMetrics.length === 0 || endMetrics.length === 0) {
      throw new Error('指定された年のデータが不足しています');
    }

    const startSize = startMetrics.reduce((sum, metric) => sum + metric.marketSize, 0);
    const endSize = endMetrics.reduce((sum, metric) => sum + metric.marketSize, 0);
    const years = endYear - startYear;

    return ((Math.pow(endSize / startSize, 1 / years) - 1) * 100);
  }

  private validateMarketMetrics(metrics: MarketMetrics): void {
    if (metrics.marketSize < 0) {
      throw new Error('市場規模は0以上である必要があります');
    }
    if (metrics.confidence < 1 || metrics.confidence > 10) {
      throw new Error('信頼度は1-10の範囲内である必要があります');
    }
  }

  private validateMarketShare(shareData: MarketShareData): void {
    if (shareData.marketShare < 0 || shareData.marketShare > 100) {
      throw new Error('市場シェアは0-100%の範囲内である必要があります');
    }
  }

  private validateCompetitorAnalysis(competitor: CompetitorAnalysis): void {
    if (competitor.annualRevenue < 0) {
      throw new Error('年間売上は0以上である必要があります');
    }
    if (competitor.rdInvestment < 0) {
      throw new Error('R&D投資額は0以上である必要があります');
    }
  }

  private validateTrendData(trend: TrendData): void {
    if (trend.impactLevel < 1 || trend.impactLevel > 10) {
      throw new Error('影響度は1-10の範囲内である必要があります');
    }
    const validTimeframes = ['short', 'medium', 'long'];
    if (!validTimeframes.includes(trend.timeframe)) {
      throw new Error('時間軸はshort, medium, longのいずれかである必要があります');
    }
  }
}

/**
 * 市場予測エンジン
 */
export class MarketForecastEngine {
  /**
   * 線形回帰による市場予測
   */
  static forecastMarketSize(
    historicalData: MarketMetrics[],
    targetYear: number
  ): { predictedSize: number, confidence: number } {
    
    if (historicalData.length < 2) {
      throw new Error('予測には最低2年分のデータが必要です');
    }

    // データを年でソート
    const sortedData = historicalData.sort((a, b) => a.year - b.year);
    
    // 線形回帰計算
    const n = sortedData.length;
    const sumX = sortedData.reduce((sum, data) => sum + data.year, 0);
    const sumY = sortedData.reduce((sum, data) => sum + data.marketSize, 0);
    const sumXY = sortedData.reduce((sum, data) => sum + (data.year * data.marketSize), 0);
    const sumXX = sortedData.reduce((sum, data) => sum + (data.year * data.year), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictedSize = slope * targetYear + intercept;
    
    // 信頼度計算（R²値ベース）
    const meanY = sumY / n;
    const ssTotal = sortedData.reduce((sum, data) => 
      sum + Math.pow(data.marketSize - meanY, 2), 0);
    const ssResidual = sortedData.reduce((sum, data) => 
      sum + Math.pow(data.marketSize - (slope * data.year + intercept), 2), 0);
    
    const rSquared = 1 - (ssResidual / ssTotal);
    const confidence = Math.max(1, Math.min(10, rSquared * 10));

    return { predictedSize: Math.max(0, predictedSize), confidence };
  }

  /**
   * セグメント別成長予測
   */
  static forecastSegmentGrowth(
    segmentData: MarketShareData[],
    totalMarketGrowth: number
  ): { segment: string, projectedShare: number, growthRate: number }[] {
    
    const segmentGroups = this.groupBySegment(segmentData);
    const results: { segment: string, projectedShare: number, growthRate: number }[] = [];

    Object.entries(segmentGroups).forEach(([segment, data]) => {
      if (data.length >= 2) {
        const sortedData = data.sort((a, b) => a.year - b.year);
        const latestShare = sortedData[sortedData.length - 1].marketShare;
        
        // セグメント成長率計算
        const segmentGrowth = this.calculateSegmentGrowth(sortedData);
        const relativeGrowth = segmentGrowth - totalMarketGrowth;
        
        // 将来シェア予測
        const projectedShare = latestShare * (1 + relativeGrowth / 100);
        
        results.push({
          segment,
          projectedShare: Math.max(0, Math.min(100, projectedShare)),
          growthRate: segmentGrowth
        });
      }
    });

    return results;
  }

  private static groupBySegment(data: MarketShareData[]): Record<string, MarketShareData[]> {
    return data.reduce((groups, item) => {
      const segment = item.segment;
      if (!groups[segment]) {
        groups[segment] = [];
      }
      groups[segment].push(item);
      return groups;
    }, {} as Record<string, MarketShareData[]>);
  }

  private static calculateSegmentGrowth(data: MarketShareData[]): number {
    if (data.length < 2) return 0;
    
    const first = data[0];
    const last = data[data.length - 1];
    const years = last.year - first.year;
    
    if (years === 0) return 0;
    
    return ((Math.pow(last.marketShare / first.marketShare, 1 / years) - 1) * 100);
  }
}

/**
 * 競合分析エンジン
 */
export class CompetitiveAnalysisEngine {
  /**
   * 競合ポジショニング分析
   */
  static analyzeCompetitivePosition(
    competitors: CompetitorAnalysis[]
  ): {
    leaders: CompetitorAnalysis[],
    challengers: CompetitorAnalysis[],
    followers: CompetitorAnalysis[],
    niche: CompetitorAnalysis[]
  } {
    
    // R&D投資率とマーケットポジションでセグメント化
    const leaders: CompetitorAnalysis[] = [];
    const challengers: CompetitorAnalysis[] = [];
    const followers: CompetitorAnalysis[] = [];
    const niche: CompetitorAnalysis[] = [];

    competitors.forEach(competitor => {
      const rdRatio = competitor.rdInvestment / competitor.annualRevenue;
      const isLargeCompany = competitor.annualRevenue > 1000; // 1000億円以上

      if (rdRatio > 0.15 && isLargeCompany) {
        leaders.push(competitor);
      } else if (rdRatio > 0.10 && isLargeCompany) {
        challengers.push(competitor);
      } else if (isLargeCompany) {
        followers.push(competitor);
      } else {
        niche.push(competitor);
      }
    });

    return { leaders, challengers, followers, niche };
  }

  /**
   * 日本企業の競争力評価
   */
  static assessJapaneseCompetitiveness(
    japaneseCompetitors: CompetitorAnalysis[],
    globalCompetitors: CompetitorAnalysis[]
  ): {
    averageRdRatio: number,
    marketShareTotal: number,
    strengthAreas: string[],
    weaknessAreas: string[],
    recommendations: string[]
  } {
    
    const totalRevenue = japaneseCompetitors.reduce((sum, comp) => sum + comp.annualRevenue, 0);
    const totalRd = japaneseCompetitors.reduce((sum, comp) => sum + comp.rdInvestment, 0);
    const averageRdRatio = totalRevenue > 0 ? (totalRd / totalRevenue) : 0;

    // 強み・弱みの分析
    const allStrengths = japaneseCompetitors.flatMap(comp => comp.strengths);
    const allWeaknesses = japaneseCompetitors.flatMap(comp => comp.weaknesses);
    
    const strengthCounts = this.countOccurrences(allStrengths);
    const weaknessCounts = this.countOccurrences(allWeaknesses);
    
    const strengthAreas = Object.keys(strengthCounts)
      .sort((a, b) => strengthCounts[b] - strengthCounts[a])
      .slice(0, 5);
    
    const weaknessAreas = Object.keys(weaknessCounts)
      .sort((a, b) => weaknessCounts[b] - weaknessCounts[a])
      .slice(0, 5);

    // 推奨事項の生成
    const recommendations = this.generateRecommendations(
      averageRdRatio,
      strengthAreas,
      weaknessAreas
    );

    return {
      averageRdRatio,
      marketShareTotal: 0, // 実際の計算は別途実装
      strengthAreas,
      weaknessAreas,
      recommendations
    };
  }

  private static countOccurrences(items: string[]): Record<string, number> {
    return items.reduce((counts, item) => {
      counts[item] = (counts[item] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  private static generateRecommendations(
    rdRatio: number,
    strengths: string[],
    weaknesses: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (rdRatio < 0.10) {
      recommendations.push('R&D投資の大幅な増加が必要');
    }

    if (strengths.includes('製造技術')) {
      recommendations.push('製造技術の優位性を活かした差別化戦略');
    }

    if (weaknesses.includes('マーケティング')) {
      recommendations.push('グローバルマーケティング能力の強化');
    }

    if (weaknesses.includes('エコシステム')) {
      recommendations.push('パートナーシップとエコシステム構築');
    }

    return recommendations;
  }
}