// 研究データ集約ユーティリティ

import { 
  MarketShareData, 
  MarketMetrics, 
  CompetitorAnalysis, 
  TrendData,
  ChallengeData,
  StrategicRecommendation,
  InternationalBenchmark
} from './types.js';
import { 
  validateMarketShareData, 
  validateMarketMetrics, 
  validateCompetitorAnalysis, 
  validateTrendData 
} from './validation.js';
import { MarketDataManager } from './market-data.js';
import { ChallengeAssessmentManager } from './challenges.js';

/**
 * 市場シェアデータの集約と処理
 */
export class MarketShareAggregator {
  private data: MarketShareData[] = [];

  /**
   * 市場シェアデータを追加
   */
  addData(marketData: MarketShareData): void {
    validateMarketShareData(marketData);
    this.data.push(marketData);
  }

  /**
   * 年別市場シェアの取得
   */
  getMarketShareByYear(year: number): MarketShareData[] {
    return this.data.filter(item => item.year === year);
  }

  /**
   * 企業別市場シェアの取得
   */
  getMarketShareByCompany(company: string): MarketShareData[] {
    return this.data.filter(item => item.company === company);
  }

  /**
   * 地域別市場シェアの取得
   */
  getMarketShareByRegion(region: string): MarketShareData[] {
    return this.data.filter(item => item.region === region);
  }

  /**
   * トップN企業の市場シェア取得
   */
  getTopCompanies(year: number, region: string, topN: number = 10): MarketShareData[] {
    return this.data
      .filter(item => item.year === year && item.region === region)
      .sort((a, b) => b.marketShare - a.marketShare)
      .slice(0, topN);
  }

  /**
   * 市場集中度の計算（HHI指数）
   */
  calculateMarketConcentration(year: number, region: string): number {
    const yearData = this.data.filter(item => item.year === year && item.region === region);
    const hhi = yearData.reduce((sum, item) => sum + Math.pow(item.marketShare, 2), 0);
    return hhi;
  }
}

/**
 * 競合他社分析データの集約と処理
 */
export class CompetitorAnalysisAggregator {
  private data: CompetitorAnalysis[] = [];

  /**
   * 競合他社データを追加
   */
  addData(competitorData: CompetitorAnalysis): void {
    validateCompetitorAnalysis(competitorData);
    this.data.push(competitorData);
  }

  /**
   * 国別競合他社の取得
   */
  getCompetitorsByCountry(country: string): CompetitorAnalysis[] {
    return this.data.filter(item => item.country === country);
  }

  /**
   * R&D投資額でソートされた競合他社リスト
   */
  getCompetitorsByRDInvestment(descending: boolean = true): CompetitorAnalysis[] {
    return [...this.data].sort((a, b) => 
      descending ? b.rdInvestment - a.rdInvestment : a.rdInvestment - b.rdInvestment
    );
  }

  /**
   * 売上規模でソートされた競合他社リスト
   */
  getCompetitorsByRevenue(descending: boolean = true): CompetitorAnalysis[] {
    return [...this.data].sort((a, b) => 
      descending ? b.annualRevenue - a.annualRevenue : a.annualRevenue - b.annualRevenue
    );
  }

  /**
   * R&D投資比率の計算
   */
  calculateRDRatio(companyName: string): number {
    const company = this.data.find(item => item.companyName === companyName);
    if (!company || company.annualRevenue === 0) return 0;
    return (company.rdInvestment / company.annualRevenue) * 100;
  }

  /**
   * 業界平均R&D投資比率の計算
   */
  calculateAverageRDRatio(): number {
    const validCompanies = this.data.filter(item => item.annualRevenue > 0);
    if (validCompanies.length === 0) return 0;
    
    const totalRatio = validCompanies.reduce((sum, item) => 
      sum + (item.rdInvestment / item.annualRevenue) * 100, 0
    );
    return totalRatio / validCompanies.length;
  }
}

/**
 * データ正規化ユーティリティ
 */
