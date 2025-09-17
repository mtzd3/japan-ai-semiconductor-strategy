// 文書生成エンジン

import { readFile } from 'fs/promises';
import { MarketAnalysisResult } from '../analysis/market-analyzer.js';
import { ChallengeAnalysisResult } from '../analysis/challenge-analyzer.js';

/**
 * テンプレートデータ
 */
export interface TemplateData {
  // 基本情報
  currentYear: number;
  generatedDate: string;
  
  // 市場データ
  currentMarketSize: number;
  globalMarketSize: number;
  growthRate: number;
  japanMarketShare: number;
  globalRanking: number;
  competitionLevel: string;
  maturityStage: string;
  
  // 予測データ
  forecast2025: number;
  forecast2030: number;
  cagr2025: number;
  cagr2030: number;
  targetMarketShare2025: number;
  targetMarketShare2030: number;
  
  // 課題データ
  totalChallenges: number;
  criticalChallenges: number;
  technologicalChallengeCount: number;
  economicChallengeCount: number;
  geopoliticalChallengeCount: number;
  
  // 推奨事項
  immediateRecommendations: string[];
  shortTermRecommendations: string[];
  longTermRecommendations: string[];
  
  // 投資計画
  totalInvestment: number;
  governmentInvestment: number;
  privateInvestment: number;
  rdInvestmentRatio: number;
  talentInvestmentRatio: number;
  infrastructureInvestmentRatio: number;
  internationalInvestmentRatio: number;
  
  // 期待効果
  economicImpact: number;
  jobCreation: number;
  
  // その他
  conclusion: string;
  [key: string]: any;
}

/**
 * 文書生成設定
 */
export interface DocumentGenerationConfig {
  templatePath: string;
  outputPath: string;
  format: 'markdown' | 'html' | 'pdf';
  language: 'ja' | 'en';
  includeCharts: boolean;
  includeTables: boolean;
}

/**
 * 文書生成エンジン
 */
export class DocumentGenerator {
  private templates: Map<string, string> = new Map();

  /**
   * テンプレートの読み込み
   */
  async loadTemplate(name: string, path: string): Promise<void> {
    try {
      const content = await readFile(path, 'utf-8');
      this.templates.set(name, content);
    } catch (error) {
      throw new Error(`テンプレート読み込みエラー: ${path} - ${error}`);
    }
  }

  /**
   * 複数テンプレートの一括読み込み
   */
  async loadTemplates(templateConfigs: { name: string; path: string }[]): Promise<void> {
    const loadPromises = templateConfigs.map(config => 
      this.loadTemplate(config.name, config.path)
    );
    await Promise.all(loadPromises);
  }

  /**
   * エグゼクティブサマリーの生成
   */
  generateExecutiveSummary(
    marketAnalysis: MarketAnalysisResult,
    challengeAnalysis: ChallengeAnalysisResult
  ): string {
    const template = this.templates.get('executive-summary');
    if (!template) {
      throw new Error('エグゼクティブサマリーテンプレートが見つかりません');
    }

    const data = this.prepareExecutiveSummaryData(marketAnalysis, challengeAnalysis);
    return this.renderTemplate(template, data);
  }

  /**
   * 市場分析セクションの生成
   */
  generateMarketAnalysis(marketAnalysis: MarketAnalysisResult): string {
    const template = this.templates.get('market-analysis');
    if (!template) {
      throw new Error('市場分析テンプレートが見つかりません');
    }

    const data = this.prepareMarketAnalysisData(marketAnalysis);
    return this.renderTemplate(template, data);
  }

  /**
   * 課題分析セクションの生成
   */
  generateChallengeAnalysis(challengeAnalysis: ChallengeAnalysisResult): string {
    const template = this.templates.get('challenge-analysis');
    if (!template) {
      throw new Error('課題分析テンプレートが見つかりません');
    }

    const data = this.prepareChallengeAnalysisData(challengeAnalysis);
    return this.renderTemplate(template, data);
  }

