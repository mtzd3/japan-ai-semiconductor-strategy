// データ検証システムのテスト

import { describe, it, expect } from 'vitest';
import {
  validateMarketShareData,
  validateMarketMetrics,
  validateCompetitorAnalysis,
  validateTrendData,
  validateChallengeData,
  validateStrategicRecommendation,
  DataIntegrityChecker,
  DataQualityScorer
} from '../../src/data/validation.js';
import {
  MarketShareData,
  MarketMetrics,
  CompetitorAnalysis,
  TrendData,
  ChallengeData,
  StrategicRecommendation
} from '../../src/data/types.js';

describe('Data Validation', () => {
  describe('validateMarketShareData', () => {
    it('should validate correct market share data', () => {
      const validData: MarketShareData = {
        company: 'NVIDIA',
        marketShare: 45.2,
        year: 2023,
        region: 'Global',
        segment: 'AI Training'
      };

      expect(() => validateMarketShareData(validData)).not.toThrow();
    });

    it('should reject empty company name', () => {
      const invalidData: MarketShareData = {
        company: '',
        marketShare: 45.2,
        year: 2023,
        region: 'Global',
        segment: 'AI Training'
      };

      expect(() => validateMarketShareData(invalidData)).toThrow('企業名は必須です');
    });

    it('should reject invalid market share range', () => {
      const invalidData: MarketShareData = {
        company: 'NVIDIA',
        marketShare: 150, // Invalid: > 100
        year: 2023,
        region: 'Global',
        segment: 'AI Training'
      };

      expect(() => validateMarketShareData(invalidData)).toThrow('市場シェアは0-100の範囲内である必要があります');
    });

    it('should reject invalid year', () => {
      const invalidData: MarketShareData = {
        company: 'NVIDIA',
        marketShare: 45.2,
        year: 1999, // Invalid: < 2000
        region: 'Global',
        segment: 'AI Training'
      };

      expect(() => validateMarketShareData(invalidData)).toThrow('年は2000年から現在+5年の範囲内である必要があります');
    });
  });

  describe('validateMarketMetrics', () => {
    it('should validate correct market metrics', () => {
      const validData: MarketMetrics = {
        marketSize: 15000,
        growthRate: 25.5,
        year: 2023,
        source: 'IDC Japan',
        confidence: 8
      };

      expect(() => validateMarketMetrics(validData)).not.toThrow();
    });

    it('should reject negative market size', () => {
      const invalidData: MarketMetrics = {
        marketSize: -1000,
        growthRate: 25.5,
        year: 2023,
        source: 'IDC Japan',
        confidence: 8
      };

      expect(() => validateMarketMetrics(invalidData)).toThrow('市場規模は正の値である必要があります');
    });

    it('should reject invalid growth rate', () => {
      const invalidData: MarketMetrics = {
        marketSize: 15000,
        growthRate: 1500, // Invalid: > 1000
        year: 2023,
        source: 'IDC Japan',
        confidence: 8
      };

      expect(() => validateMarketMetrics(invalidData)).toThrow('成長率は-100%から1000%の範囲内である必要があります');
    });

    it('should reject empty source', () => {
      const invalidData: MarketMetrics = {
        marketSize: 15000,
        growthRate: 25.5,
        year: 2023,
        source: '',
        confidence: 8
      };

      expect(() => validateMarketMetrics(invalidData)).toThrow('データソースは必須です');
    });
  });

  describe('validateCompetitorAnalysis', () => {
    it('should validate correct competitor data', () => {
      const validData: CompetitorAnalysis = {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: 600000,
        rdInvestment: 70000,
        keyProducts: ['H100', 'A100'],
        marketPosition: 'Leader',
        strengths: ['CUDA', 'Performance'],
        weaknesses: ['Price', 'Power']
      };

      expect(() => validateCompetitorAnalysis(validData)).not.toThrow();
    });

    it('should reject negative revenue', () => {
      const invalidData: CompetitorAnalysis = {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: -100000,
        rdInvestment: 70000,
        keyProducts: ['H100', 'A100'],
        marketPosition: 'Leader',
        strengths: ['CUDA', 'Performance'],
        weaknesses: ['Price', 'Power']
      };

      expect(() => validateCompetitorAnalysis(invalidData)).toThrow('年間売上は非負の値である必要があります');
    });

    it('should reject empty key products', () => {
      const invalidData: CompetitorAnalysis = {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: 600000,
        rdInvestment: 70000,
        keyProducts: [],
        marketPosition: 'Leader',
        strengths: ['CUDA', 'Performance'],
        weaknesses: ['Price', 'Power']
      };

      expect(() => validateCompetitorAnalysis(invalidData)).toThrow('主要製品は少なくとも1つ指定する必要があります');
    });
  });

  describe('validateTrendData', () => {
    it('should validate correct trend data', () => {
      const validData: TrendData = {
        trendName: 'Edge AI Growth',
        description: 'Growing demand for edge AI',
        impactLevel: 8,
        timeframe: 'medium',
        affectedSegments: ['Edge AI', 'Mobile'],
        opportunities: ['New markets'],
        threats: ['Competition']
      };

      expect(() => validateTrendData(validData)).not.toThrow();
    });

    it('should reject invalid impact level', () => {
      const invalidData: TrendData = {
        trendName: 'Edge AI Growth',
        description: 'Growing demand for edge AI',
        impactLevel: 15, // Invalid: > 10
        timeframe: 'medium',
        affectedSegments: ['Edge AI', 'Mobile'],
        opportunities: ['New markets'],
        threats: ['Competition']
      };

      expect(() => validateTrendData(invalidData)).toThrow('影響度は1-10の範囲内である必要があります');
    });

    it('should reject invalid timeframe', () => {
      const invalidData: TrendData = {
        trendName: 'Edge AI Growth',
        description: 'Growing demand for edge AI',
        impactLevel: 8,
        timeframe: 'invalid' as any,
        affectedSegments: ['Edge AI', 'Mobile'],
        opportunities: ['New markets'],
        threats: ['Competition']
      };

      expect(() => validateTrendData(invalidData)).toThrow('時間軸はshort、medium、longのいずれかである必要があります');
    });
  });

  describe('validateChallengeData', () => {
    it('should validate correct challenge data', () => {
      const validData: ChallengeData = {
        id: 'TECH-001',
        title: 'Technology Gap',
        category: 'technological',
        severity: 9,
        urgency: 8,
        description: 'Significant technology gap',
        currentStatus: 'Behind by 5 years',
        potentialImpact: 'Loss of competitiveness',
        stakeholders: ['Companies', 'Government']
      };

      expect(() => validateChallengeData(validData)).not.toThrow();
    });

    it('should reject invalid severity', () => {
      const invalidData: ChallengeData = {
        id: 'TECH-001',
        title: 'Technology Gap',
        category: 'technological',
        severity: 15, // Invalid: > 10
        urgency: 8,
        description: 'Significant technology gap',
        currentStatus: 'Behind by 5 years',
        potentialImpact: 'Loss of competitiveness',
        stakeholders: ['Companies', 'Government']
      };

      expect(() => validateChallengeData(invalidData)).toThrow('深刻度は1-10の範囲内である必要があります');
    });

    it('should reject invalid category', () => {
      const invalidData: ChallengeData = {
        id: 'TECH-001',
        title: 'Technology Gap',
        category: 'invalid' as any,
        severity: 9,
        urgency: 8,
        description: 'Significant technology gap',
        currentStatus: 'Behind by 5 years',
        potentialImpact: 'Loss of competitiveness',
        stakeholders: ['Companies', 'Government']
      };

      expect(() => validateChallengeData(invalidData)).toThrow('カテゴリはtechnological、economic、geopoliticalのいずれかである必要があります');
    });
  });

  describe('validateStrategicRecommendation', () => {
    it('should validate correct recommendation data', () => {
      const validData: StrategicRecommendation = {
        id: 'REC-001',
        title: 'Increase R&D Investment',
        priority: 'high',
        category: 'Investment',
        description: 'Increase R&D investment significantly',
        expectedImpact: 'Improved competitiveness',
        implementationCost: 1000,
        timeframe: '2-3 years',
        dependencies: [],
        risks: [],
        successMetrics: []
      };

      expect(() => validateStrategicRecommendation(validData)).not.toThrow();
    });

    it('should reject invalid priority', () => {
      const invalidData: StrategicRecommendation = {
        id: 'REC-001',
        title: 'Increase R&D Investment',
        priority: 'invalid' as any,
        category: 'Investment',
        description: 'Increase R&D investment significantly',
        expectedImpact: 'Improved competitiveness',
        implementationCost: 1000,
        timeframe: '2-3 years',
        dependencies: [],
        risks: [],
        successMetrics: []
      };

      expect(() => validateStrategicRecommendation(invalidData)).toThrow('優先度はhigh、medium、lowのいずれかである必要があります');
    });

    it('should reject negative implementation cost', () => {
      const invalidData: StrategicRecommendation = {
        id: 'REC-001',
        title: 'Increase R&D Investment',
        priority: 'high',
        category: 'Investment',
        description: 'Increase R&D investment significantly',
        expectedImpact: 'Improved competitiveness',
        implementationCost: -1000,
        timeframe: '2-3 years',
        dependencies: [],
        risks: [],
        successMetrics: []
      };

      expect(() => validateStrategicRecommendation(invalidData)).toThrow('実装コストは非負の値である必要があります');
    });
  });

  describe('DataIntegrityChecker', () => {
    describe('checkMarketDataIntegrity', () => {
      it('should pass integrity check for valid data', () => {
        const marketMetrics: MarketMetrics[] = [
          {
            marketSize: 10000,
            growthRate: 25,
            year: 2023,
            source: 'Test',
            confidence: 8
          }
        ];

        const marketShares: MarketShareData[] = [
          {
            company: 'NVIDIA',
            marketShare: 45,
            year: 2023,
            region: 'Global',
            segment: 'AI Training'
          }
        ];

        const result = DataIntegrityChecker.checkMarketDataIntegrity(marketMetrics, marketShares);
        expect(result.isValid).toBe(true);
        expect(result.issues).toHaveLength(0);
      });

      it('should detect missing market share data', () => {
        const marketMetrics: MarketMetrics[] = [
          {
            marketSize: 10000,
            growthRate: 25,
            year: 2023,
            source: 'Test',
            confidence: 8
          }
        ];

        const marketShares: MarketShareData[] = []; // Missing data for 2023

        const result = DataIntegrityChecker.checkMarketDataIntegrity(marketMetrics, marketShares);
        expect(result.isValid).toBe(false);
        expect(result.issues.length).toBeGreaterThan(0);
      });
    });

    describe('checkCompetitorDataIntegrity', () => {
      it('should detect high R&D ratio', () => {
        const competitors: CompetitorAnalysis[] = [
          {
            companyName: 'Test Company',
            country: 'Japan',
            annualRevenue: 1000,
            rdInvestment: 600, // 60% R&D ratio
            keyProducts: ['Product A'],
            marketPosition: 'Leader',
            strengths: ['Tech'],
            weaknesses: ['Market']
          }
        ];

        const result = DataIntegrityChecker.checkCompetitorDataIntegrity(competitors);
        expect(result.isValid).toBe(false);
        expect(result.issues.some(issue => issue.includes('R&D投資比率が異常に高い'))).toBe(true);
      });

      it('should detect overlapping strengths and weaknesses', () => {
        const competitors: CompetitorAnalysis[] = [
          {
            companyName: 'Test Company',
            country: 'Japan',
            annualRevenue: 1000,
            rdInvestment: 100,
            keyProducts: ['Product A'],
            marketPosition: 'Leader',
            strengths: ['Technology', 'Market'],
            weaknesses: ['Technology'] // Overlaps with strengths
          }
        ];

        const result = DataIntegrityChecker.checkCompetitorDataIntegrity(competitors);
        expect(result.isValid).toBe(false);
        expect(result.issues.some(issue => issue.includes('強みと弱みに重複があります'))).toBe(true);
      });
    });
  });

  describe('DataQualityScorer', () => {
    it('should calculate overall quality score', () => {
      const sampleData = [
        {
          field1: 'value1',
          field2: 100,
          field3: 'complete'
        },
        {
          field1: 'value2',
          field2: 200,
          field3: 'complete'
        }
      ];

      const result = DataQualityScorer.calculateOverallQualityScore(
        sampleData, [], [], []
      );

      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.categoryScores).toBeDefined();
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should provide recommendations for low quality data', () => {
      const lowQualityData = [
        {
          field1: '', // Empty field
          field2: null, // Null field
          field3: undefined, // Undefined field
          marketShare: 150, // Invalid value > 100
          year: 1990 // Invalid old year
        },
        {
          field1: '', 
          field2: null,
          field3: undefined,
          marketShare: -10, // Invalid negative value
          year: 2050 // Invalid future year
        }
      ];

      const result = DataQualityScorer.calculateOverallQualityScore(
        lowQualityData, [], [], []
      );

      // With mostly empty fields and invalid data, score should be low
      expect(result.overallScore).toBeLessThan(60);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});