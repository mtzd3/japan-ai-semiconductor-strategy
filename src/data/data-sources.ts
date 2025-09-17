// データソース管理システム

import { MarketMetrics, MarketShareData, CompetitorAnalysis, TrendData } from './types.js';

/**
 * データソース設定
 */
export interface DataSourceConfig {
  name: string;
  type: 'api' | 'file' | 'database' | 'manual';
  url?: string;
  apiKey?: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  reliability: number; // 1-10
  dataTypes: string[];
}

/**
 * データ収集結果
 */
export interface DataCollectionResult {
  source: string;
  timestamp: Date;
  success: boolean;
  dataCount: number;
  errors?: string[];
  data?: any[];
}

/**
 * データソース管理クラス
 */
export class DataSourceManager {
  private sources: Map<string, DataSourceConfig> = new Map();
  private collectionHistory: DataCollectionResult[] = [];

  constructor() {
    this.initializeDefaultSources();
  }

  /**
   * デフォルトデータソースの初期化
   */
  private initializeDefaultSources(): void {
    const defaultSources: DataSourceConfig[] = [
      {
        name: 'METI_Statistics',
        type: 'api',
        url: 'https://www.meti.go.jp/statistics/api',
        updateFrequency: 'quarterly',
        reliability: 9,
        dataTypes: ['market_metrics', 'industry_statistics']
      },
      {
        name: 'JEITA_Data',
        type: 'file',
        updateFrequency: 'monthly',
        reliability: 8,
        dataTypes: ['market_share', 'production_data']
      },
      {
        name: 'IDC_Japan',
        type: 'api',
        updateFrequency: 'quarterly',
        reliability: 9,
        dataTypes: ['market_forecast', 'competitive_analysis']
      },
      {
        name: 'Gartner_Reports',
        type: 'manual',
        updateFrequency: 'quarterly',
        reliability: 9,
        dataTypes: ['trend_analysis', 'technology_assessment']
      },
      {
        name: 'SEMI_Global',
        type: 'api',
        updateFrequency: 'monthly',
        reliability: 8,
        dataTypes: ['equipment_data', 'fab_capacity']
      }
    ];

    defaultSources.forEach(source => {
      this.sources.set(source.name, source);
    });
  }

  /**
   * データソースの追加
   */
  addDataSource(config: DataSourceConfig): void {
    this.validateDataSourceConfig(config);
    this.sources.set(config.name, config);
  }

  /**
   * データソースの取得
   */
  getDataSource(name: string): DataSourceConfig | undefined {
    return this.sources.get(name);
  }

  /**
   * 全データソースの取得
   */
  getAllDataSources(): DataSourceConfig[] {
    return Array.from(this.sources.values());
  }

  /**
   * データタイプ別ソースの取得
   */
  getSourcesByDataType(dataType: string): DataSourceConfig[] {
    return Array.from(this.sources.values())
      .filter(source => source.dataTypes.includes(dataType));
  }

  /**
   * 高信頼性ソースの取得
   */
  getHighReliabilitySources(minReliability: number = 8): DataSourceConfig[] {
    return Array.from(this.sources.values())
      .filter(source => source.reliability >= minReliability);
  }

  /**
   * データ収集の実行
   */
  async collectData(sourceName: string): Promise<DataCollectionResult> {
    const source = this.sources.get(sourceName);
    if (!source) {
      throw new Error(`データソース '${sourceName}' が見つかりません`);
    }

    const result: DataCollectionResult = {
      source: sourceName,
      timestamp: new Date(),
      success: false,
      dataCount: 0
    };

    try {
      switch (source.type) {
        case 'api':
          result.data = await this.collectFromAPI(source);
          break;
        case 'file':
          result.data = await this.collectFromFile(source);
          break;
        case 'database':
          result.data = await this.collectFromDatabase(source);
          break;
        case 'manual':
          result.data = await this.collectManualData(source);
          break;
      }

      result.success = true;
      result.dataCount = result.data?.length || 0;
    } catch (error) {
      result.success = false;
      result.errors = [error instanceof Error ? error.message : String(error)];
    }

    this.collectionHistory.push(result);
    return result;
  }

