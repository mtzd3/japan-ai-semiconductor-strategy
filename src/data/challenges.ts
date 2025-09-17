// 課題評価データ構造とユーティリティ

import { ChallengeData, TechnicalCapability } from './types.js';

/**
 * 課題カテゴリ分類器
 */
export class ChallengeClassifier {
  /**
   * 課題を技術的、経済的、地政学的カテゴリに分類
   */
  static categorizeChallenge(challenge: ChallengeData): 'technological' | 'economic' | 'geopolitical' {
    const technologicalKeywords = [
      '技術', 'R&D', '研究開発', 'イノベーション', '特許', 'アーキテクチャ',
      'プロセス', '製造', '設計', 'AI', '半導体', 'チップ', 'ソフトウェア'
    ];
    
    const economicKeywords = [
      '投資', '資金', '予算', 'コスト', '収益', '市場', '競争', '価格',
      '売上', '利益', '資本', '融資', '補助金', '税制', '経済'
    ];
    
    const geopoliticalKeywords = [
      '貿易', '制裁', '輸出規制', '国際', '政策', '政府', '外交', '安全保障',
      '同盟', '協定', '規制', '法律', '標準', '認証', '地政学'
    ];

    const description = challenge.description.toLowerCase();
    const title = challenge.title.toLowerCase();
    const text = `${title} ${description}`;

    let techScore = 0;
    let econScore = 0;
    let geoScore = 0;

    technologicalKeywords.forEach(keyword => {
      if (text.includes(keyword)) techScore++;
    });

    economicKeywords.forEach(keyword => {
      if (text.includes(keyword)) econScore++;
    });

    geopoliticalKeywords.forEach(keyword => {
      if (text.includes(keyword)) geoScore++;
    });

    if (techScore >= econScore && techScore >= geoScore) {
      return 'technological';
    } else if (econScore >= geoScore) {
      return 'economic';
    } else {
      return 'geopolitical';
    }
  }

  /**
   * 課題の優先度スコア計算
   */
  static calculatePriorityScore(challenge: ChallengeData): number {
    // 深刻度と緊急度の重み付け平均
    const severityWeight = 0.6;
    const urgencyWeight = 0.4;
    return (challenge.severity * severityWeight + challenge.urgency * urgencyWeight);
  }
}

/**
 * 課題評価管理システム
 */
export class ChallengeAssessmentManager {
  private challenges: ChallengeData[] = [];

  /**
   * 課題を追加
   */
  addChallenge(challenge: ChallengeData): void {
    this.validateChallenge(challenge);
    this.challenges.push(challenge);
  }

  /**
   * 課題データの検証
   */
  private validateChallenge(challenge: ChallengeData): void {
    if (!challenge.id || challenge.id.trim() === '') {
      throw new Error('課題IDは必須です');
    }

    if (!challenge.title || challenge.title.trim() === '') {
      throw new Error('課題タイトルは必須です');
    }

    if (challenge.severity < 1 || challenge.severity > 10) {
      throw new Error('深刻度は1-10の範囲内である必要があります');
    }

    if (challenge.urgency < 1 || challenge.urgency > 10) {
      throw new Error('緊急度は1-10の範囲内である必要があります');
    }

    const validCategories = ['technological', 'economic', 'geopolitical'];
    if (!validCategories.includes(challenge.category)) {
      throw new Error('カテゴリは technological, economic, geopolitical のいずれかである必要があります');
    }
  }

  /**
   * カテゴリ別課題の取得
   */
  getChallengesByCategory(category: 'technological' | 'economic' | 'geopolitical'): ChallengeData[] {
    return this.challenges.filter(challenge => challenge.category === category);
  }

  /**
   * 優先度順に課題を取得
   */
  getChallengesByPriority(): ChallengeData[] {
    return [...this.challenges].sort((a, b) => {
      const scoreA = ChallengeClassifier.calculatePriorityScore(a);
      const scoreB = ChallengeClassifier.calculatePriorityScore(b);
      return scoreB - scoreA; // 降順
    });
  }

  /**
   * 高優先度課題の取得（スコア7以上）
   */
  getHighPriorityChallenges(): ChallengeData[] {
    return this.challenges.filter(challenge => 
      ChallengeClassifier.calculatePriorityScore(challenge) >= 7
    );
  }

  /**
   * ステークホルダー別課題の取得
   */
  getChallengesByStakeholder(stakeholder: string): ChallengeData[] {
    return this.challenges.filter(challenge => 
      challenge.stakeholders.includes(stakeholder)
    );
  }

