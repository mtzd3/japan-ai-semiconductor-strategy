// 統合テスト - システム全体のテスト

import { describe, it, expect } from 'vitest';
import { main, generateSampleData } from '../../src/main.js';
import { MarketAnalyzer } from '../../src/analysis/market-analyzer.js';
import { ChallengeAnalyzer } from '../../src/analysis/challenge-analyzer.js';
import { ImplementationPlanner } from '../../src/analysis/implementation-planner.js';
import { InternationalBenchmarkAnalyzer } from '../../src/analysis/international-benchmark.js';
import { OpportunityAnalyzer } from '../../src/analysis/opportunity-analyzer.js';
import { DocumentGenerator } from '../../src/generators/document-generator.js';

describe('Full System Integration', () => {
  describe('main function', () => {
    it('should execute complete analysis pipeline', async () => {
      const result = await main();

      expect(result).toBeDefined();
      expect(result.executiveSummary).toBeDefined();
      expect(result.marketResult).toBeDefined();
      expect(result.challengeResult).toBeDefined();
      expect(result.sampleData).toBeDefined();

      // Verify market analysis results
      expect(result.marketResult.currentState).toBeDefined();
      expect(result.marketResult.competitivePosition).toBeDefined();
      expect(result.marketResult.marketForecast).toBeDefined();
      expect(result.marketResult.segmentAnalysis).toBeDefined();

      // Verify challenge analysis results
      expect(result.challengeResult.overview).toBeDefined();
      expect(result.challengeResult.categoryBreakdown).toBeDefined();
      expect(result.challengeResult.priorityMatrix).toBeDefined();

      // Verify executive summary is generated
      expect(result.executiveSummary).toContain('エグゼクティブサマリー');
      expect(result.executiveSummary).toContain('現状認識');
      expect(result.executiveSummary).toContain('主要課題');
    }, 30000); // 30 second timeout for integration test
  });

  describe('generateSampleData', () => {
    it('should generate valid sample data', () => {
      const sampleData = generateSampleData();

      expect(sampleData.marketMetrics).toBeInstanceOf(Array);
      expect(sampleData.marketShares).toBeInstanceOf(Array);
      expect(sampleData.competitors).toBeInstanceOf(Array);
      expect(sampleData.trends).toBeInstanceOf(Array);
      expect(sampleData.challenges).toBeInstanceOf(Array);

      expect(sampleData.marketMetrics.length).toBeGreaterThan(0);
      expect(sampleData.marketShares.length).toBeGreaterThan(0);
      expect(sampleData.competitors.length).toBeGreaterThan(0);
      expect(sampleData.trends.length).toBeGreaterThan(0);
      expect(sampleData.challenges.length).toBeGreaterThan(0);
    });

    it('should generate data with correct structure', () => {
      const sampleData = generateSampleData();

      // Check market metrics structure
      const metric = sampleData.marketMetrics[0];
      expect(metric).toHaveProperty('marketSize');
      expect(metric).toHaveProperty('growthRate');
      expect(metric).toHaveProperty('year');
      expect(metric).toHaveProperty('source');
      expect(metric).toHaveProperty('confidence');

      // Check market share structure
      const share = sampleData.marketShares[0];
      expect(share).toHaveProperty('company');
      expect(share).toHaveProperty('marketShare');
      expect(share).toHaveProperty('year');
      expect(share).toHaveProperty('region');
      expect(share).toHaveProperty('segment');

      // Check competitor structure
      const competitor = sampleData.competitors[0];
      expect(competitor).toHaveProperty('companyName');
      expect(competitor).toHaveProperty('country');
      expect(competitor).toHaveProperty('annualRevenue');
      expect(competitor).toHaveProperty('rdInvestment');
      expect(competitor).toHaveProperty('keyProducts');

      // Check trend structure
      const trend = sampleData.trends[0];
      expect(trend).toHaveProperty('trendName');
      expect(trend).toHaveProperty('description');
      expect(trend).toHaveProperty('impactLevel');
      expect(trend).toHaveProperty('timeframe');

      // Check challenge structure
      const challenge = sampleData.challenges[0];
      expect(challenge).toHaveProperty('id');
      expect(challenge).toHaveProperty('title');
      expect(challenge).toHaveProperty('category');
      expect(challenge).toHaveProperty('severity');
      expect(challenge).toHaveProperty('urgency');
    });
  });

  describe('Analysis Pipeline Integration', () => {
    it('should integrate all analysis modules', async () => {
      const sampleData = generateSampleData();

      // Market Analysis
      const marketAnalyzer = new MarketAnalyzer();
      const marketResult = await marketAnalyzer.analyzeMarket(
        sampleData.marketMetrics,
        sampleData.marketShares,
        sampleData.competitors,
        sampleData.trends
      );

      // Challenge Analysis
      const challengeAnalyzer = new ChallengeAnalyzer();
      const challengeResult = await challengeAnalyzer.analyzeChallenges(sampleData.challenges);

      // Implementation Planning
      const implementationPlanner = new ImplementationPlanner();
      const implementationResult = implementationPlanner.generateImplementationPlan([]);

      // International Benchmarking
      const benchmarkAnalyzer = new InternationalBenchmarkAnalyzer();
      const benchmarkResult = benchmarkAnalyzer.analyzeBenchmarks();

      // Opportunity Analysis
      const opportunityAnalyzer = new OpportunityAnalyzer();
      const opportunityResult = opportunityAnalyzer.analyzeOpportunities();

      // Verify all analyses completed successfully
      expect(marketResult).toBeDefined();
      expect(challengeResult).toBeDefined();
      expect(implementationResult).toBeDefined();
      expect(benchmarkResult).toBeDefined();
      expect(opportunityResult).toBeDefined();

      // Verify data consistency across modules
      expect(marketResult.currentState.marketSize).toBeGreaterThan(0);
      expect(challengeResult.overview.totalChallenges).toBe(sampleData.challenges.length);
      expect(implementationResult.overview.totalPhases).toBeGreaterThan(0);
      expect(benchmarkResult.overview.totalCountries).toBeGreaterThan(0);
      expect(opportunityResult.overview.totalOpportunities).toBeGreaterThan(0);
    });

    it('should generate consistent recommendations across modules', async () => {
      const sampleData = generateSampleData();

      const marketAnalyzer = new MarketAnalyzer();
      const challengeAnalyzer = new ChallengeAnalyzer();
      const benchmarkAnalyzer = new InternationalBenchmarkAnalyzer();

      const marketResult = await marketAnalyzer.analyzeMarket(
        sampleData.marketMetrics,
        sampleData.marketShares,
        sampleData.competitors,
        sampleData.trends
      );

      const challengeResult = await challengeAnalyzer.analyzeChallenges(sampleData.challenges);
      const benchmarkResult = benchmarkAnalyzer.analyzeBenchmarks();

      // Check that recommendations are consistent
      expect(marketResult.recommendations).toBeInstanceOf(Array);
      expect(challengeResult.recommendations.immediate).toBeInstanceOf(Array);
      expect(benchmarkResult.recommendations.immediate).toBeInstanceOf(Array);

      // Verify recommendations are not empty
      expect(marketResult.recommendations.length).toBeGreaterThan(0);
      expect(challengeResult.recommendations.immediate.length).toBeGreaterThan(0);
      expect(benchmarkResult.recommendations.immediate.length).toBeGreaterThan(0);
    });
  });

  describe('Document Generation Integration', () => {
    it('should generate complete document from analysis results', async () => {
      const sampleData = generateSampleData();

      const marketAnalyzer = new MarketAnalyzer();
      const challengeAnalyzer = new ChallengeAnalyzer();
      const documentGenerator = new DocumentGenerator();

      const marketResult = await marketAnalyzer.analyzeMarket(
        sampleData.marketMetrics,
        sampleData.marketShares,
        sampleData.competitors,
        sampleData.trends
      );

      const challengeResult = await challengeAnalyzer.analyzeChallenges(sampleData.challenges);

      // Generate executive summary
      await documentGenerator.loadTemplates([
        { name: 'executive-summary', path: 'templates/executive-summary.md' }
      ]);

      const executiveSummary = documentGenerator.generateExecutiveSummary(marketResult, challengeResult);

      expect(executiveSummary).toBeDefined();
      expect(executiveSummary).toContain('エグゼクティブサマリー');
      expect(executiveSummary).toContain('現状認識');
      expect(executiveSummary).toContain('主要課題');
      expect(executiveSummary).toContain('戦略的方向性');
      expect(executiveSummary).toContain('重点施策');

      // Verify data integration in document
      expect(executiveSummary).toContain(marketResult.currentState.marketSize.toString());
      expect(executiveSummary).toContain(challengeResult.overview.totalChallenges.toString());
    });

    it('should handle template rendering errors gracefully', async () => {
      const documentGenerator = new DocumentGenerator();

      // Try to generate without loading templates
      expect(() => {
        documentGenerator.generateExecutiveSummary({} as any, {} as any);
      }).toThrow('エグゼクティブサマリーテンプレートが見つかりません');
    });
  });

  describe('Performance and Scalability', () => {
    it('should complete analysis within reasonable time', async () => {
      const startTime = Date.now();
      
      await main();
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should complete within 10 seconds
      expect(executionTime).toBeLessThan(10000);
    });

    it('should handle large datasets efficiently', async () => {
      // Generate larger sample data
      const largeSampleData = generateSampleData();
      
      // Multiply data size
      const multiplier = 10;
      const largeMarketMetrics = Array(multiplier).fill(null).flatMap(() => largeSampleData.marketMetrics);
      const largeMarketShares = Array(multiplier).fill(null).flatMap(() => largeSampleData.marketShares);
      const largeChallenges = Array(multiplier).fill(null).flatMap((_, i) => 
        largeSampleData.challenges.map(c => ({ ...c, id: `${c.id}-${i}` }))
      );

      const marketAnalyzer = new MarketAnalyzer();
      const challengeAnalyzer = new ChallengeAnalyzer();

      const startTime = Date.now();

      const marketResult = await marketAnalyzer.analyzeMarket(
        largeMarketMetrics,
        largeMarketShares,
        largeSampleData.competitors,
        largeSampleData.trends
      );

      const challengeResult = await challengeAnalyzer.analyzeChallenges(largeChallenges);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should handle larger datasets within reasonable time
      expect(executionTime).toBeLessThan(15000);
      expect(marketResult).toBeDefined();
      expect(challengeResult).toBeDefined();
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle partial data gracefully', async () => {
      const partialData = {
        marketMetrics: generateSampleData().marketMetrics,
        marketShares: [], // Empty market shares
        competitors: generateSampleData().competitors,
        trends: generateSampleData().trends,
        challenges: generateSampleData().challenges
      };

      const marketAnalyzer = new MarketAnalyzer();
      const challengeAnalyzer = new ChallengeAnalyzer();

      // Should not throw errors with partial data
      const marketResult = await marketAnalyzer.analyzeMarket(
        partialData.marketMetrics,
        partialData.marketShares,
        partialData.competitors,
        partialData.trends
      );

      const challengeResult = await challengeAnalyzer.analyzeChallenges(partialData.challenges);

      expect(marketResult).toBeDefined();
      expect(challengeResult).toBeDefined();
    });

    it('should provide meaningful error messages', async () => {
      const marketAnalyzer = new MarketAnalyzer();

      // Test with completely empty data
      await expect(
        marketAnalyzer.analyzeMarket([], [], [], [])
      ).rejects.toThrow('市場メトリクスデータが不足しています');
    });
  });
});