  /**
   * 完全な戦略文書の生成
   */
  async generateFullDocument(
    marketAnalysis: MarketAnalysisResult,
    challengeAnalysis: ChallengeAnalysisResult,
    config: DocumentGenerationConfig
  ): Promise<string> {
    
    // 必要なテンプレートの読み込み
    await this.loadTemplates([
      { name: 'executive-summary', path: 'templates/executive-summary.md' },
      { name: 'market-analysis', path: 'templates/market-analysis.md' },
      { name: 'challenge-analysis', path: 'templates/challenge-analysis.md' }
    ]);

    // 各セクションの生成
    const executiveSummary = this.generateExecutiveSummary(marketAnalysis, challengeAnalysis);
    const marketAnalysisSection = this.generateMarketAnalysis(marketAnalysis);
    const challengeAnalysisSection = this.generateChallengeAnalysis(challengeAnalysis);

    // 文書の統合
    const fullDocument = this.combineDocumentSections([
      { title: 'エグゼクティブサマリー', content: executiveSummary },
      { title: '市場分析', content: marketAnalysisSection },
      { title: '課題の特定と分析', content: challengeAnalysisSection }
    ]);

    return fullDocument;
  }

  /**
   * エグゼクティブサマリー用データの準備
   */
  private prepareExecutiveSummaryData(
    marketAnalysis: MarketAnalysisResult,
    challengeAnalysis: ChallengeAnalysisResult
  ): TemplateData {
    return {
      currentYear: new Date().getFullYear(),
      generatedDate: new Date().toLocaleDateString('ja-JP'),
      
      // 市場データ
      currentMarketSize: marketAnalysis.currentState.marketSize,
      globalMarketSize: marketAnalysis.currentState.marketSize,
      growthRate: marketAnalysis.currentState.growthRate,
      japanMarketShare: marketAnalysis.competitivePosition.japanMarketShare,
      globalRanking: marketAnalysis.competitivePosition.globalRanking,
      competitionLevel: this.translateCompetitionLevel(marketAnalysis.currentState.competitionLevel),
      maturityStage: this.translateMaturityStage(marketAnalysis.currentState.maturityStage),
      
      // 予測データ
      forecast2025: marketAnalysis.marketForecast.projectedSize2025,
      forecast2030: marketAnalysis.marketForecast.projectedSize2030,
      cagr2025: marketAnalysis.marketForecast.expectedCAGR,
      cagr2030: marketAnalysis.marketForecast.expectedCAGR,
      targetMarketShare2025: 15, // 目標値
      targetMarketShare2030: 25, // 目標値
      
      // 課題データ
      totalChallenges: challengeAnalysis.overview.totalChallenges,
      criticalChallenges: challengeAnalysis.overview.criticalChallenges,
      technologicalChallengeCount: challengeAnalysis.categoryBreakdown.technological.count,
      economicChallengeCount: challengeAnalysis.categoryBreakdown.economic.count,
      geopoliticalChallengeCount: challengeAnalysis.categoryBreakdown.geopolitical.count,
      
      // 課題詳細
      topTechnologicalChallenges: challengeAnalysis.categoryBreakdown.technological.topChallenges,
      topEconomicChallenges: challengeAnalysis.categoryBreakdown.economic.topChallenges,
      topGeopoliticalChallenges: challengeAnalysis.categoryBreakdown.geopolitical.topChallenges,
      
      // 推奨事項
      immediateRecommendations: challengeAnalysis.recommendations.immediate,
      shortTermRecommendations: challengeAnalysis.recommendations.shortTerm,
      longTermRecommendations: challengeAnalysis.recommendations.longTerm,
      
      // 投資計画
      totalInvestment: 10, // 兆円
      governmentInvestment: 4, // 兆円
      privateInvestment: 6, // 兆円
      rdInvestmentRatio: 40,
      talentInvestmentRatio: 25,
      infrastructureInvestmentRatio: 20,
      internationalInvestmentRatio: 15,
      
      // 期待効果
      economicImpact: 50, // 兆円
      jobCreation: 100, // 万人
      
      // リスク
      majorRisks: [
        { name: '技術競争激化', description: 'グローバル競合との技術格差拡大', impact: 9 },
        { name: 'サプライチェーン依存', description: '海外依存による供給リスク', impact: 8 },
        { name: '人材不足', description: '専門人材の慢性的不足', impact: 7 }
      ],
      riskMitigationMeasures: [
        '技術開発投資の大幅増額',
        'サプライチェーンの多様化',
        '人材育成プログラムの強化'
      ],
      
      conclusion: '包括的な戦略実行と官民連携による集中投資が不可欠である。'
    };
  }

