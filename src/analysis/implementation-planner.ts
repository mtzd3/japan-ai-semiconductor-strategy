// 実装計画システム

import { 
  ImplementationPlan, 
  Milestone, 
  Resource, 
  Risk, 
  StrategicRecommendation 
} from '../data/types.js';

/**
 * 実装計画結果
 */
export interface ImplementationPlanResult {
  overview: {
    totalPhases: number;
    totalDuration: number; // 月
    totalBudget: number; // 億円
    totalMilestones: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  phases: ImplementationPhase[];
  resourceAllocation: {
    byType: Record<string, number>;
    byPhase: Record<string, number>;
    criticalResources: string[];
  };
  riskAssessment: {
    highRiskItems: Risk[];
    mitigationStrategies: string[];
    contingencyPlans: string[];
  };
  timeline: {
    criticalPath: string[];
    dependencies: { from: string; to: string; type: string }[];
    bufferTime: number; // 月
  };
}

/**
 * 実装フェーズ
 */
export interface ImplementationPhase {
  id: string;
  name: string;
  duration: number; // 月
  budget: number; // 億円
  startMonth: number;
  endMonth: number;
  objectives: string[];
  deliverables: string[];
  milestones: Milestone[];
  resources: Resource[];
  risks: Risk[];
  dependencies: string[];
  successCriteria: string[];
}

/**
 * 実装計画エンジン
 */
export class ImplementationPlanner {
  private phases: ImplementationPhase[] = [];
  private globalRisks: Risk[] = [];

  /**
   * 戦略推奨事項から実装計画を生成
   */
  generateImplementationPlan(
    recommendations: StrategicRecommendation[]
  ): ImplementationPlanResult {
    
    // フェーズの生成
    this.phases = this.createImplementationPhases(recommendations);
    
    // グローバルリスクの評価
    this.globalRisks = this.assessGlobalRisks();
    
    // 結果の構築
    return {
      overview: this.generateOverview(),
      phases: this.phases,
      resourceAllocation: this.analyzeResourceAllocation(),
      riskAssessment: this.assessRisks(),
      timeline: this.generateTimeline()
    };
  }

