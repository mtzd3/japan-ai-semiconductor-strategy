// 市場メトリクスのデータ検証関数

import { MarketShareData, MarketMetrics, CompetitorAnalysis, TrendData } from './types.js';

/**
 * 市場シェアデータの検証
 */
export function validateMarketShareData(data: MarketShareData): boolean {
  // 企業名が空でないことを確認
  if (!data.company || data.company.trim() === '') {
    throw new Error('企業名は必須です');
  }

  // 市場シェアが0-100の範囲内であることを確認
  if (data.marketShare < 0 || data.marketShare > 100) {
    throw new Error('市場シェアは0-100の範囲内である必要があります');
  }

  // 年が妥当な範囲内であることを確認
  const currentYear = new Date().getFullYear();
  if (data.year < 2000 || data.year > currentYear + 5) {
    throw new Error('年は2000年から現在+5年の範囲内である必要があります');
  }

  return true;
}

/**
 * 市場メトリクスの検証
 */
export function validateMarketMetrics(data: MarketMetrics): boolean {
  // 市場規模が正の値であることを確認
  if (data.marketSize <= 0) {
    throw new Error('市場規模は正の値である必要があります');
  }

  // 成長率が妥当な範囲内であることを確認
  if (data.growthRate < -100 || data.growthRate > 1000) {
    throw new Error('成長率は-100%から1000%の範囲内である必要があります');
  }

  // データソースが指定されていることを確認
  if (!data.source || data.source.trim() === '') {
    throw new Error('データソースは必須です');
  }

  return true;
}

/**
 * 競合他社分析データの検証
 */
export function validateCompetitorAnalysis(data: CompetitorAnalysis): boolean {
  // 企業名が空でないことを確認
  if (!data.companyName || data.companyName.trim() === '') {
    throw new Error('企業名は必須です');
  }

  // 年間売上が非負の値であることを確認
  if (data.annualRevenue < 0) {
    throw new Error('年間売上は非負の値である必要があります');
  }

  // R&D投資額が非負の値であることを確認
  if (data.rdInvestment < 0) {
    throw new Error('R&D投資額は非負の値である必要があります');
  }

  // 主要製品が少なくとも1つ指定されていることを確認
  if (!data.keyProducts || data.keyProducts.length === 0) {
    throw new Error('主要製品は少なくとも1つ指定する必要があります');
  }

  return true;
}

/**
 * トレンドデータの検証
 */
export function validateTrendData(data: TrendData): boolean {
  // トレンド名が空でないことを確認
  if (!data.trendName || data.trendName.trim() === '') {
    throw new Error('トレンド名は必須です');
  }

  // 影響度が1-10の範囲内であることを確認
  if (data.impactLevel < 1 || data.impactLevel > 10) {
    throw new Error('影響度は1-10の範囲内である必要があります');
  }

  // 時間軸が有効な値であることを確認
  const validTimeframes = ['short', 'medium', 'long'];
  if (!validTimeframes.includes(data.timeframe)) {
    throw new Error('時間軸はshort、medium、longのいずれかである必要があります');
  }

  return true;
}/
**
 * 課題データの検証
 */
export function validateChallengeData(data: ChallengeData): boolean {
  // 課題IDが空でないことを確認
  if (!data.id || data.id.trim() === '') {
    throw new Error('課題IDは必須です');
  }

  // 課題タイトルが空でないことを確認
  if (!data.title || data.title.trim() === '') {
    throw new Error('課題タイトルは必須です');
  }

  // 深刻度が1-10の範囲内であることを確認
  if (data.severity < 1 || data.severity > 10) {
    throw new Error('深刻度は1-10の範囲内である必要があります');
  }

  // 緊急度が1-10の範囲内であることを確認
  if (data.urgency < 1 || data.urgency > 10) {
    throw new Error('緊急度は1-10の範囲内である必要があります');
  }

  // カテゴリが有効な値であることを確認
  const validCategories = ['technological', 'economic', 'geopolitical'];
  if (!validCategories.includes(data.category)) {
    throw new Error('カテゴリはtechnological、economic、geopoliticalのいずれかである必要があります');
  }

  // 説明が空でないことを確認
  if (!data.description || data.description.trim() === '') {
    throw new Error('課題の説明は必須です');
  }

  return true;
}

/**
 * 戦略推奨事項の検証
 */
export function validateStrategicRecommendation(data: StrategicRecommendation): boolean {
  // 推奨事項IDが空でないことを確認
  if (!data.id || data.id.trim() === '') {
    throw new Error('推奨事項IDは必須です');
  }

  // タイトルが空でないことを確認
  if (!data.title || data.title.trim() === '') {
    throw new Error('推奨事項タイトルは必須です');
  }

  // 優先度が有効な値であることを確認
  const validPriorities = ['high', 'medium', 'low'];
  if (!validPriorities.includes(data.priority)) {
    throw new Error('優先度はhigh、medium、lowのいずれかである必要があります');
  }

  // 実装コストが非負の値であることを確認
  if (data.implementationCost < 0) {
    throw new Error('実装コストは非負の値である必要があります');
  }

  // 説明が空でないことを確認
  if (!data.description || data.description.trim() === '') {
    throw new Error('推奨事項の説明は必須です');
  }

  return true;
}