  /**
   * 市場分析用データの準備
   */
  private prepareMarketAnalysisData(marketAnalysis: MarketAnalysisResult): TemplateData {
    return {
      currentYear: new Date().getFullYear(),
      globalMarketSize: marketAnalysis.currentState.marketSize,
      
      // 市場履歴（モックデータ）
      marketHistory: [
        { year: 2020, marketSize: 8000, growthRate: 15.2, drivers: 'クラウドAI需要' },
        { year: 2021, marketSize: 10500, growthRate: 31.3, drivers: 'エッジAI普及' },
        { year: 2022, marketSize: 14200, growthRate: 35.2, drivers: '生成AI ブーム' },
        { year: 2023, marketSize: 19800, growthRate: 39.4, drivers: 'ChatGPT効果' }
      ],
      
      // 予測データ
      forecast2025: marketAnalysis.marketForecast.projectedSize2025,
      forecast2030: marketAnalysis.marketForecast.projectedSize2030,
      cagr2025: marketAnalysis.marketForecast.expectedCAGR,
      cagr2030: marketAnalysis.marketForecast.expectedCAGR,
      
      // 成長要因
      growthDrivers: [
        { name: '生成AI普及', description: 'ChatGPT等の生成AIサービス拡大' },
        { name: 'エッジAI需要', description: 'IoT・自動車でのエッジ処理需要' },
        { name: 'データセンター投資', description: 'クラウド事業者の大規模投資' }
      ],
      
      // 制約要因
      constraintFactors: [
        { name: '電力制約', description: '高性能チップの消費電力増大' },
        { name: '製造能力', description: '先端プロセスの製造キャパシティ不足' },
        { name: '地政学リスク', description: '米中対立による供給網混乱' }
      ],
      
      // セグメント別データ
      trainingChipMarketSize: 12000,
      trainingChipGrowthRate: 45,
      trainingChipPlayers: 'NVIDIA, AMD, Google',
      
      inferenceChipMarketSize: 8000,
      inferenceChipGrowthRate: 35,
      inferenceChipPlayers: 'NVIDIA, Intel, Qualcomm',
      
      edgeAIMarketSize: 5000,
      edgeAIGrowthRate: 55,
      edgeAIPlayers: 'Qualcomm, MediaTek, Apple',
      
      // 地域別市場
      northAmericaMarket: {
        marketSize: 8500,
        marketShare: 43,
        characteristics: '技術革新の中心地、大手テック企業集積',
        keyCompanies: 'NVIDIA, AMD, Intel, Google, Microsoft'
      },
      
      chinaMarket: {
        marketSize: 6200,
        marketShare: 31,
        characteristics: '政府主導の大規模投資、国産化推進',
        keyCompanies: 'Baidu, Alibaba, Tencent, Cambricon'
      },
      
      europeMarket: {
        marketSize: 2800,
        marketShare: 14,
        characteristics: 'プライバシー重視、規制強化',
        keyCompanies: 'ARM, ASML, Infineon'
      },
      
      japanMarket: {
        marketSize: 2400,
        marketShare: 12,
        characteristics: '製造技術に強み、エコシステム構築が課題',
        keyCompanies: 'ソニー, 東芝, ルネサス, 富士通'
      },
      
      // 競合企業データ
      nvidia: {
        marketShare: 45.2,
        revenue: 6091,
        rdInvestment: 731,
        keyProducts: ['H100', 'A100', 'RTX 4090'],
        advantages: ['CUDA エコシステム', '圧倒的性能', 'ソフトウェア統合'],
        challenges: ['高価格', '電力消費', '供給制約']
      },
      
      amd: {
        marketShare: 15.8,
        revenue: 2382,
        rdInvestment: 595,
        keyProducts: ['MI300X', 'EPYC', 'Radeon'],
        advantages: ['コストパフォーマンス', 'オープン戦略'],
        challenges: ['エコシステム', 'ソフトウェア']
      },
      
      intel: {
        marketShare: 12.3,
        revenue: 6301,
        rdInvestment: 1501,
        keyProducts: ['Gaudi', 'Xeon', 'Arc'],
        advantages: ['製造技術', '企業顧客基盤'],
        challenges: ['AI分野での後発', '技術的遅れ']
      },
      
      // 日本企業
      japaneseCompanies: {
        totalMarketShare: 8.5,
        globalRanking: 4,
        strengthAreas: ['製造技術', '品質管理', '省電力設計'],
        weaknessAreas: ['ソフトウェア', 'エコシステム', 'マーケティング']
      },
      
      japaneseCompetitors: [
        {
          companyName: 'ソニー',
          marketShare: 3.2,
          revenue: 1250,
          rdInvestment: 125,
          keyProducts: ['イメージセンサー', 'AI処理チップ'],
          strengths: ['センサー技術', 'エッジAI'],
          weaknesses: ['汎用AI市場', 'エコシステム']
        }
      ]
    };
  }