export class DataNormalizer {
  /**
   * 市場シェアデータの正規化
   */
  static normalizeMarketShareData(data: MarketShareData[]): MarketShareData[] {
    return data.map(item => ({
      ...item,
      company: item.company.trim(),
      region: item.region.trim(),
      segment: item.segment.trim(),
      marketShare: Math.round(item.marketShare * 100) / 100 // 小数点以下2桁に丸める
    }));
  }

  /**
   * 競合他社データの正規化
   */
  static normalizeCompetitorData(data: CompetitorAnalysis[]): CompetitorAnalysis[] {
    return data.map(item => ({
      ...item,
      companyName: item.companyName.trim(),
      country: item.country.trim(),
      marketPosition: item.marketPosition.trim(),
      keyProducts: item.keyProducts.map(product => product.trim()),
      strengths: item.strengths.map(strength => strength.trim()),
      weaknesses: item.weaknesses.map(weakness => weakness.trim())
    }));
  }

  /**
   * 通貨換算（USD to JPY）
   */
  static convertUSDToJPY(usdAmount: number, exchangeRate: number = 150): number {
    return Math.round(usdAmount * exchangeRate);
  }

  /**
   * 単位統一（億円単位に変換）
   */
  static convertToOkuYen(amount: number, unit: 'yen' | 'man' | 'oku' | 'cho'): number {
    const conversionRates = {
      yen: 0.00000001,    // 円 → 億円
      man: 0.0001,        // 万円 → 億円
      oku: 1,             // 億円 → 億円
      cho: 10000          // 兆円 → 億円
    };
    return amount * conversionRates[unit];
  }
}

/**
 * トレンド分析ユーティリティ
 */
export class TrendAnalyzer {
  private data: TrendData[] = [];

  /**
   * トレンドデータを追加
   */
  addData(trendData: TrendData): void {
    validateTrendData(trendData);
    this.data.push(trendData);
  }

  /**
   * 影響度別トレンドの取得
   */
  getTrendsByImpact(minImpact: number): TrendData[] {
    return this.data.filter(item => item.impactLevel >= minImpact);
  }

  /**
   * 時間軸別トレンドの取得
   */
  getTrendsByTimeframe(timeframe: 'short' | 'medium' | 'long'): TrendData[] {
    return this.data.filter(item => item.timeframe === timeframe);
  }

  /**
   * セグメント別影響分析
   */
  analyzeSegmentImpact(segment: string): TrendData[] {
    return this.data.filter(item => item.affectedSegments.includes(segment));
  }

  /**
   * 機会とリスクの分析
   */
  analyzeOpportunitiesAndThreats(): { opportunities: string[], threats: string[] } {
    const allOpportunities = this.data.flatMap(item => item.opportunities);
    const allThreats = this.data.flatMap(item => item.threats);
    
    return {
      opportunities: [...new Set(allOpportunities)], // 重複除去
      threats: [...new Set(allThreats)]
    };
  }
}

/**
 * 市場データ統合ユーティリティ
 */
export class MarketDataIntegrator {
  private marketShareAggregator: MarketShareAggregator;
  private competitorAggregator: CompetitorAnalysisAggregator;
  private trendAnalyzer: TrendAnalyzer;

  constructor() {
    this.marketShareAggregator = new MarketShareAggregator();
    this.competitorAggregator = new CompetitorAnalysisAggregator();
    this.trendAnalyzer = new TrendAnalyzer();
  }

  /**
   * 包括的な市場分析レポートの生成
   */
  generateMarketAnalysisReport(year: number, region: string = 'Global'): {
    marketConcentration: number;
    topCompanies: MarketShareData[];
    competitiveAnalysis: CompetitorAnalysis[];
    averageRDRatio: number;
    highImpactTrends: TrendData[];
  } {
    return {
      marketConcentration: this.marketShareAggregator.calculateMarketConcentration(year, region),
      topCompanies: this.marketShareAggregator.getTopCompanies(year, region, 5),
      competitiveAnalysis: this.competitorAggregator.getCompetitorsByRevenue().slice(0, 5),
      averageRDRatio: this.competitorAggregator.calculateAverageRDRatio(),
      highImpactTrends: this.trendAnalyzer.getTrendsByImpact(7)
    };
  }