  /**
   * 全ソースからのデータ収集
   */
  async collectAllData(): Promise<DataCollectionResult[]> {
    const results: DataCollectionResult[] = [];
    
    for (const sourceName of this.sources.keys()) {
      try {
        const result = await this.collectData(sourceName);
        results.push(result);
      } catch (error) {
        results.push({
          source: sourceName,
          timestamp: new Date(),
          success: false,
          dataCount: 0,
          errors: [error instanceof Error ? error.message : String(error)]
        });
      }
    }

    return results;
  }

  private async collectFromAPI(source: DataSourceConfig): Promise<any[]> {
    // API収集のモックデータ
    console.log(`Collecting from API: ${source.name}`);
    return this.generateMockData(source.dataTypes[0]);
  }

  private async collectFromFile(source: DataSourceConfig): Promise<any[]> {
    // ファイル収集のモックデータ
    console.log(`Collecting from file: ${source.name}`);
    return this.generateMockData(source.dataTypes[0]);
  }

  private async collectFromDatabase(source: DataSourceConfig): Promise<any[]> {
    // データベース収集のモックデータ
    console.log(`Collecting from database: ${source.name}`);
    return this.generateMockData(source.dataTypes[0]);
  }

  private async collectManualData(source: DataSourceConfig): Promise<any[]> {
    // 手動データ収集のモックデータ
    console.log(`Manual data collection: ${source.name}`);
    return this.generateMockData(source.dataTypes[0]);
  }

  private generateMockData(dataType: string): any[] {
    switch (dataType) {
      case 'market_metrics':
        return this.generateMockMarketMetrics();
      case 'market_share':
        return this.generateMockMarketShare();
      case 'competitive_analysis':
        return this.generateMockCompetitorData();
      case 'trend_analysis':
        return this.generateMockTrendData();
      default:
        return [];
    }
  }

  private generateMockMarketMetrics(): MarketMetrics[] {
    return [
      {
        marketSize: 15000,
        growthRate: 25.5,
        year: 2023,
        source: 'IDC Japan',
        confidence: 8
      },
      {
        marketSize: 12000,
        growthRate: 22.3,
        year: 2022,
        source: 'IDC Japan',
        confidence: 9
      }
    ];
  }

  private generateMockMarketShare(): MarketShareData[] {
    return [
      {
        company: 'NVIDIA',
        marketShare: 45.2,
        year: 2023,
        region: 'Global',
        segment: 'AI Training Chips'
      },
      {
        company: 'AMD',
        marketShare: 15.8,
        year: 2023,
        region: 'Global',
        segment: 'AI Training Chips'
      }
    ];
  }

  private generateMockCompetitorData(): CompetitorAnalysis[] {
    return [
      {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: 6091000, // 億円
        rdInvestment: 731000,
        keyProducts: ['H100', 'A100', 'RTX 4090'],
        marketPosition: 'Leader',
        strengths: ['AI ecosystem', 'CUDA platform', 'Performance'],
        weaknesses: ['High cost', 'Power consumption']
      }
    ];
  }

  private generateMockTrendData(): TrendData[] {
    return [
      {
        trendName: 'エッジAIの普及',
        description: 'デバイス側でのAI処理需要の急増',
        impactLevel: 9,
        timeframe: 'medium',
        affectedSegments: ['Mobile AI', 'IoT', 'Automotive'],
        opportunities: ['新市場創出', '省電力化'],
        threats: ['技術複雑化', '競争激化']
      }
    ];
  }

  private validateDataSourceConfig(config: DataSourceConfig): void {
    if (!config.name || config.name.trim() === '') {
      throw new Error('データソース名は必須です');
    }
    if (config.reliability < 1 || config.reliability > 10) {
      throw new Error('信頼性は1-10の範囲内である必要があります');
    }
    if (!config.dataTypes || config.dataTypes.length === 0) {
      throw new Error('データタイプは少なくとも1つ指定する必要があります');
    }
  }

  /**
   * 収集履歴の取得
   */
  getCollectionHistory(): DataCollectionResult[] {
    return [...this.collectionHistory];
  }

  /**
   * 成功率の計算
   */
  getSuccessRate(sourceName?: string): number {
    let relevantResults = this.collectionHistory;
    
    if (sourceName) {
      relevantResults = this.collectionHistory.filter(r => r.source === sourceName);
    }

    if (relevantResults.length === 0) return 0;

    const successCount = relevantResults.filter(r => r.success).length;
    return (successCount / relevantResults.length) * 100;
  }
}