  /**
   * 課題分析用データの準備
   */
  private prepareChallengeAnalysisData(challengeAnalysis: ChallengeAnalysisResult): TemplateData {
    return {
      currentYear: new Date().getFullYear(),
      totalChallenges: challengeAnalysis.overview.totalChallenges,
      criticalChallenges: challengeAnalysis.overview.criticalChallenges,
      averageSeverity: challengeAnalysis.overview.averageSeverity,
      averageUrgency: challengeAnalysis.overview.averageUrgency,
      riskLevel: this.translateRiskLevel(challengeAnalysis.overview.riskLevel),
      
      // カテゴリ別データ
      technologicalChallenges: challengeAnalysis.categoryBreakdown.technological,
      economicChallenges: challengeAnalysis.categoryBreakdown.economic,
      geopoliticalChallenges: challengeAnalysis.categoryBreakdown.geopolitical,
      
      // 優先度マトリックス
      priorityMatrix: challengeAnalysis.priorityMatrix,
      
      // サプライチェーンリスク
      supplyChainRisks: challengeAnalysis.supplyChainRisks,
      
      // 人材ギャップ
      talentGaps: challengeAnalysis.talentGaps,
      
      // 推奨事項
      recommendations: challengeAnalysis.recommendations
    };
  }

  /**
   * テンプレートレンダリング
   */
  private renderTemplate(template: string, data: TemplateData): string {
    let rendered = template;

    // 単純な変数置換
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      rendered = rendered.replace(new RegExp(placeholder, 'g'), stringValue);
    });

    // 配列のループ処理（簡易版）
    rendered = this.processArrayLoops(rendered, data);

    return rendered;
  }

  /**
   * 配列ループの処理
   */
  private processArrayLoops(template: string, data: TemplateData): string {
    let processed = template;

    // {{#each arrayName}} ... {{/each}} パターンの処理
    const loopPattern = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    
    processed = processed.replace(loopPattern, (match, arrayName, loopContent) => {
      const arrayData = data[arrayName];
      if (!Array.isArray(arrayData)) {
        return '';
      }

      return arrayData.map(item => {
        let itemContent = loopContent;
        
        if (typeof item === 'object') {
          Object.entries(item).forEach(([key, value]) => {
            const itemPlaceholder = `{{${key}}}`;
            itemContent = itemContent.replace(new RegExp(itemPlaceholder, 'g'), String(value));
          });
        } else {
          itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
        }
        
        return itemContent;
      }).join('');
    });

    return processed;
  }

  /**
   * 文書セクションの統合
   */
  private combineDocumentSections(sections: { title: string; content: string }[]): string {
    const header = `# 日本AI半導体戦略提案書

**生成日**: ${new Date().toLocaleDateString('ja-JP')}
**バージョン**: 1.0.0

---

`;

    const tableOfContents = `## 目次

${sections.map((section, index) => `${index + 1}. ${section.title}`).join('\n')}

---

`;

    const content = sections.map(section => section.content).join('\n\n---\n\n');

    return header + tableOfContents + content;
  }

  // ヘルパーメソッド
  private translateCompetitionLevel(level: string): string {
    const translations = {
      'low': '低',
      'medium': '中程度',
      'high': '高',
      'extreme': '極めて高い'
    };
    return translations[level as keyof typeof translations] || level;
  }

  private translateMaturityStage(stage: string): string {
    const translations = {
      'emerging': '新興期',
      'growth': '成長期',
      'mature': '成熟期',
      'declining': '衰退期'
    };
    return translations[stage as keyof typeof translations] || stage;
  }

  private translateRiskLevel(level: string): string {
    const translations = {
      'low': '低',
      'medium': '中程度',
      'high': '高',
      'critical': '極めて高い'
    };
    return translations[level as keyof typeof translations] || level;
  }
}