/**
 * 技術能力評価の検証
 */
export function validateTechnicalCapability(data: TechnicalCapability): boolean {
  // 技術分野が空でないことを確認
  if (!data.technology || data.technology.trim() === '') {
    throw new Error('技術分野は必須です');
  }

  // 現在のレベルが1-10の範囲内であることを確認
  if (data.currentLevel < 1 || data.currentLevel > 10) {
    throw new Error('現在のレベルは1-10の範囲内である必要があります');
  }

  // 目標レベルが1-10の範囲内であることを確認
  if (data.targetLevel < 1 || data.targetLevel > 10) {
    throw new Error('目標レベルは1-10の範囲内である必要があります');
  }

  // 必要投資額が非負の値であることを確認
  if (data.investmentRequired < 0) {
    throw new Error('必要投資額は非負の値である必要があります');
  }

  // 達成期間が正の値であることを確認
  if (data.timeToAchieve <= 0) {
    throw new Error('達成期間は正の値である必要があります');
  }

  return true;
}

/**
 * 国際ベンチマークの検証
 */
export function validateInternationalBenchmark(data: InternationalBenchmark): boolean {
  // 国名が空でないことを確認
  if (!data.country || data.country.trim() === '') {
    throw new Error('国名は必須です');
  }

  // 戦略名が空でないことを確認
  if (!data.strategy || data.strategy.trim() === '') {
    throw new Error('戦略名は必須です');
  }

  // 予算が非負の値であることを確認
  if (data.budget < 0) {
    throw new Error('予算は非負の値である必要があります');
  }

  // 適用可能性が1-10の範囲内であることを確認
  if (data.applicability < 1 || data.applicability > 10) {
    throw new Error('適用可能性は1-10の範囲内である必要があります');
  }

  // 主要施策が少なくとも1つ指定されていることを確認
  if (!data.keyInitiatives || data.keyInitiatives.length === 0) {
    throw new Error('主要施策は少なくとも1つ指定する必要があります');
  }

  return true;
}

/**
 * データ整合性チェッカー
 */
export class DataIntegrityChecker {
  /**
   * 市場データの整合性チェック
   */
  static checkMarketDataIntegrity(
    marketMetrics: MarketMetrics[],
    marketShares: MarketShareData[]
  ): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // 年の整合性チェック
    const metricYears = new Set(marketMetrics.map(m => m.year));
    const shareYears = new Set(marketShares.map(s => s.year));
    
    metricYears.forEach(year => {
      if (!shareYears.has(year)) {
        issues.push(`年 ${year} の市場シェアデータが不足しています`);
      }
    });