  /**
   * 日本企業の競争力分析
   */
  analyzeJapaneseCompetitiveness(): {
    japaneseCompanies: CompetitorAnalysis[];
    globalRanking: { company: string; rank: number; revenue: number }[];
    rdInvestmentComparison: { company: string; rdRatio: number }[];
  } {
    const japaneseCompanies = this.competitorAggregator.getCompetitorsByCountry('Japan');
    const allCompanies = this.competitorAggregator.getCompetitorsByRevenue();
    
    const globalRanking = allCompanies.map((company, index) => ({
      company: company.companyName,
      rank: index + 1,
      revenue: company.annualRevenue
    }));

    const rdInvestmentComparison = allCompanies.map(company => ({
      company: company.companyName,
      rdRatio: this.competitorAggregator.calculateRDRatio(company.companyName)
    }));

    return {
      japaneseCompanies,
      globalRanking,
      rdInvestmentComparison
    };
  }

  /**
   * データアクセサー
   */
  getMarketShareAggregator(): MarketShareAggregator {
    return this.marketShareAggregator;
  }

  getCompetitorAggregator(): CompetitorAnalysisAggregator {
    return this.competitorAggregator;
  }

  getTrendAnalyzer(): TrendAnalyzer {
    return this.trendAnalyzer;
  }
}

/**
 * 戦略提案統合システム
 */
export class StrategicAnalysisIntegrator {
  private marketDataManager: MarketDataManager;
  private challengeManager: ChallengeAssessmentManager;
  private recommendations: StrategicRecommendation[] = [];
  private benchmarks: InternationalBenchmark[] = [];

  constructor() {
    this.marketDataManager = new MarketDataManager();
    this.challengeManager = new ChallengeAssessmentManager();
  }

  /**
   * 戦略推奨事項の追加
   */
  addRecommendation(recommendation: StrategicRecommendation): void {
    this.validateRecommendation(recommendation);
    this.recommendations.push(recommendation);
  }

  /**
   * 国際ベンチマークの追加
   */
  addBenchmark(benchmark: InternationalBenchmark): void {
    this.validateBenchmark(benchmark);
    this.benchmarks.push(benchmark);
  }

  /**
   * 包括的戦略分析レポートの生成
   */
  generateComprehensiveReport(): {
    executiveSummary: {
      marketSize: number;
      growthRate: number;
      keyTrends: string[];
      criticalChallenges: ChallengeData[];
      topRecommendations: StrategicRecommendation[];
    };
    marketAnalysis: {
      currentState: any;
      competitivePosition: any;
      futureOutlook: any;
    };
    challengeAssessment: {
      byCategory: Record<string, ChallengeData[]>;
      priorityMatrix: ChallengeData[];
      riskLevel: string;
    };
    strategicRecommendations: {
      byPriority: Record<string, StrategicRecommendation[]>;
      implementationRoadmap: any;
      resourceRequirements: any;
    };
    internationalComparison: {
      bestPractices: InternationalBenchmark[];
      gapAnalysis: any;
      applicableLessons: string[];
    };
  } {
    
    const highPriorityChallenges = this.challengeManager.getHighPriorityChallenges();
    const topRecommendations = this.getTopRecommendations(5);
    
    return {
      executiveSummary: {
        marketSize: 0, // 実際の計算は市場データから
        growthRate: 0, // 実際の計算は市場データから
        keyTrends: [], // トレンド分析から
        criticalChallenges: highPriorityChallenges,
        topRecommendations: topRecommendations
      },
      marketAnalysis: {
        currentState: this.analyzeCurrentMarketState(),
        competitivePosition: this.analyzeCompetitivePosition(),
        futureOutlook: this.generateFutureOutlook()
      },
      challengeAssessment: {
        byCategory: this.categorizeAllChallenges(),
        priorityMatrix: this.challengeManager.getChallengesByPriority(),
        riskLevel: this.assessOverallRiskLevel()
      },
      strategicRecommendations: {
        byPriority: this.categorizeRecommendationsByPriority(),
        implementationRoadmap: this.generateImplementationRoadmap(),
        resourceRequirements: this.calculateResourceRequirements()
      },
      internationalComparison: {
        bestPractices: this.identifyBestPractices(),
        gapAnalysis: this.performGapAnalysis(),
        applicableLessons: this.extractApplicableLessons()
      }
    };
  }

