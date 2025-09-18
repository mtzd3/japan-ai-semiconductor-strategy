// 課題分析エンジンのテスト

import { describe, it, expect, beforeEach } from 'vitest';
import { ChallengeAnalyzer } from '../../src/analysis/challenge-analyzer.js';
import { ChallengeData } from '../../src/data/types.js';

describe('ChallengeAnalyzer', () => {
  let challengeAnalyzer: ChallengeAnalyzer;
  let sampleChallenges: ChallengeData[];

  beforeEach(() => {
    challengeAnalyzer = new ChallengeAnalyzer();
    
    sampleChallenges = [
      {
        id: 'TEST-001',
        title: 'Technology Gap',
        category: 'technological',
        severity: 9,
        urgency: 8,
        description: 'Significant technology gap in AI chip design',
        currentStatus: 'Behind by 5 years',
        potentialImpact: 'Loss of competitiveness',
        stakeholders: ['Companies', 'Government']
      },
      {
        id: 'TEST-002',
        title: 'Talent Shortage',
        category: 'economic',
        severity: 8,
        urgency: 9,
        description: 'Shortage of AI chip design talent',
        currentStatus: '2000 people shortage',
        potentialImpact: 'Development delays',
        stakeholders: ['Companies', 'Universities']
      },
      {
        id: 'TEST-003',
        title: 'Supply Chain Risk',
        category: 'geopolitical',
        severity: 7,
        urgency: 6,
        description: 'Heavy dependence on foreign supply chain',
        currentStatus: '90% foreign dependence',
        potentialImpact: 'Supply disruption risk',
        stakeholders: ['Government', 'Companies']
      }
    ];
  });

  describe('analyzeChallenges', () => {
    it('should analyze challenges successfully', async () => {
      const result = await challengeAnalyzer.analyzeChallenges(sampleChallenges);

      expect(result).toBeDefined();
      expect(result.overview).toBeDefined();
      expect(result.categoryBreakdown).toBeDefined();
      expect(result.priorityMatrix).toBeDefined();
      expect(result.supplyChainRisks).toBeDefined();
      expect(result.talentGaps).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('should generate correct overview', async () => {
      const result = await challengeAnalyzer.analyzeChallenges(sampleChallenges);

      expect(result.overview.totalChallenges).toBe(3);
      expect(result.overview.criticalChallenges).toBe(2); // severity >= 8 OR urgency >= 8
      expect(result.overview.averageSeverity).toBe(8); // (9+8+7)/3
      expect(result.overview.averageUrgency).toBeCloseTo(7.67, 1); // (8+9+6)/3
      expect(result.overview.riskLevel).toBe('high');
    });

    it('should categorize challenges correctly', async () => {
      const result = await challengeAnalyzer.analyzeChallenges(sampleChallenges);

      expect(result.categoryBreakdown.technological.count).toBe(1);
      expect(result.categoryBreakdown.economic.count).toBe(1);
      expect(result.categoryBreakdown.geopolitical.count).toBe(1);
      
      expect(result.categoryBreakdown.technological.avgSeverity).toBe(9);
      expect(result.categoryBreakdown.economic.avgSeverity).toBe(8);
      expect(result.categoryBreakdown.geopolitical.avgSeverity).toBe(7);
    });

    it('should create priority matrix correctly', async () => {
      const result = await challengeAnalyzer.analyzeChallenges(sampleChallenges);

      // High priority (severity >= 7) and high urgency (urgency >= 7)
      expect(result.priorityMatrix.highPriorityHighUrgency).toHaveLength(2);
      
      // High priority (severity >= 7) and medium urgency (4 <= urgency < 7)
      expect(result.priorityMatrix.highPriorityMediumUrgency).toHaveLength(1);
      
      expect(result.priorityMatrix.mediumPriorityHighUrgency).toHaveLength(0);
      expect(result.priorityMatrix.lowPriority).toHaveLength(0);
    });

    it('should assess supply chain risks', async () => {
      const result = await challengeAnalyzer.analyzeChallenges(sampleChallenges);

      expect(result.supplyChainRisks.overallRiskLevel).toBeGreaterThan(0);
      expect(result.supplyChainRisks.criticalDependencies).toBeInstanceOf(Array);
      expect(result.supplyChainRisks.riskMitigation).toBeInstanceOf(Array);
    });

    it('should analyze talent gaps', async () => {
      const result = await challengeAnalyzer.analyzeChallenges(sampleChallenges);

      expect(result.talentGaps.criticalSkills).toBeInstanceOf(Array);
      expect(result.talentGaps.totalGapSize).toBeGreaterThan(0);
      expect(result.talentGaps.trainingCostEstimate).toBeGreaterThan(0);
      expect(result.talentGaps.timeToClose).toBeGreaterThan(0);
    });

    it('should generate recommendations', async () => {
      const result = await challengeAnalyzer.analyzeChallenges(sampleChallenges);

      expect(result.recommendations.immediate).toBeInstanceOf(Array);
      expect(result.recommendations.shortTerm).toBeInstanceOf(Array);
      expect(result.recommendations.longTerm).toBeInstanceOf(Array);
      
      expect(result.recommendations.immediate.length).toBeGreaterThan(0);
      expect(result.recommendations.shortTerm.length).toBeGreaterThan(0);
      expect(result.recommendations.longTerm.length).toBeGreaterThan(0);
    });
  });

  describe('analyzeChallengeRelationships', () => {
    it('should analyze challenge relationships', () => {
      const result = challengeAnalyzer.analyzeChallengeRelationships(sampleChallenges);

      expect(result.clusters).toBeInstanceOf(Array);
      expect(result.dependencies).toBeInstanceOf(Array);
      expect(result.clusters.length).toBeGreaterThan(0);
    });

    it('should cluster challenges correctly', () => {
      const result = challengeAnalyzer.analyzeChallengeRelationships(sampleChallenges);

      const clusterNames = result.clusters.map(c => c.name);
      expect(clusterNames).toContain('技術開発');
      
      const totalChallengesInClusters = result.clusters.reduce((sum, cluster) => sum + cluster.challenges.length, 0);
      expect(totalChallengesInClusters).toBe(sampleChallenges.length);
    });
  });

  describe('error handling', () => {
    it('should handle empty challenges array', async () => {
      const result = await challengeAnalyzer.analyzeChallenges([]);

      expect(result.overview.totalChallenges).toBe(0);
      expect(result.overview.criticalChallenges).toBe(0);
      expect(result.overview.averageSeverity).toBe(0);
      expect(result.overview.riskLevel).toBe('low');
    });

    it('should handle invalid challenge data', async () => {
      const invalidChallenges = [
        {
          id: '',
          title: '',
          category: 'technological' as const,
          severity: 15, // Invalid: > 10
          urgency: -1, // Invalid: < 1
          description: '',
          currentStatus: '',
          potentialImpact: '',
          stakeholders: []
        }
      ];

      // Should handle gracefully without throwing
      await expect(
        challengeAnalyzer.analyzeChallenges(invalidChallenges)
      ).rejects.toThrow(); // Should throw validation error
    });
  });
});