// 国際ベンチマーキングシステム

import { InternationalBenchmark } from '../data/types.js';

/**
 * ベンチマーク分析結果
 */
export interface BenchmarkAnalysisResult {
  overview: {
    totalCountries: number;
    totalInvestment: number; // 億円
    averageInvestment: number;
    topPerformers: string[];
    emergingPlayers: string[];
  };
  countryProfiles: CountryProfile[];
  comparativeAnalysis: {
    investmentComparison: { country: string; investment: number; gdpRatio: number }[];
    strategyComparison: { country: string; approach: string; focus: string[] }[];
    performanceRanking: { country: string; score: number; rank: number }[];
  };
  bestPractices: {
    category: string;
    practice: string;
    country: string;
    description: string;
    applicability: number;
  }[];
  gapAnalysis: {
    area: string;
    japanLevel: number;
    globalBest: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

/**
 * 国別プロファイル
 */
export interface CountryProfile {
  country: string;
  strategy: string;
  totalBudget: number; // 億円
  gdp: number; // 兆円
  budgetGdpRatio: number; // %
  keyInitiatives: string[];
  focusAreas: string[];
  strengths: string[];
  weaknesses: string[];
  timeline: string;
  expectedOutcomes: string[];
  lessonsLearned: string[];
  applicabilityToJapan: number; // 1-10
}

/**
 * 国際ベンチマーキング分析エンジン
 */
export class InternationalBenchmarkAnalyzer {
  private benchmarks: InternationalBenchmark[] = [];
  private countryProfiles: CountryProfile[] = [];

  constructor() {
    this.initializeCountryData();
  }

  /**
   * 国別データの初期化
   */
  private initializeCountryData(): void {
    this.benchmarks = [
      {
        country: '米国',
        strategy: 'CHIPS and Science Act',
        budget: 52000, // 520億ドル = 約5.2兆円
        keyInitiatives: [
          '半導体製造への527億ドル投資',
          'R&D投資200億ドル',
          '国防関連半導体強化',
          '同盟国との技術協力'
        ],
        successFactors: [
          '巨額の政府投資',
          '民間企業との連携',
          '国家安全保障との連動',
          '人材育成プログラム'
        ],
        lessons: [
          '政府の強力なリーダーシップが重要',
          '民間投資を呼び込む仕組み作りが効果的',
          '国際協力と国内産業育成のバランスが鍵'
        ],
        applicability: 8
      },
      {
        country: '中国',
        strategy: '国家集積回路産業発展推進綱要',
        budget: 150000, // 約15兆円（複数ファンド合計）
        keyInitiatives: [
          '国家集積回路産業投資基金',
          '地方政府による産業クラスター形成',
          '海外企業買収・技術獲得',
          '国産化率向上目標設定'
        ],
        successFactors: [
          '国家主導の大規模投資',
          '長期的な戦略実行',
          '産学官の密接な連携',
          '市場規模を活かした育成'
        ],
        lessons: [
          '長期的視点での継続投資が重要',
          '国内市場の活用が産業育成に効果的',
          '技術獲得と自主開発の両面戦略'
        ],
        applicability: 6
      },
      {
        country: '韓国',
        strategy: 'K-Semiconductor Belt',
        budget: 45000, // 約4.5兆円
        keyInitiatives: [
          '京畿道半導体クラスター構築',
          'メモリ半導体技術高度化',
          'システム半導体育成',
          '人材育成プログラム強化'
        ],
        successFactors: [
          '地域クラスター戦略',
          '既存強みの活用',
          '政府と財閥の連携',
          '集中投資による効率化'
        ],
        lessons: [
          '既存の強み分野からの展開が効果的',
          '地域クラスター形成による相乗効果',
          '民間大企業との密接な連携'
        ],
        applicability: 9
      },
      {
        country: '台湾',
        strategy: '半導体先進製程計画',
        budget: 8000, // 約8000億円
        keyInitiatives: [
          '先端プロセス技術開発',
          'TSMCを中心とした産業エコシステム',
          '人材育成・確保',
          '研究開発投資拡大'
        ],
        successFactors: [
          'ファウンドリモデルの確立',
          '技術特化戦略',
          '国際的な顧客基盤',
          '継続的な技術革新'
        ],
        lessons: [
          '特定分野での世界トップ地位確立',
          '国際分業体制での地位確保',
          '技術革新への継続投資'
        ],
        applicability: 7
      },
      {
        country: 'EU',
        strategy: 'European Chips Act',
        budget: 43000, // 430億ユーロ = 約4.3兆円
        keyInitiatives: [
          '欧州半導体製造能力強化',
          '研究開発投資拡大',
          'デジタル主権確保',
          '国際パートナーシップ'
        ],
        successFactors: [
          '域内協力体制',
          '研究開発重視',
          '持続可能性への配慮',
          '規制・標準化での主導権'
        ],
        lessons: [
          '多国間協力の重要性',
          '研究開発への長期投資',
          '規制・標準化での影響力確保'
        ],
        applicability: 8
      },
      {
        country: 'インド',
        strategy: 'Production Linked Incentive Scheme',
        budget: 7600, // 約7600億円
        keyInitiatives: [
          '半導体製造誘致',
          'デザイン能力強化',
          '人材育成プログラム',
          'スタートアップ支援'
        ],
        successFactors: [
          '人材コストの優位性',
          '巨大な国内市場',
          '政府の積極支援',
          'IT産業基盤の活用'
        ],
        lessons: [
          '人材優位性の活用',
          '段階的な産業育成',
          '国内市場を活かした成長戦略'
        ],
        applicability: 5
      }
    ];

    this.countryProfiles = this.createCountryProfiles();
  }

  /**
   * 国別プロファイルの作成
   */
  private createCountryProfiles(): CountryProfile[] {
    const gdpData: Record<string, number> = {
      '米国': 2570, // 25.7兆ドル
      '中国': 1770, // 17.7兆ドル
      '韓国': 180, // 1.8兆ドル
      '台湾': 79, // 0.79兆ドル
      'EU': 1700, // 17兆ドル
      'インド': 370 // 3.7兆ドル
    };

    return this.benchmarks.map(benchmark => ({
      country: benchmark.country,
      strategy: benchmark.strategy,
      totalBudget: benchmark.budget,
      gdp: gdpData[benchmark.country] || 100,
      budgetGdpRatio: (benchmark.budget / 100) / (gdpData[benchmark.country] || 100) * 100,
      keyInitiatives: benchmark.keyInitiatives,
      focusAreas: this.extractFocusAreas(benchmark),
      strengths: this.extractStrengths(benchmark),
      weaknesses: this.extractWeaknesses(benchmark),
      timeline: this.extractTimeline(benchmark),
      expectedOutcomes: this.extractExpectedOutcomes(benchmark),
      lessonsLearned: benchmark.lessons,
      applicabilityToJapan: benchmark.applicability
    }));
  }

  /**
   * ベンチマーク分析の実行
   */
  analyzeBenchmarks(): BenchmarkAnalysisResult {
    const overview = this.generateOverview();
    const comparativeAnalysis = this.performComparativeAnalysis();
    const bestPractices = this.identifyBestPractices();
    const gapAnalysis = this.performGapAnalysis();
    const recommendations = this.generateRecommendations(gapAnalysis);

    return {
      overview,
      countryProfiles: this.countryProfiles,
      comparativeAnalysis,
      bestPractices,
      gapAnalysis,
      recommendations
    };
  }

  /**
   * 概要の生成
   */
  private generateOverview(): BenchmarkAnalysisResult['overview'] {
    const totalInvestment = this.benchmarks.reduce((sum, b) => sum + b.budget, 0);
    const averageInvestment = totalInvestment / this.benchmarks.length;
    
    const topPerformers = this.benchmarks
      .filter(b => b.budget > averageInvestment * 1.5)
      .map(b => b.country);
    
    const emergingPlayers = this.benchmarks
      .filter(b => b.applicability >= 7 && !topPerformers.includes(b.country))
      .map(b => b.country);

    return {
      totalCountries: this.benchmarks.length,
      totalInvestment,
      averageInvestment,
      topPerformers,
      emergingPlayers
    };
  }

  /**
   * 比較分析の実行
   */
  private performComparativeAnalysis(): BenchmarkAnalysisResult['comparativeAnalysis'] {
    const investmentComparison = this.countryProfiles.map(profile => ({
      country: profile.country,
      investment: profile.totalBudget,
      gdpRatio: profile.budgetGdpRatio
    })).sort((a, b) => b.investment - a.investment);

    const strategyComparison = this.countryProfiles.map(profile => ({
      country: profile.country,
      approach: this.categorizeApproach(profile),
      focus: profile.focusAreas
    }));

    const performanceRanking = this.countryProfiles.map((profile, index) => ({
      country: profile.country,
      score: this.calculatePerformanceScore(profile),
      rank: index + 1
    })).sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    return {
      investmentComparison,
      strategyComparison,
      performanceRanking
    };
  }

  /**
   * ベストプラクティスの特定
   */
  private identifyBestPractices(): BenchmarkAnalysisResult['bestPractices'] {
    return [
      {
        category: '政府投資',
        practice: '大規模な政府投資による産業基盤構築',
        country: '米国',
        description: 'CHIPS Actによる527億ドルの製造投資と200億ドルのR&D投資',
        applicability: 8
      },
      {
        category: '産業クラスター',
        practice: '地域クラスター戦略による産業集積',
        country: '韓国',
        description: '京畿道を中心とした半導体クラスター形成と企業間連携促進',
        applicability: 9
      },
      {
        category: '技術特化',
        practice: '特定技術分野での世界トップ地位確立',
        country: '台湾',
        description: 'ファウンドリ事業での世界シェア60%超の圧倒的地位確立',
        applicability: 7
      },
      {
        category: '国際協力',
        practice: '多国間協力による技術・市場アクセス',
        country: 'EU',
        description: '域内27カ国の協力体制とグローバルパートナーシップ',
        applicability: 8
      },
      {
        category: '人材育成',
        practice: '産学官連携による専門人材育成',
        country: 'インド',
        description: 'IIT等の技術系大学と産業界の密接な連携による人材供給',
        applicability: 9
      },
      {
        category: '長期戦略',
        practice: '10-15年の長期戦略による継続投資',
        country: '中国',
        description: '国家集積回路産業発展推進綱要による長期的産業育成',
        applicability: 6
      }
    ];
  }

  /**
   * ギャップ分析の実行
   */
  private performGapAnalysis(): BenchmarkAnalysisResult['gapAnalysis'] {
    return [
      {
        area: '政府投資規模',
        japanLevel: 2, // 現在の日本の投資レベル（相対評価）
        globalBest: 10, // 米国・中国レベル
        gap: 8,
        priority: 'high'
      },
      {
        area: '産業クラスター',
        japanLevel: 4,
        globalBest: 9, // 韓国・台湾レベル
        gap: 5,
        priority: 'high'
      },
      {
        area: '技術特化戦略',
        japanLevel: 5,
        globalBest: 10, // 台湾レベル
        gap: 5,
        priority: 'high'
      },
      {
        area: '国際協力',
        japanLevel: 6,
        globalBest: 9, // EUレベル
        gap: 3,
        priority: 'medium'
      },
      {
        area: '人材育成',
        japanLevel: 5,
        globalBest: 8, // インドレベル
        gap: 3,
        priority: 'medium'
      },
      {
        area: '長期戦略実行',
        japanLevel: 4,
        globalBest: 9, // 中国レベル
        gap: 5,
        priority: 'high'
      }
    ];
  }

  /**
   * 推奨事項の生成
   */
  private generateRecommendations(gapAnalysis: BenchmarkAnalysisResult['gapAnalysis']): BenchmarkAnalysisResult['recommendations'] {
    const highPriorityGaps = gapAnalysis.filter(gap => gap.priority === 'high');
    
    const immediate = [
      '政府投資規模の大幅拡大（年間5,000億円→2兆円）',
      '半導体戦略会議の設置と権限強化',
      '緊急人材確保プログラムの開始'
    ];

    const shortTerm = [
      '国立AI半導体研究センターの設立',
      '産業クラスター形成支援（関東・関西・九州）',
      '技術特化分野の選定と集中投資',
      '国際パートナーシップ協定の締結'
    ];

    const longTerm = [
      '10年間で10兆円の投資計画実行',
      '世界トップ3の技術分野確立',
      'アジア太平洋半導体協力機構の設立',
      '次世代技術での国際標準化主導'
    ];

    return { immediate, shortTerm, longTerm };
  }

  // ヘルパーメソッド
  private extractFocusAreas(benchmark: InternationalBenchmark): string[] {
    const focusMap: Record<string, string[]> = {
      '米国': ['製造', 'R&D', '国防', '同盟協力'],
      '中国': ['国産化', '製造', '設計', '材料'],
      '韓国': ['メモリ', 'システム半導体', 'クラスター', '人材'],
      '台湾': ['先端プロセス', 'ファウンドリ', '技術革新'],
      'EU': ['製造', 'デジタル主権', '持続可能性', '協力'],
      'インド': ['設計', '製造誘致', '人材', 'スタートアップ']
    };
    return focusMap[benchmark.country] || [];
  }

  private extractStrengths(benchmark: InternationalBenchmark): string[] {
    return benchmark.successFactors;
  }

  private extractWeaknesses(benchmark: InternationalBenchmark): string[] {
    const weaknessMap: Record<string, string[]> = {
      '米国': ['製造コスト', '中国依存', '人材不足'],
      '中国': ['技術格差', '国際制裁', '効率性'],
      '韓国': ['市場規模', '技術依存', '地政学リスク'],
      '台湾': ['地政学リスク', '市場集中', '人材確保'],
      'EU': ['統合の困難', '投資規模', '競争力'],
      'インド': ['インフラ', '技術基盤', '資金調達']
    };
    return weaknessMap[benchmark.country] || [];
  }

  private extractTimeline(benchmark: InternationalBenchmark): string {
    const timelineMap: Record<string, string> = {
      '米国': '2022-2027年（5年間）',
      '中国': '2014-2030年（16年間）',
      '韓国': '2021-2030年（10年間）',
      '台湾': '2021-2025年（5年間）',
      'EU': '2023-2030年（8年間）',
      'インド': '2021-2026年（6年間）'
    };
    return timelineMap[benchmark.country] || '不明';
  }

  private extractExpectedOutcomes(benchmark: InternationalBenchmark): string[] {
    const outcomeMap: Record<string, string[]> = {
      '米国': ['製造能力回復', '技術的優位性確保', '雇用創出10万人'],
      '中国': ['自給率70%達成', '世界シェア拡大', '技術的自立'],
      '韓国': ['システム半導体強化', 'メモリ優位性維持', '雇用創出15万人'],
      '台湾': ['先端プロセス優位性維持', '技術革新継続'],
      'EU': ['戦略的自律性確保', '製造能力4倍増', 'デジタル主権'],
      'インド': ['製造ハブ化', '設計能力強化', '雇用創出100万人']
    };
    return outcomeMap[benchmark.country] || [];
  }

  private categorizeApproach(profile: CountryProfile): string {
    if (profile.totalBudget > 50000) return '大規模投資型';
    if (profile.focusAreas.includes('製造')) return '製造重視型';
    if (profile.focusAreas.includes('設計')) return '設計重視型';
    if (profile.focusAreas.includes('クラスター')) return 'クラスター型';
    return '総合型';
  }

  private calculatePerformanceScore(profile: CountryProfile): number {
    let score = 0;
    
    // 投資規模（30点）
    score += Math.min(30, (profile.totalBudget / 100000) * 30);
    
    // GDP比率（20点）
    score += Math.min(20, profile.budgetGdpRatio * 4);
    
    // 日本への適用可能性（30点）
    score += (profile.applicabilityToJapan / 10) * 30;
    
    // 戦略の包括性（20点）
    score += Math.min(20, profile.keyInitiatives.length * 4);
    
    return Math.round(score);
  }
}