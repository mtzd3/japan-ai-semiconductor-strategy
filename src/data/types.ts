// AI半導体戦略分析のためのデータ型定義

/**
 * 市場シェアデータ
 */
export interface MarketShareData {
  company: string;           // 企業名
  marketShare: number;       // 市場シェア（%）
  year: number;             // 対象年
  region: string;           // 地域
  segment: string;          // 市場セグメント
}

/**
 * 市場メトリクス
 */
export interface MarketMetrics {
  marketSize: number;        // 市場規模（億円）
  growthRate: number;        // 成長率（%）
  year: number;             // 対象年
  source: string;           // データソース
  confidence: number;       // 信頼度（1-10）
}

/**
 * 競合他社分析データ
 */
export interface CompetitorAnalysis {
  companyName: string;       // 企業名
  country: string;          // 本社所在国
  annualRevenue: number;    // 年間売上（億円）
  rdInvestment: number;     // R&D投資額（億円）
  keyProducts: string[];    // 主要製品
  marketPosition: string;   // 市場ポジション
  strengths: string[];      // 強み
  weaknesses: string[];     // 弱み
}

/**
 * トレンドデータ
 */
export interface TrendData {
  trendName: string;        // トレンド名
  description: string;      // 説明
  impactLevel: number;      // 影響度（1-10）
  timeframe: 'short' | 'medium' | 'long';  // 時間軸
  affectedSegments: string[];  // 影響を受けるセグメント
  opportunities: string[];  // 機会
  threats: string[];        // 脅威
}

/**
 * 課題データ
 */
export interface ChallengeData {
  id: string;               // 課題ID
  title: string;            // 課題タイトル
  category: 'technological' | 'economic' | 'geopolitical';  // カテゴリ
  severity: number;         // 深刻度（1-10）
  urgency: number;          // 緊急度（1-10）
  description: string;      // 詳細説明
  currentStatus: string;    // 現状
  potentialImpact: string;  // 潜在的影響
  stakeholders: string[];   // 関係者
}

/**
 * 技術能力評価
 */
export interface TechnicalCapability {
  technology: string;       // 技術分野
  currentLevel: number;     // 現在のレベル（1-10）
  targetLevel: number;      // 目標レベル（1-10）
  gap: number;             // ギャップ
  keyPlayers: string[];    // 主要プレイヤー
  investmentRequired: number;  // 必要投資額（億円）
  timeToAchieve: number;   // 達成までの期間（年）
}

/**
 * 戦略推奨事項
 */
export interface StrategicRecommendation {
  id: string;              // 推奨事項ID
  title: string;           // タイトル
  priority: 'high' | 'medium' | 'low';  // 優先度
  category: string;        // カテゴリ
  description: string;     // 詳細説明
  expectedImpact: string;  // 期待される効果
  implementationCost: number;  // 実装コスト（億円）
  timeframe: string;       // 実装期間
  dependencies: string[];  // 依存関係
  risks: string[];         // リスク
  successMetrics: string[];  // 成功指標
}

/**
 * 実装計画
 */
export interface ImplementationPlan {
  phase: string;           // フェーズ名
  duration: number;        // 期間（月）
  budget: number;          // 予算（億円）
  milestones: Milestone[]; // マイルストーン
  resources: Resource[];   // 必要リソース
  risks: Risk[];           // リスク
}

/**
 * マイルストーン
 */
export interface Milestone {
  id: string;              // マイルストーンID
  title: string;           // タイトル
  targetDate: string;      // 目標日
  deliverables: string[];  // 成果物
  successCriteria: string[];  // 成功基準
}

/**
 * リソース
 */
export interface Resource {
  type: 'human' | 'financial' | 'infrastructure';  // リソースタイプ
  description: string;     // 説明
  quantity: number;        // 数量
  cost: number;           // コスト（億円）
  availability: string;    // 利用可能性
}

/**
 * リスク
 */
export interface Risk {
  id: string;              // リスクID
  description: string;     // 説明
  probability: number;     // 発生確率（1-10）
  impact: number;          // 影響度（1-10）
  mitigation: string;      // 軽減策
  contingency: string;     // 代替案
}

/**
 * 国際ベンチマーク
 */
export interface InternationalBenchmark {
  country: string;         // 国名
  strategy: string;        // 戦略名
  budget: number;          // 予算（億円）
  keyInitiatives: string[];  // 主要施策
  successFactors: string[];  // 成功要因
  lessons: string[];       // 教訓
  applicability: number;   // 日本への適用可能性（1-10）
}