  /**
   * 優先度別推奨事項の取得
   */
  getTopRecommendations(count: number): StrategicRecommendation[] {
    return this.recommendations
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, count);
  }

  /**
   * 実装ロードマップの生成
   */
  generateImplementationRoadmap(): {
    shortTerm: StrategicRecommendation[];
    mediumTerm: StrategicRecommendation[];
    longTerm: StrategicRecommendation[];
  } {
    return {
      shortTerm: this.recommendations.filter(r => r.timeframe.includes('1-2年')),
      mediumTerm: this.recommendations.filter(r => r.timeframe.includes('3-5年')),
      longTerm: this.recommendations.filter(r => r.timeframe.includes('5-10年'))
    };
  }

  /**
   * リソース要件の計算
   */
  calculateResourceRequirements(): {
    totalBudget: number;
    budgetByCategory: Record<string, number>;
    humanResources: string[];
    infrastructure: string[];
  } {
    const totalBudget = this.recommendations.reduce((sum, rec) => sum + rec.implementationCost, 0);
    
    const budgetByCategory = this.recommendations.reduce((acc, rec) => {
      acc[rec.category] = (acc[rec.category] || 0) + rec.implementationCost;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBudget,
      budgetByCategory,
      humanResources: [], // 実装時に詳細化
      infrastructure: []  // 実装時に詳細化
    };
  }

  private validateRecommendation(recommendation: StrategicRecommendation): void {
    if (!recommendation.id || recommendation.id.trim() === '') {
      throw new Error('推奨事項IDは必須です');
    }
    if (!recommendation.title || recommendation.title.trim() === '') {
      throw new Error('推奨事項タイトルは必須です');
    }
    if (recommendation.implementationCost < 0) {
      throw new Error('実装コストは0以上である必要があります');
    }
  }

  private validateBenchmark(benchmark: InternationalBenchmark): void {
    if (!benchmark.country || benchmark.country.trim() === '') {
      throw new Error('国名は必須です');
    }
    if (benchmark.budget < 0) {
      throw new Error('予算は0以上である必要があります');
    }
    if (benchmark.applicability < 1 || benchmark.applicability > 10) {
      throw new Error('適用可能性は1-10の範囲内である必要があります');
    }
  }

  private analyzeCurrentMarketState(): any {
    // 現在の市場状況分析ロジック
    return {
      marketMaturity: 'developing',
      competitionLevel: 'high',
      growthStage: 'rapid'
    };
  }

  private analyzeCompetitivePosition(): any {
    // 競争ポジション分析ロジック
    return {
      globalRanking: 'challenger',
      strengthAreas: ['manufacturing', 'quality'],
      weaknessAreas: ['marketing', 'ecosystem']
    };
  }

  private generateFutureOutlook(): any {
    // 将来展望生成ロジック
    return {
      growthPotential: 'high',
      keyDrivers: ['AI adoption', 'edge computing'],
      risks: ['supply chain', 'geopolitical']
    };
  }

  private categorizeAllChallenges(): Record<string, ChallengeData[]> {
    return {
      technological: this.challengeManager.getChallengesByCategory('technological'),
      economic: this.challengeManager.getChallengesByCategory('economic'),
      geopolitical: this.challengeManager.getChallengesByCategory('geopolitical')
    };
  }

  private assessOverallRiskLevel(): string {
    const challenges = this.challengeManager.getChallengesByPriority();
    const avgSeverity = challenges.reduce((sum, c) => sum + c.severity, 0) / challenges.length;
    
    if (avgSeverity >= 8) return '極めて高い';
    if (avgSeverity >= 6) return '高い';
    if (avgSeverity >= 4) return '中程度';
    return '低い';
  }

  private categorizeRecommendationsByPriority(): Record<string, StrategicRecommendation[]> {
    return {
      high: this.recommendations.filter(r => r.priority === 'high'),
      medium: this.recommendations.filter(r => r.priority === 'medium'),
      low: this.recommendations.filter(r => r.priority === 'low')
    };
  }

  private identifyBestPractices(): InternationalBenchmark[] {
    return this.benchmarks
      .filter(b => b.applicability >= 7)
      .sort((a, b) => b.applicability - a.applicability)
      .slice(0, 5);
  }

  private performGapAnalysis(): any {
    // ギャップ分析ロジック
    return {
      technologyGap: 'medium',
      investmentGap: 'high',
      policyGap: 'medium'
    };
  }

  private extractApplicableLessons(): string[] {
    return this.benchmarks
      .filter(b => b.applicability >= 6)
      .flatMap(b => b.lessons)
      .filter((lesson, index, arr) => arr.indexOf(lesson) === index) // 重複除去
      .slice(0, 10);
  }
}

