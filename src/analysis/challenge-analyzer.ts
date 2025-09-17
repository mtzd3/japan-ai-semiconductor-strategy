// 課題分析エンジン

import { ChallengeData, TechnicalCapability } from '../data/types.js';
import { 
  ChallengeAssessmentManager, 
  ChallengeClassifier,
  SupplyChainDependencyAnalyzer,
  TalentGapQuantifier
} from '../data/challenges.js';

/**
 * 課題分析結果
 */
export interface ChallengeAnalysisResult {
  overview: {
    totalChallenges: number;
    criticalChallenges: number;
    averageSeverity: number;
    averageUrgency: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  categoryBreakdown: {
    technological: {
      count: number;
      avgSeverity: number;
      topChallenges: ChallengeData[];
    };
    economic: {
      count: number;
      avgSeverity: number;
      topChallenges: ChallengeData[];
    };
    geopolitical: {
      count: number;
      avgSeverity: number;
      topChallenges: ChallengeData[];
    };
  };
  priorityMatrix: {
    highPriorityHighUrgency: ChallengeData[];
    highPriorityMediumUrgency: ChallengeData[];
    mediumPriorityHighUrgency: ChallengeData[];
    lowPriority: ChallengeData[];
  };
  supplyChainRisks: {
    overallRiskLevel: number;
    criticalDependencies: string[];
    riskMitigation: string[];
  };
  talentGaps: {
    criticalSkills: string[];
    totalGapSize: number;
    trainingCostEstimate: number;
    timeToClose: number;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

/**
 * 課題分析エンジン
 */
export class ChallengeAnalyzer {
  private challengeManager: ChallengeAssessmentManager;

  constructor() {
    this.challengeManager = new ChallengeAssessmentManager();
  }

  /**
   * 包括的課題分析の実行
   */
  async analyzeChallenges(
    challenges: ChallengeData[],
    technicalCapabilities?: TechnicalCapability[]
  ): Promise<ChallengeAnalysisResult> {
    
    // 課題データの追加と検証
    challenges.forEach(challenge => {
      this.challengeManager.addChallenge(challenge);
    });

    // 各分析の実行
    const overview = this.generateOverview(challenges);
    const categoryBreakdown = this.analyzeChallengesByCategory(challenges);
    const priorityMatrix = this.createPriorityMatrix(challenges);
    const supplyChainRisks = this.analyzeSupplyChainRisks(challenges);
    const talentGaps = this.analyzeTalentGaps(challenges, technicalCapabilities);
    const recommendations = this.generateRecommendations(overview, categoryBreakdown, priorityMatrix);

    return {
      overview,
      categoryBreakdown,
      priorityMatrix,
      supplyChainRisks,
      talentGaps,
      recommendations
    };
  }

  /**
   * 課題概要の生成
   */
  private generateOverview(challenges: ChallengeData[]): ChallengeAnalysisResult['overview'] {
    if (challenges.length === 0) {
      return {
        totalChallenges: 0,
        criticalChallenges: 0,
        averageSeverity: 0,
        averageUrgency: 0,
        riskLevel: 'low'
      };
    }

    const totalChallenges = challenges.length;
    const criticalChallenges = challenges.filter(c => c.severity >= 8 || c.urgency >= 8).length;
    const averageSeverity = challenges.reduce((sum, c) => sum + c.severity, 0) / totalChallenges;
    const averageUrgency = challenges.reduce((sum, c) => sum + c.urgency, 0) / totalChallenges;

    // リスクレベルの判定
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    const avgRisk = (averageSeverity + averageUrgency) / 2;
    
    if (avgRisk >= 8.5) riskLevel = 'critical';
    else if (avgRisk >= 7) riskLevel = 'high';
    else if (avgRisk >= 5) riskLevel = 'medium';
    else riskLevel = 'low';

    return {
      totalChallenges,
      criticalChallenges,
      averageSeverity,
      averageUrgency,
      riskLevel
    };
  }

  /**
   * カテゴリ別課題分析
   */
  private analyzeChallengesByCategory(challenges: ChallengeData[]): ChallengeAnalysisResult['categoryBreakdown'] {
    const technological = challenges.filter(c => c.category === 'technological');
    const economic = challenges.filter(c => c.category === 'economic');
    const geopolitical = challenges.filter(c => c.category === 'geopolitical');

    return {
      technological: {
        count: technological.length,
        avgSeverity: this.calculateAverageSeverity(technological),
        topChallenges: this.getTopChallenges(technological, 3)
      },
      economic: {
        count: economic.length,
        avgSeverity: this.calculateAverageSeverity(economic),
        topChallenges: this.getTopChallenges(economic, 3)
      },
      geopolitical: {
        count: geopolitical.length,
        avgSeverity: this.calculateAverageSeverity(geopolitical),
        topChallenges: this.getTopChallenges(geopolitical, 3)
      }
    };
  }

  /**
   * 優先度マトリックスの作成
   */
  private createPriorityMatrix(challenges: ChallengeData[]): ChallengeAnalysisResult['priorityMatrix'] {
    const highPriorityHighUrgency = challenges.filter(c => c.severity >= 7 && c.urgency >= 7);
    const highPriorityMediumUrgency = challenges.filter(c => c.severity >= 7 && c.urgency >= 4 && c.urgency < 7);
    const mediumPriorityHighUrgency = challenges.filter(c => c.severity >= 4 && c.severity < 7 && c.urgency >= 7);
    const lowPriority = challenges.filter(c => c.severity < 4 || (c.severity < 7 && c.urgency < 4));

    return {
      highPriorityHighUrgency: this.sortByPriorityScore(highPriorityHighUrgency),
      highPriorityMediumUrgency: this.sortByPriorityScore(highPriorityMediumUrgency),
      mediumPriorityHighUrgency: this.sortByPriorityScore(mediumPriorityHighUrgency),
      lowPriority: this.sortByPriorityScore(lowPriority)
    };
  }

  /**
   * サプライチェーンリスク分析
   */
  private analyzeSupplyChainRisks(challenges: ChallengeData[]): ChallengeAnalysisResult['supplyChainRisks'] {
    const supplyChainChallenges = challenges.filter(c => 
      c.description.includes('サプライチェーン') || 
      c.description.includes('供給網') ||
      c.description.includes('調達')
    );

    // 簡易リスク評価
    const riskAssessment = SupplyChainDependencyAnalyzer.assessSupplyChainRisk(
      8, // 高い依存度
      7, // 高いサプライヤー集中度
      8  // 高い地政学的リスク
    );

    const criticalDependencies = [
      '台湾TSMC（先端プロセス）',
      '韓国サムスン（メモリ）',
      '中国レアアース（原材料）',
      '米国EDAツール（設計）'
    ];

    return {
      overallRiskLevel: riskAssessment.riskLevel,
      criticalDependencies,
      riskMitigation: riskAssessment.recommendations
    };
  }

  /**
   * 人材ギャップ分析
   */
  private analyzeTalentGaps(
    challenges: ChallengeData[],
    technicalCapabilities?: TechnicalCapability[]
  ): ChallengeAnalysisResult['talentGaps'] {
    
    const talentChallenges = challenges.filter(c => 
      c.description.includes('人材') || 
      c.description.includes('スキル') ||
      c.description.includes('エンジニア')
    );

    // 重要スキル領域の特定
    const criticalSkills = [
      'AI/MLアルゴリズム設計',
      '半導体アーキテクチャ設計',
      'システムソフトウェア開発',
      'ハードウェア・ソフトウェア協調設計',
      'プロダクトマネジメント'
    ];

    // 人材ギャップの定量化
    const gapAnalysis = TalentGapQuantifier.quantifyTalentGap(
      1000,  // 現在の人材数
      3000,  // 必要な人材数
      'senior', // スキルレベル
      5      // 達成期間（年）
    );

    return {
      criticalSkills,
      totalGapSize: gapAnalysis.gapSize,
      trainingCostEstimate: gapAnalysis.trainingCost,
      timeToClose: 5 // 年
    };
  }

  /**
   * 推奨事項の生成
   */
  private generateRecommendations(
    overview: ChallengeAnalysisResult['overview'],
    categoryBreakdown: ChallengeAnalysisResult['categoryBreakdown'],
    priorityMatrix: ChallengeAnalysisResult['priorityMatrix']
  ): ChallengeAnalysisResult['recommendations'] {
    
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];

    // 緊急対応が必要な推奨事項
    if (priorityMatrix.highPriorityHighUrgency.length > 0) {
      immediate.push('最高優先度課題への緊急対策チーム設置');
      immediate.push('クライシス管理体制の構築');
    }

    if (overview.riskLevel === 'critical') {
      immediate.push('経営陣レベルでの緊急戦略会議開催');
    }

    // 短期的推奨事項
    if (categoryBreakdown.technological.avgSeverity >= 7) {
      shortTerm.push('技術開発投資の大幅増額');
      shortTerm.push('海外技術パートナーシップの強化');
    }

    if (categoryBreakdown.economic.avgSeverity >= 7) {
      shortTerm.push('政府補助金・税制優遇の活用');
      shortTerm.push('民間投資の呼び込み強化');
    }

    if (categoryBreakdown.geopolitical.avgSeverity >= 7) {
      shortTerm.push('サプライチェーンの多様化');
      shortTerm.push('国際協力関係の強化');
    }

    // 長期的推奨事項
    longTerm.push('次世代技術への戦略的投資');
    longTerm.push('人材育成システムの抜本的改革');
    longTerm.push('産学官連携エコシステムの構築');
    longTerm.push('国際標準化活動への積極参加');

    return { immediate, shortTerm, longTerm };
  }

  // ヘルパーメソッド
  private calculateAverageSeverity(challenges: ChallengeData[]): number {
    if (challenges.length === 0) return 0;
    return challenges.reduce((sum, c) => sum + c.severity, 0) / challenges.length;
  }

  private getTopChallenges(challenges: ChallengeData[], count: number): ChallengeData[] {
    return challenges
      .sort((a, b) => ChallengeClassifier.calculatePriorityScore(b) - ChallengeClassifier.calculatePriorityScore(a))
      .slice(0, count);
  }

  private sortByPriorityScore(challenges: ChallengeData[]): ChallengeData[] {
    return challenges.sort((a, b) => 
      ChallengeClassifier.calculatePriorityScore(b) - ChallengeClassifier.calculatePriorityScore(a)
    );
  }

  /**
   * 課題の相互関係分析
   */
  analyzeChallengeRelationships(challenges: ChallengeData[]): {
    clusters: { name: string; challenges: ChallengeData[] }[];
    dependencies: { from: string; to: string; strength: number }[];
  } {
    // 課題クラスタリング
    const clusters = this.clusterChallenges(challenges);
    
    // 依存関係の特定
    const dependencies = this.identifyDependencies(challenges);

    return { clusters, dependencies };
  }

  private clusterChallenges(challenges: ChallengeData[]): { name: string; challenges: ChallengeData[] }[] {
    const clusters: { name: string; challenges: ChallengeData[] }[] = [
      { name: '技術開発', challenges: [] },
      { name: '人材・組織', challenges: [] },
      { name: '市場・競争', challenges: [] },
      { name: '政策・規制', challenges: [] },
      { name: 'サプライチェーン', challenges: [] }
    ];

    challenges.forEach(challenge => {
      const description = challenge.description.toLowerCase();
      
      if (description.includes('技術') || description.includes('開発') || description.includes('研究')) {
        clusters[0].challenges.push(challenge);
      } else if (description.includes('人材') || description.includes('組織') || description.includes('スキル')) {
        clusters[1].challenges.push(challenge);
      } else if (description.includes('市場') || description.includes('競争') || description.includes('シェア')) {
        clusters[2].challenges.push(challenge);
      } else if (description.includes('政策') || description.includes('規制') || description.includes('法律')) {
        clusters[3].challenges.push(challenge);
      } else if (description.includes('サプライ') || description.includes('調達') || description.includes('供給')) {
        clusters[4].challenges.push(challenge);
      } else {
        // デフォルトは技術開発クラスタに
        clusters[0].challenges.push(challenge);
      }
    });

    return clusters.filter(cluster => cluster.challenges.length > 0);
  }

  private identifyDependencies(challenges: ChallengeData[]): { from: string; to: string; strength: number }[] {
    const dependencies: { from: string; to: string; strength: number }[] = [];

    // 簡易的な依存関係の特定
    challenges.forEach(challenge1 => {
      challenges.forEach(challenge2 => {
        if (challenge1.id !== challenge2.id) {
          const strength = this.calculateDependencyStrength(challenge1, challenge2);
          if (strength > 0.5) {
            dependencies.push({
              from: challenge1.id,
              to: challenge2.id,
              strength
            });
          }
        }
      });
    });

    return dependencies;
  }

  private calculateDependencyStrength(challenge1: ChallengeData, challenge2: ChallengeData): number {
    // ステークホルダーの重複度
    const stakeholderOverlap = challenge1.stakeholders.filter(s => 
      challenge2.stakeholders.includes(s)
    ).length;
    
    const maxStakeholders = Math.max(challenge1.stakeholders.length, challenge2.stakeholders.length);
    const stakeholderScore = maxStakeholders > 0 ? stakeholderOverlap / maxStakeholders : 0;

    // カテゴリの関連性
    const categoryScore = challenge1.category === challenge2.category ? 0.3 : 0;

    // 説明文の類似性（簡易版）
    const descriptionScore = this.calculateTextSimilarity(challenge1.description, challenge2.description);

    return (stakeholderScore * 0.5 + categoryScore * 0.3 + descriptionScore * 0.2);
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;
    
    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }
}