  /**
   * 課題の完全性評価
   */
  assessCompletenessScore(): number {
    if (this.challenges.length === 0) return 0;

    let totalScore = 0;
    this.challenges.forEach(challenge => {
      let score = 0;
      
      // 必須フィールドの確認
      if (challenge.description && challenge.description.length > 50) score += 2;
      if (challenge.currentStatus && challenge.currentStatus.length > 20) score += 2;
      if (challenge.potentialImpact && challenge.potentialImpact.length > 20) score += 2;
      if (challenge.stakeholders && challenge.stakeholders.length > 0) score += 2;
      
      // 詳細度の確認
      if (challenge.severity > 0 && challenge.urgency > 0) score += 2;
      
      totalScore += score;
    });

    const maxPossibleScore = this.challenges.length * 10;
    return (totalScore / maxPossibleScore) * 100;
  }
}

/**
 * サプライチェーン依存性評価
 */
export class SupplyChainDependencyAnalyzer {
  /**
   * サプライチェーンリスクレベルの評価
   */
  static assessSupplyChainRisk(
    dependencyLevel: number,      // 依存度 (1-10)
    supplierConcentration: number, // サプライヤー集中度 (1-10)
    geopoliticalRisk: number      // 地政学的リスク (1-10)
  ): { riskLevel: number, riskCategory: string, recommendations: string[] } {
    
    const riskLevel = (dependencyLevel * 0.4 + supplierConcentration * 0.3 + geopoliticalRisk * 0.3);
    
    let riskCategory: string;
    let recommendations: string[] = [];

    if (riskLevel >= 8) {
      riskCategory = '極めて高い';
      recommendations = [
        'サプライヤーの多様化を緊急に実施',
        '国内代替サプライヤーの開発',
        '戦略的在庫の確保',
        '政府レベルでの外交的対応'
      ];
    } else if (riskLevel >= 6) {
      riskCategory = '高い';
      recommendations = [
        'サプライヤーの分散化',
        '代替調達先の確保',
        '在庫管理の最適化',
        'リスク監視体制の強化'
      ];
    } else if (riskLevel >= 4) {
      riskCategory = '中程度';
      recommendations = [
        '定期的なサプライヤー評価',
        'バックアップ計画の策定',
        '市場動向の継続監視'
      ];
    } else {
      riskCategory = '低い';
      recommendations = [
        '現状維持',
        '定期的な見直し'
      ];
    }

    return { riskLevel, riskCategory, recommendations };
  }
}

/**
 * 人材ギャップ定量化
 */
export class TalentGapQuantifier {
  /**
   * 人材ギャップの定量化
   */
  static quantifyTalentGap(
    currentTalent: number,        // 現在の人材数
    requiredTalent: number,       // 必要な人材数
    skillLevel: 'entry' | 'mid' | 'senior' | 'expert', // スキルレベル
    timeframe: number             // 達成期間（年）
  ): {
    gapSize: number,
    gapPercentage: number,
    annualRequirement: number,
    trainingCost: number,
    recommendations: string[]
  } {
    
    const gapSize = Math.max(0, requiredTalent - currentTalent);
    const gapPercentage = requiredTalent > 0 ? (gapSize / requiredTalent) * 100 : 0;
    const annualRequirement = timeframe > 0 ? gapSize / timeframe : gapSize;

    // スキルレベル別の研修コスト（万円/人）
    const trainingCosts = {
      entry: 50,
      mid: 100,
      senior: 200,
      expert: 500
    };

    const trainingCost = gapSize * trainingCosts[skillLevel];

    let recommendations: string[] = [];

    if (gapPercentage >= 50) {
      recommendations = [
        '大学との連携強化による新卒採用拡大',
        '海外人材の積極的な採用',
        '既存人材のスキルアップ研修',
        '産学連携による専門教育プログラムの開発'
      ];
    } else if (gapPercentage >= 25) {
      recommendations = [
        '中途採用の強化',
        '社内研修プログラムの充実',
        '他業界からの人材転換支援'
      ];
    } else if (gapPercentage >= 10) {
      recommendations = [
        '既存人材のスキルアップ',
        '選択的な採用活動'
      ];
    } else {
      recommendations = [
        '現状維持',
        '継続的なスキル向上'
      ];
    }

    return {
      gapSize,
      gapPercentage,
      annualRequirement,
      trainingCost,
      recommendations
    };
  }
}