/**
 * データ品質管理システム
 */
export class DataQualityManager {
  /**
   * データ完全性チェック
   */
  static checkDataCompleteness(data: any[]): {
    completenessScore: number;
    missingFields: string[];
    recommendations: string[];
  } {
    if (data.length === 0) {
      return {
        completenessScore: 0,
        missingFields: ['データなし'],
        recommendations: ['データ収集を開始してください']
      };
    }

    let totalFields = 0;
    let filledFields = 0;
    const missingFields: Set<string> = new Set();

    data.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        totalFields++;
        if (value !== null && value !== undefined && value !== '') {
          filledFields++;
        } else {
          missingFields.add(key);
        }
      });
    });

    const completenessScore = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
    
    const recommendations: string[] = [];
    if (completenessScore < 70) {
      recommendations.push('データ収集の強化が必要です');
    }
    if (missingFields.size > 5) {
      recommendations.push('必須フィールドの定義と収集プロセスの見直しが必要です');
    }

    return {
      completenessScore,
      missingFields: Array.from(missingFields),
      recommendations
    };
  }

  /**
   * データ一貫性チェック
   */
  static checkDataConsistency(data: any[]): {
    consistencyScore: number;
    inconsistencies: string[];
    recommendations: string[];
  } {
    const inconsistencies: string[] = [];
    let consistencyIssues = 0;
    let totalChecks = 0;

    // 年データの一貫性チェック
    data.forEach(item => {
      if (item.year) {
        totalChecks++;
        if (item.year < 2020 || item.year > 2030) {
          consistencyIssues++;
          inconsistencies.push(`無効な年: ${item.year}`);
        }
      }
    });

    // 数値データの一貫性チェック
    data.forEach(item => {
      Object.entries(item).forEach(([key, value]) => {
        if (typeof value === 'number') {
          totalChecks++;
          if (value < 0 && !key.includes('growth')) {
            consistencyIssues++;
            inconsistencies.push(`負の値: ${key} = ${value}`);
          }
        }
      });
    });

    const consistencyScore = totalChecks > 0 ? ((totalChecks - consistencyIssues) / totalChecks) * 100 : 100;
    
    const recommendations: string[] = [];
    if (consistencyScore < 80) {
      recommendations.push('データ検証プロセスの強化が必要です');
    }
    if (inconsistencies.length > 10) {
      recommendations.push('データ入力ガイドラインの策定が必要です');
    }

    return {
      consistencyScore,
      inconsistencies,
      recommendations
    };
  }
}