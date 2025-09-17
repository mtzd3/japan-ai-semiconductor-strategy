// データ検証関数のユニットテスト

import { describe, it, expect } from 'vitest';
import {
  validateMarketShareData,
  validateMarketMetrics,
  validateCompetitorAnalysis,
  validateTrendData
} from '../../src/data/validation.js';
import {
  MarketShareData,
  MarketMetrics,
  CompetitorAnalysis,
  TrendData
} from '../../src/data/types.js';

describe('データ検証テスト', () => {
  describe('validateMarketShareData', () => {
    it('有効なデータで成功する', () => {
      const validData: MarketShareData = {
        company: 'NVIDIA',
        marketShare: 85.2,
        year: 2023,
        region: 'Global',
        segment: 'AI Training Chips'
      };

      expect(() => validateMarketShareData(validData)).not.toThrow();
      expect(validateMarketShareData(validData)).toBe(true);
    });

    it('企業名が空の場合エラーを投げる', () => {
      const invalidData: MarketShareData = {
        company: '',
        marketShare: 85.2,
        year: 2023,
        region: 'Global',
        segment: 'AI Training Chips'
      };

      expect(() => validateMarketShareData(invalidData))
        .toThrow('企業名は必須です');
    });

    it('市場シェアが範囲外の場合エラーを投げる', () => {
      const invalidData: MarketShareData = {
        company: 'NVIDIA',
        marketShare: 150,
        year: 2023,
        region: 'Global',
        segment: 'AI Training Chips'
      };

      expect(() => validateMarketShareData(invalidData))
        .toThrow('市場シェアは0-100の範囲内である必要があります');
    });

    it('年が範囲外の場合エラーを投げる', () => {
      const invalidData: MarketShareData = {
        company: 'NVIDIA',
        marketShare: 85.2,
        year: 1999,
        region: 'Global',
        segment: 'AI Training Chips'
      };

      expect(() => validateMarketShareData(invalidData))
        .toThrow('年は2000年から現在+5年の範囲内である必要があります');
    });
  });

  describe('validateMarketMetrics', () => {
    it('有効なデータで成功する', () => {
      const validData: MarketMetrics = {
        marketSize: 1500,
        growthRate: 25.5,
        year: 2023,
        source: 'IDC Research',
        confidence: 8
      };

      expect(() => validateMarketMetrics(validData)).not.toThrow();
      expect(validateMarketMetrics(validData)).toBe(true);
    });

    it('市場規模が負の値の場合エラーを投げる', () => {
      const invalidData: MarketMetrics = {
        marketSize: -100,
        growthRate: 25.5,
        year: 2023,
        source: 'IDC Research',
        confidence: 8
      };

      expect(() => validateMarketMetrics(invalidData))
        .toThrow('市場規模は正の値である必要があります');
    });

    it('成長率が範囲外の場合エラーを投げる', () => {
      const invalidData: MarketMetrics = {
        marketSize: 1500,
        growthRate: 1500,
        year: 2023,
        source: 'IDC Research',
        confidence: 8
      };

      expect(() => validateMarketMetrics(invalidData))
        .toThrow('成長率は-100%から1000%の範囲内である必要があります');
    });

    it('データソースが空の場合エラーを投げる', () => {
      const invalidData: MarketMetrics = {
        marketSize: 1500,
        growthRate: 25.5,
        year: 2023,
        source: '',
        confidence: 8
      };

      expect(() => validateMarketMetrics(invalidData))
        .toThrow('データソースは必須です');
    });
  });

  describe('validateCompetitorAnalysis', () => {
    it('有効なデータで成功する', () => {
      const validData: CompetitorAnalysis = {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: 6000,
        rdInvestment: 800,
        keyProducts: ['H100', 'A100', 'RTX 4090'],
        marketPosition: 'Market Leader',
        strengths: ['Advanced GPU Architecture', 'CUDA Ecosystem'],
        weaknesses: ['High Power Consumption', 'Supply Chain Constraints']
      };

      expect(() => validateCompetitorAnalysis(validData)).not.toThrow();
      expect(validateCompetitorAnalysis(validData)).toBe(true);
    });

    it('企業名が空の場合エラーを投げる', () => {
      const invalidData: CompetitorAnalysis = {
        companyName: '',
        country: 'USA',
        annualRevenue: 6000,
        rdInvestment: 800,
        keyProducts: ['H100', 'A100'],
        marketPosition: 'Market Leader',
        strengths: ['Advanced GPU Architecture'],
        weaknesses: ['High Power Consumption']
      };

      expect(() => validateCompetitorAnalysis(invalidData))
        .toThrow('企業名は必須です');
    });

    it('年間売上が負の値の場合エラーを投げる', () => {
      const invalidData: CompetitorAnalysis = {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: -1000,
        rdInvestment: 800,
        keyProducts: ['H100', 'A100'],
        marketPosition: 'Market Leader',
        strengths: ['Advanced GPU Architecture'],
        weaknesses: ['High Power Consumption']
      };

      expect(() => validateCompetitorAnalysis(invalidData))
        .toThrow('年間売上は非負の値である必要があります');
    });

    it('主要製品が空の場合エラーを投げる', () => {
      const invalidData: CompetitorAnalysis = {
        companyName: 'NVIDIA',
        country: 'USA',
        annualRevenue: 6000,
        rdInvestment: 800,
        keyProducts: [],
        marketPosition: 'Market Leader',
        strengths: ['Advanced GPU Architecture'],
        weaknesses: ['High Power Consumption']
      };

      expect(() => validateCompetitorAnalysis(invalidData))
        .toThrow('主要製品は少なくとも1つ指定する必要があります');
    });
  });

  describe('validateTrendData', () => {
    it('有効なデータで成功する', () => {
      const validData: TrendData = {
        trendName: 'Edge AI Computing',
        description: 'AI処理をエッジデバイスで実行するトレンド',
        impactLevel: 8,
        timeframe: 'medium',
        affectedSegments: ['Mobile', 'IoT', 'Automotive'],
        opportunities: ['低遅延処理', 'プライバシー保護'],
        threats: ['計算能力の制約', 'バッテリー消費']
      };

      expect(() => validateTrendData(validData)).not.toThrow();
      expect(validateTrendData(validData)).toBe(true);
    });

    it('トレンド名が空の場合エラーを投げる', () => {
      const invalidData: TrendData = {
        trendName: '',
        description: 'AI処理をエッジデバイスで実行するトレンド',
        impactLevel: 8,
        timeframe: 'medium',
        affectedSegments: ['Mobile', 'IoT'],
        opportunities: ['低遅延処理'],
        threats: ['計算能力の制約']
      };

      expect(() => validateTrendData(invalidData))
        .toThrow('トレンド名は必須です');
    });

    it('影響度が範囲外の場合エラーを投げる', () => {
      const invalidData: TrendData = {
        trendName: 'Edge AI Computing',
        description: 'AI処理をエッジデバイスで実行するトレンド',
        impactLevel: 15,
        timeframe: 'medium',
        affectedSegments: ['Mobile', 'IoT'],
        opportunities: ['低遅延処理'],
        threats: ['計算能力の制約']
      };

      expect(() => validateTrendData(invalidData))
        .toThrow('影響度は1-10の範囲内である必要があります');
    });

    it('時間軸が無効な場合エラーを投げる', () => {
      const invalidData: TrendData = {
        trendName: 'Edge AI Computing',
        description: 'AI処理をエッジデバイスで実行するトレンド',
        impactLevel: 8,
        timeframe: 'invalid' as any,
        affectedSegments: ['Mobile', 'IoT'],
        opportunities: ['低遅延処理'],
        threats: ['計算能力の制約']
      };

      expect(() => validateTrendData(invalidData))
        .toThrow('時間軸はshort、medium、longのいずれかである必要があります');
    });
  });
});