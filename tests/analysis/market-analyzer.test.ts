// 市場分析エンジンのテスト

import { describe, it, expect, beforeEach } from 'vitest';
import { MarketAnalyzer } from '../../src/analysis/market-analyzer.js';
import { 
  MarketMetrics, 
  MarketShareData, 
  CompetitorAnalysis, 
  TrendData 
} from '../../src/data/types.js';

describe('MarketAnalyzer', () => {
  let marketAnalyzer: MarketAnalyzer;
  let sampleMarketMetrics: MarketMetrics[];
  let sampleMarketShares: MarketShareData[];
  let sampleCompetitors: CompetitorAnalysis[];
  let sampleTrends: TrendData[];

  beforeEach(() => {
    marketAnalyzer = new MarketAnalyzer();
    
    sampleMarketMetrics = [
      {
        marketSize: 10000,
        growthRate: 25.0,
        year: 2022,
        source: 'Test Source',
        confidence: 8
      },
      {
        marketSize: 15000,
        growthRate: 30.0,
        year: 2023,
        source: 'Test Source',
        confidence: 9
      }
    ];

    sampleMarketShares = [
      {
        company: 'NVIDIA',
        marketShare: 45.0,
        year: 2023,
        region: 'Global',
        segment: 'AI Training'
      },
      {
        company: 'ソニー',
        marketShare: 5.0,
        year: 2023,
        region: 'Global',
        segment: 'Edge AI'
      }
    ];

    sampleCompetitors = [
      {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: 600000,
        rdInvestment: 70000,
        keyProducts: ['H100', 'A100'],
        marketPosition: 'Leader',
        strengths: ['CUDA', 'Performance'],
        weaknesses: ['Price', 'Power']
      },
      {
        companyName: 'ソニー',
        country: '日本',
        annualRevenue: 120000,
        rdInvestment: 12000,
        keyProducts: ['Image Sensor'],
        marketPosition: 'Niche',
        strengths: ['Sensor Tech'],
        weaknesses: ['Scale']
      }
    ];

    sampleTrends = [
      {
        trendName: 'Edge AI Growth',
        description: 'Growing demand for edge AI processing',
        impactLevel: 8,
        timeframe: 'medium',
        affectedSegments: ['Edge AI', 'Mobile'],
        opportunities: ['New markets'],
        threats: ['Competition']
      }
    ];
  });

  describe('analyzeMarket', () => {
    it('should analyze market successfully with valid data', async () => {
      const result = await marketAnalyzer.analyzeMarket(
        sampleMarketMetrics,
        sampleMarketShares,
        sampleCompetitors,
        sampleTrends
      );

      expect(result).toBeDefined();
      expect(result.currentState).toBeDefined();
      expect(result.competitivePosition).toBeDefined();
      expect(result.marketForecast).toBeDefined();
      expect(result.segmentAnalysis).toBeDefined();
      expect(result.keyInsights).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('should calculate current state correctly', async () => {
      const result = await marketAnalyzer.analyzeMarket(
        sampleMarketMetrics,
        sampleMarketShares,
        sampleCompetitors,
        sampleTrends
      );

      expect(result.currentState.marketSize).toBe(15000);
      expect(result.currentState.growthRate).toBe(27.5); // Average of 25 and 30
      expect(result.currentState.competitionLevel).toBe('high'); // 20% < 27.5% <= 30%
      expect(result.currentState.maturityStage).toBe('emerging'); // >25% growth
    });

    it('should analyze competitive position', async () => {
      const result = await marketAnalyzer.analyzeMarket(
        sampleMarketMetrics,
        sampleMarketShares,
        sampleCompetitors,
        sampleTrends
      );

      expect(result.competitivePosition.japanMarketShare).toBe(5.0);
      expect(result.competitivePosition.keyStrengths).toContain('Sensor Tech');
      expect(result.competitivePosition.criticalWeaknesses).toContain('Scale');
    });

    it('should generate market forecast', async () => {
      const result = await marketAnalyzer.analyzeMarket(
        sampleMarketMetrics,
        sampleMarketShares,
        sampleCompetitors,
        sampleTrends
      );

      expect(result.marketForecast.projectedSize2025).toBeGreaterThan(0);
      expect(result.marketForecast.projectedSize2030).toBeGreaterThan(0);
      expect(result.marketForecast.expectedCAGR).toBeGreaterThan(0);
      expect(result.marketForecast.confidenceLevel).toBeGreaterThan(0);
    });

    it('should analyze segments', async () => {
      const result = await marketAnalyzer.analyzeMarket(
        sampleMarketMetrics,
        sampleMarketShares,
        sampleCompetitors,
        sampleTrends
      );

      expect(result.segmentAnalysis).toHaveLength(2);
      expect(result.segmentAnalysis[0].segment).toBe('AI Training');
      expect(result.segmentAnalysis[1].segment).toBe('Edge AI');
    });

    it('should generate insights and recommendations', async () => {
      const result = await marketAnalyzer.analyzeMarket(
        sampleMarketMetrics,
        sampleMarketShares,
        sampleCompetitors,
        sampleTrends
      );

      expect(result.keyInsights).toBeInstanceOf(Array);
      expect(result.keyInsights.length).toBeGreaterThan(0);
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle empty market metrics', async () => {
      await expect(
        marketAnalyzer.analyzeMarket([], sampleMarketShares, sampleCompetitors, sampleTrends)
      ).rejects.toThrow('市場メトリクスデータが不足しています');
    });

    it('should handle invalid data gracefully', async () => {
      const invalidMetrics = [
        {
          marketSize: -1000, // Invalid negative value
          growthRate: 25.0,
          year: 2023,
          source: 'Test',
          confidence: 8
        }
      ];

      // Should throw validation error for invalid data
      await expect(
        marketAnalyzer.analyzeMarket(
          invalidMetrics,
          sampleMarketShares,
          sampleCompetitors,
          sampleTrends
        )
      ).rejects.toThrow('市場規模は0以上である必要があります');
    });
  });
});