    // 市場シェアの合計チェック
    shareYears.forEach(year => {
      const yearShares = marketShares.filter(s => s.year === year);
      const regions = new Set(yearShares.map(s => s.region));
      
      regions.forEach(region => {
        const regionShares = yearShares.filter(s => s.region === region);
        const segments = new Set(regionShares.map(s => s.segment));
        
        segments.forEach(segment => {
          const segmentShares = regionShares.filter(s => s.segment === segment);
          const totalShare = segmentShares.reduce((sum, s) => sum + s.marketShare, 0);
          
          if (totalShare > 105) { // 5%の誤差を許容
            issues.push(`${year}年 ${region} ${segment}の市場シェア合計が100%を超えています: ${totalShare}%`);
          }
        });
      });
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 競合分析データの整合性チェック
   */
  static checkCompetitorDataIntegrity(
    competitors: CompetitorAnalysis[]
  ): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    competitors.forEach(competitor => {
      // R&D投資比率の妥当性チェック
      const rdRatio = competitor.rdInvestment / competitor.annualRevenue;
      if (rdRatio > 0.5) { // 50%を超える場合は警告
        issues.push(`${competitor.companyName}のR&D投資比率が異常に高いです: ${(rdRatio * 100).toFixed(1)}%`);
      }

      // 強みと弱みの重複チェック
      const strengthSet = new Set(competitor.strengths);
      const weaknessSet = new Set(competitor.weaknesses);
      const overlap = competitor.strengths.filter(s => weaknessSet.has(s));
      
      if (overlap.length > 0) {
        issues.push(`${competitor.companyName}の強みと弱みに重複があります: ${overlap.join(', ')}`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * 課題データの整合性チェック
   */
  static checkChallengeDataIntegrity(
    challenges: ChallengeData[]
  ): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // 重複IDチェック
    const ids = challenges.map(c => c.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
      issues.push(`重複する課題IDがあります: ${duplicateIds.join(', ')}`);
    }

    // カテゴリ分布チェック
    const categories = challenges.map(c => c.category);
    const categoryCount = {
      technological: categories.filter(c => c === 'technological').length,
      economic: categories.filter(c => c === 'economic').length,
      geopolitical: categories.filter(c => c === 'geopolitical').length
    };

    const totalChallenges = challenges.length;
    Object.entries(categoryCount).forEach(([category, count]) => {
      const percentage = (count / totalChallenges) * 100;
      if (percentage > 70) {
        issues.push(`${category}カテゴリの課題が偏りすぎています: ${percentage.toFixed(1)}%`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

/**
 * データ品質スコア計算機
 */
export class DataQualityScorer {
  /**
   * 総合データ品質スコアの計算
   */
  static calculateOverallQualityScore(
    marketData: any[],
    competitorData: any[],
    challengeData: any[],
    recommendationData: any[]
  ): {
    overallScore: number;
    categoryScores: {
      completeness: number;
      accuracy: number;
      consistency: number;
      timeliness: number;
    };
    recommendations: string[];
  } {
    
    const completenessScore = this.calculateCompletenessScore([
      ...marketData,
      ...competitorData,
      ...challengeData,
      ...recommendationData
    ]);

    const accuracyScore = this.calculateAccuracyScore([
      ...marketData,
      ...competitorData,
      ...challengeData,
      ...recommendationData
    ]);

    const consistencyScore = this.calculateConsistencyScore([
      ...marketData,
      ...competitorData,
      ...challengeData,
      ...recommendationData
    ]);

    const timelinessScore = this.calculateTimelinessScore([
      ...marketData,
      ...competitorData
    ]);

    const categoryScores = {
      completeness: completenessScore,
      accuracy: accuracyScore,
      consistency: consistencyScore,
      timeliness: timelinessScore
    };

    const overallScore = (
      completenessScore * 0.3 +
      accuracyScore * 0.3 +
      consistencyScore * 0.2 +
      timelinessScore * 0.2
    );

    const recommendations = this.generateQualityRecommendations(categoryScores);

    return {
      overallScore,
      categoryScores,
      recommendations
    };
  }

  private static calculateCompletenessScore(data: any[]): number {
    if (data.length === 0) return 0;

    let totalFields = 0;
    let filledFields = 0;

    data.forEach(item => {
      Object.values(item).forEach(value => {
        totalFields++;
        if (value !== null && value !== undefined && value !== '') {
          filledFields++;
        }
      });
    });

    return totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
  }

  private static calculateAccuracyScore(data: any[]): number {
    // 簡易的な精度スコア（実際の実装では外部検証が必要）
    let accurateItems = 0;
    let totalItems = data.length;

    data.forEach(item => {
      let itemAccuracy = true;
      
      // 数値の妥当性チェック
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'number') {
          if (key.includes('share') && (value < 0 || value > 100)) {
            itemAccuracy = false;
          }
          if (key.includes('year') && (value < 2000 || value > 2030)) {
            itemAccuracy = false;
          }
        }
      });

      if (itemAccuracy) accurateItems++;
    });

    return totalItems > 0 ? (accurateItems / totalItems) * 100 : 100;
  }

  private static calculateConsistencyScore(data: any[]): number {
    // データ形式の一貫性チェック
    if (data.length === 0) return 100;

    const firstItem = data[0];
    const expectedKeys = Object.keys(firstItem);
    let consistentItems = 0;

    data.forEach(item => {
      const itemKeys = Object.keys(item);
      const hasAllKeys = expectedKeys.every(key => itemKeys.includes(key));
      if (hasAllKeys) consistentItems++;
    });

    return (consistentItems / data.length) * 100;
  }

  private static calculateTimelinessScore(data: any[]): number {
    const currentYear = new Date().getFullYear();
    let timelyItems = 0;
    let totalItems = 0;

    data.forEach(item => {
      if (item.year) {
        totalItems++;
        const dataAge = currentYear - item.year;
        if (dataAge <= 2) { // 2年以内のデータを最新とみなす
          timelyItems++;
        }
      }
    });

    return totalItems > 0 ? (timelyItems / totalItems) * 100 : 100;
  }

  private static generateQualityRecommendations(scores: any): string[] {
    const recommendations: string[] = [];

    if (scores.completeness < 70) {
      recommendations.push('データ収集の強化が必要です');
    }
    if (scores.accuracy < 80) {
      recommendations.push('データ検証プロセスの改善が必要です');
    }
    if (scores.consistency < 85) {
      recommendations.push('データ形式の標準化が必要です');
    }
    if (scores.timeliness < 75) {
      recommendations.push('データの更新頻度を上げる必要があります');
    }

    return recommendations;
  }
}