  /**
   * 実装フェーズの作成
   */
  private createImplementationPhases(recommendations: StrategicRecommendation[]): ImplementationPhase[] {
    const phases: ImplementationPhase[] = [];

    // フェーズ1: 緊急対応期 (0-24ヶ月)
    phases.push({
      id: 'phase-1',
      name: '緊急対応期',
      duration: 24,
      budget: 15000, // 1.5兆円
      startMonth: 0,
      endMonth: 24,
      objectives: [
        '重要課題への緊急対策実施',
        'R&D投資基盤の構築',
        '人材確保プログラムの開始',
        '国際パートナーシップの強化'
      ],
      deliverables: [
        'AI半導体戦略会議の設置',
        'R&D投資年間1,000億円増額',
        '専門人材500人確保',
        '主要国との技術協力協定締結'
      ],
      milestones: [
        {
          id: 'M1-1',
          title: '戦略会議設置',
          targetDate: '2024-03-31',
          deliverables: ['戦略会議設置', '初期予算確保'],
          successCriteria: ['会議体制確立', '予算承認']
        },
        {
          id: 'M1-2',
          title: 'R&D投資拡大',
          targetDate: '2024-06-30',
          deliverables: ['投資計画策定', '予算配分決定'],
          successCriteria: ['年間1,000億円増額確保']
        },
        {
          id: 'M1-3',
          title: '人材確保開始',
          targetDate: '2024-12-31',
          deliverables: ['採用プログラム開始', '研修制度構築'],
          successCriteria: ['専門人材200人確保']
        }
      ],
      resources: [
        {
          type: 'financial',
          description: 'R&D投資資金',
          quantity: 2000,
          cost: 2000,
          availability: '政府予算・民間投資'
        },
        {
          type: 'human',
          description: 'プロジェクト管理人材',
          quantity: 50,
          cost: 50,
          availability: '政府・企業から派遣'
        }
      ],
      risks: [
        {
          id: 'R1-1',
          description: '予算確保の遅れ',
          probability: 6,
          impact: 8,
          mitigation: '複数予算源の確保',
          contingency: '段階的実施への変更'
        }
      ],
      dependencies: [],
      successCriteria: [
        '市場シェア7%→10%達成',
        '専門人材500人確保',
        '主要技術分野での研究開始'
      ]
    });

    // フェーズ2: 基盤強化期 (24-60ヶ月)
    phases.push({
      id: 'phase-2',
      name: '基盤強化期',
      duration: 36,
      budget: 35000, // 3.5兆円
      startMonth: 24,
      endMonth: 60,
      objectives: [
        'AI半導体設計センターの設立',
        '産学官連携プラットフォーム構築',
        'サプライチェーン多様化',
        '国際標準化活動強化'
      ],
      deliverables: [
        '国立AI半導体研究センター設立',
        '産学官連携コンソーシアム設立',
        '代替サプライヤー確保',
        '国際標準化提案3件'
      ],
      milestones: [
        {
          id: 'M2-1',
          title: '研究センター設立',
          targetDate: '2026-03-31',
          deliverables: ['センター設立', '研究設備導入'],
          successCriteria: ['世界トップレベル研究環境構築']
        },
        {
          id: 'M2-2',
          title: 'エコシステム構築',
          targetDate: '2026-12-31',
          deliverables: ['コンソーシアム設立', 'プラットフォーム稼働'],
          successCriteria: ['参加企業100社以上']
        }
      ],
      resources: [
        {
          type: 'infrastructure',
          description: '研究開発施設',
          quantity: 5,
          cost: 5000,
          availability: '新規建設・既存施設改修'
        },
        {
          type: 'human',
          description: '研究開発人材',
          quantity: 1000,
          cost: 1000,
          availability: '国内外からの招聘'
        }
      ],
      risks: [
        {
          id: 'R2-1',
          description: '人材確保の困難',
          probability: 7,
          impact: 9,
          mitigation: '国際的な人材招聘',
          contingency: '段階的な人材育成'
        }
      ],
      dependencies: ['phase-1'],
      successCriteria: [
        '市場シェア10%→15%達成',
        '専門人材1,500人確保',
        '主要技術での国際競争力獲得'
      ]
    });

    // フェーズ3: 競争力確立期 (60-120ヶ月)
    phases.push({
      id: 'phase-3',
      name: '競争力確立期',
      duration: 60,
      budget: 50000, // 5兆円
      startMonth: 60,
      endMonth: 120,
      objectives: [
        '次世代技術の商用化',
        'エコシステムの国際展開',
        '技術的自律性の確保',
        '新市場開拓'
      ],
      deliverables: [
        '次世代AIチップの量産開始',
        '国際エコシステム構築',
        '技術的自律性確保',
        '新市場シェア獲得'
      ],
      milestones: [
        {
          id: 'M3-1',
          title: '次世代技術商用化',
          targetDate: '2028-12-31',
          deliverables: ['商用チップ量産', '市場投入'],
          successCriteria: ['世界シェア5%獲得']
        },
        {
          id: 'M3-2',
          title: '技術的自律性確保',
          targetDate: '2030-12-31',
          deliverables: ['独自技術確立', '供給網構築'],
          successCriteria: ['重要技術の国産化率80%']
        }
      ],
      resources: [
        {
          type: 'financial',
          description: '商用化投資',
          quantity: 30000,
          cost: 30000,
          availability: '民間投資主導'
        },
        {
          type: 'infrastructure',
          description: '製造設備',
          quantity: 10,
          cost: 20000,
          availability: '民間企業投資'
        }
      ],
      risks: [
        {
          id: 'R3-1',
          description: '技術競争の激化',
          probability: 8,
          impact: 9,
          mitigation: '差別化技術の開発',
          contingency: 'ニッチ市場への特化'
        }
      ],
      dependencies: ['phase-2'],
      successCriteria: [
        '市場シェア15%→25%達成',
        '専門人材3,000人確保',
        '技術的自律性確保'
      ]
    });

    return phases;
  }

  /**
   * 概要の生成
   */
  private generateOverview(): ImplementationPlanResult['overview'] {
    const totalDuration = Math.max(...this.phases.map(p => p.endMonth));
    const totalBudget = this.phases.reduce((sum, p) => sum + p.budget, 0);
    const totalMilestones = this.phases.reduce((sum, p) => sum + p.milestones.length, 0);
    
    // リスクレベルの評価
    const avgRiskScore = this.globalRisks.reduce((sum, r) => sum + (r.probability * r.impact), 0) / this.globalRisks.length;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    
    if (avgRiskScore >= 70) riskLevel = 'critical';
    else if (avgRiskScore >= 50) riskLevel = 'high';
    else if (avgRiskScore >= 30) riskLevel = 'medium';
    else riskLevel = 'low';

    return {
      totalPhases: this.phases.length,
      totalDuration,
      totalBudget,
      totalMilestones,
      riskLevel
    };
  }

  /**
   * リソース配分分析
   */
  private analyzeResourceAllocation(): ImplementationPlanResult['resourceAllocation'] {
    const byType: Record<string, number> = {};
    const byPhase: Record<string, number> = {};
    const criticalResources: string[] = [];

    this.phases.forEach(phase => {
      byPhase[phase.name] = phase.budget;
      
      phase.resources.forEach(resource => {
        byType[resource.type] = (byType[resource.type] || 0) + resource.cost;
        
        // 重要リソースの特定
        if (resource.cost > 1000 || resource.availability.includes('困難')) {
          criticalResources.push(`${resource.description} (${phase.name})`);
        }
      });
    });

    return {
      byType,
      byPhase,
      criticalResources: [...new Set(criticalResources)]
    };
  }

  /**
   * リスク評価
   */
  private assessRisks(): ImplementationPlanResult['riskAssessment'] {
    const allRisks = [
      ...this.globalRisks,
      ...this.phases.flatMap(p => p.risks)
    ];

    const highRiskItems = allRisks.filter(r => r.probability * r.impact >= 50);
    
    const mitigationStrategies = [
      '段階的実施によるリスク分散',
      '複数の代替案準備',
      '国際協力による技術・資金確保',
      '継続的な進捗監視と早期警告システム'
    ];

    const contingencyPlans = [
      '予算不足時の優先順位付け実施',
      '人材不足時の海外人材活用',
      '技術開発遅延時のライセンス取得',
      '市場変化時の戦略見直し'
    ];

    return {
      highRiskItems,
      mitigationStrategies,
      contingencyPlans
    };
  }

  /**
   * タイムライン生成
   */
  private generateTimeline(): ImplementationPlanResult['timeline'] {
    const criticalPath = [
      '戦略会議設置',
      'R&D投資拡大',
      '研究センター設立',
      'エコシステム構築',
      '次世代技術商用化',
      '技術的自律性確保'
    ];

    const dependencies = [
      { from: 'phase-1', to: 'phase-2', type: 'finish-to-start' },
      { from: 'phase-2', to: 'phase-3', type: 'finish-to-start' },
      { from: 'R&D投資拡大', to: '研究センター設立', type: 'finish-to-start' },
      { from: '研究センター設立', to: '次世代技術商用化', type: 'finish-to-start' }
    ];

    const bufferTime = 12; // 1年のバッファ

    return {
      criticalPath,
      dependencies,
      bufferTime
    };
  }

  /**
   * グローバルリスクの評価
   */
  private assessGlobalRisks(): Risk[] {
    return [
      {
        id: 'GR-1',
        description: '国際情勢の悪化による技術協力の困難',
        probability: 7,
        impact: 9,
        mitigation: '複数国との協力関係構築',
        contingency: '国内技術開発への集中'
      },
      {
        id: 'GR-2',
        description: '技術革新速度の予想以上の加速',
        probability: 8,
        impact: 8,
        mitigation: '柔軟な技術戦略の採用',
        contingency: '新技術への迅速な方向転換'
      },
      {
        id: 'GR-3',
        description: '民間投資の期待値未達',
        probability: 6,
        impact: 8,
        mitigation: '政府投資の拡大',
        contingency: '実施規模の縮小'
      }
    ];
  }

  /**
   * 実装可能性評価
   */
  evaluateFeasibility(plan: ImplementationPlanResult): {
    overallScore: number;
    feasibilityByPhase: Record<string, number>;
    criticalFactors: string[];
    recommendations: string[];
  } {
    const feasibilityByPhase: Record<string, number> = {};
    let totalScore = 0;

    this.phases.forEach(phase => {
      let phaseScore = 100;
      
      // 予算実現可能性
      if (phase.budget > 20000) phaseScore -= 20;
      else if (phase.budget > 10000) phaseScore -= 10;
      
      // 人材確保可能性
      const humanResources = phase.resources.filter(r => r.type === 'human');
      const totalHumanNeeds = humanResources.reduce((sum, r) => sum + r.quantity, 0);
      if (totalHumanNeeds > 1000) phaseScore -= 15;
      else if (totalHumanNeeds > 500) phaseScore -= 10;
      
      // リスクレベル
      const avgRisk = phase.risks.reduce((sum, r) => sum + (r.probability * r.impact), 0) / phase.risks.length;
      if (avgRisk > 60) phaseScore -= 20;
      else if (avgRisk > 40) phaseScore -= 10;
      
      feasibilityByPhase[phase.name] = Math.max(0, phaseScore);
      totalScore += phaseScore;
    });

    const overallScore = totalScore / this.phases.length;

    const criticalFactors = [
      '政府の長期的コミットメント',
      '民間企業の積極的参加',
      '国際的な技術協力',
      '専門人材の確保'
    ];

    const recommendations = [];
    if (overallScore < 70) {
      recommendations.push('実施規模の段階的縮小を検討');
      recommendations.push('リスク軽減策の強化');
    }
    if (overallScore < 50) {
      recommendations.push('戦略の根本的見直しが必要');
    }

    return {
      overallScore,
      feasibilityByPhase,
      criticalFactors,
      recommendations
    };
  }
}