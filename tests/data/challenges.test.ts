// 課題データ管理システムのテスト

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  ChallengeAssessmentManager, 
  ChallengeClassifier,
  SupplyChainDependencyAnalyzer,
  TalentGapQuantifier
} from '../../src/data/challenges.js';
import { ChallengeData } from '../../src/data/types.js';

describe('ChallengeAssessmentManager', () => {
  let challengeManager: ChallengeAssessmentManager;
  let sampleChallenge: ChallengeData;

  beforeEach(() => {
    challengeManager = new ChallengeAssessmentManager();
    
    sampleChallenge = {
      id: 'TEST-001',
      title: 'Test Challenge',
      category: 'technological',
      severity: 8,
      urgency: 7,
      description: 'Test challenge description',
      currentStatus: 'In progress',
      potentialImpact: 'High impact',
      stakeholders: ['Government', 'Companies']
    };
  });

  describe('addChallenge', () => {
    it('should add valid challenge successfully', () => {
      expect(() => {
        challengeManager.addChallenge(sampleChallenge);
      }).not.toThrow();
    });

    it('should throw error for invalid challenge ID', () => {
      const invalidChallenge = { ...sampleChallenge, id: '' };
      
      expect(() => {
        challengeManager.addChallenge(invalidChallenge);
      }).toThrow('課題IDは必須です');
    });

    it('should throw error for invalid severity', () => {
      const invalidChallenge = { ...sampleChallenge, severity: 15 };
      
      expect(() => {
        challengeManager.addChallenge(invalidChallenge);
      }).toThrow('深刻度は1-10の範囲内である必要があります');
    });
  });

  describe('getChallengesByCategory', () => {
    beforeEach(() => {
      challengeManager.addChallenge(sampleChallenge);
      challengeManager.addChallenge({
        ...sampleChallenge,
        id: 'TEST-002',
        category: 'economic'
      });
    });

    it('should return challenges by category', () => {
      const techChallenges = challengeManager.getChallengesByCategory('technological');
      const econChallenges = challengeManager.getChallengesByCategory('economic');
      
      expect(techChallenges).toHaveLength(1);
      expect(econChallenges).toHaveLength(1);
      expect(techChallenges[0].category).toBe('technological');
      expect(econChallenges[0].category).toBe('economic');
    });
  });

  describe('getHighPriorityChallenges', () => {
    it('should return high priority challenges', () => {
      challengeManager.addChallenge(sampleChallenge); // Priority score: 7.6
      challengeManager.addChallenge({
        ...sampleChallenge,
        id: 'TEST-002',
        severity: 5,
        urgency: 4
      }); // Priority score: 4.6

      const highPriority = challengeManager.getHighPriorityChallenges();
      expect(highPriority).toHaveLength(1);
      expect(highPriority[0].id).toBe('TEST-001');
    });
  });
});

describe('ChallengeClassifier', () => {
  let sampleChallenge: ChallengeData;

  beforeEach(() => {
    sampleChallenge = {
      id: 'TEST-001',
      title: 'Technology Challenge',
      category: 'technological',
      severity: 8,
      urgency: 7,
      description: '技術開発における課題',
      currentStatus: 'In progress',
      potentialImpact: 'High impact',
      stakeholders: ['Government', 'Companies']
    };
  });

  describe('calculatePriorityScore', () => {
    it('should calculate priority score correctly', () => {
      const score = ChallengeClassifier.calculatePriorityScore(sampleChallenge);
      // Expected: 8 * 0.6 + 7 * 0.4 = 4.8 + 2.8 = 7.6
      expect(score).toBeCloseTo(7.6, 1);
    });
  });

  describe('categorizeChallenge', () => {
    it('should categorize technological challenge', () => {
      const techChallenge = {
        ...sampleChallenge,
        description: '技術開発とR&D投資の課題'
      };
      
      const category = ChallengeClassifier.categorizeChallenge(techChallenge);
      expect(category).toBe('technological');
    });

    it('should categorize economic challenge', () => {
      const econChallenge = {
        ...sampleChallenge,
        description: '投資と資金調達の課題'
      };
      
      const category = ChallengeClassifier.categorizeChallenge(econChallenge);
      expect(category).toBe('economic');
    });

    it('should categorize geopolitical challenge', () => {
      const geoChallenge = {
        ...sampleChallenge,
        description: '貿易制裁と輸出規制の課題'
      };
      
      const category = ChallengeClassifier.categorizeChallenge(geoChallenge);
      expect(category).toBe('geopolitical');
    });
  });
});

describe('SupplyChainDependencyAnalyzer', () => {
  describe('assessSupplyChainRisk', () => {
    it('should assess high risk correctly', () => {
      const result = SupplyChainDependencyAnalyzer.assessSupplyChainRisk(9, 8, 9);
      
      expect(result.riskLevel).toBeGreaterThanOrEqual(8);
      expect(result.riskCategory).toBe('極めて高い');
      expect(result.recommendations).toContain('サプライヤーの多様化を緊急に実施');
    });

    it('should assess medium risk correctly', () => {
      const result = SupplyChainDependencyAnalyzer.assessSupplyChainRisk(5, 4, 5);
      
      expect(result.riskLevel).toBeLessThan(6);
      expect(result.riskCategory).toBe('中程度');
      expect(result.recommendations).toContain('定期的なサプライヤー評価');
    });
  });
});

describe('TalentGapQuantifier', () => {
  describe('quantifyTalentGap', () => {
    it('should quantify talent gap correctly', () => {
      const result = TalentGapQuantifier.quantifyTalentGap(1000, 3000, 'senior', 5);
      
      expect(result.gapSize).toBe(2000);
      expect(result.gapPercentage).toBeCloseTo(66.67, 1);
      expect(result.annualRequirement).toBe(400);
      expect(result.trainingCost).toBe(400000); // 2000 * 200万円
      expect(result.recommendations).toContain('大学との連携強化による新卒採用拡大');
    });

    it('should handle no gap scenario', () => {
      const result = TalentGapQuantifier.quantifyTalentGap(3000, 2000, 'entry', 3);
      
      expect(result.gapSize).toBe(0);
      expect(result.gapPercentage).toBe(0);
      expect(result.annualRequirement).toBe(0);
    });

    it('should provide appropriate recommendations for large gaps', () => {
      const result = TalentGapQuantifier.quantifyTalentGap(500, 2000, 'expert', 3);
      
      expect(result.gapPercentage).toBe(75);
      expect(result.recommendations).toContain('大学との連携強化による新卒採用拡大');
      expect(result.recommendations).toContain('海外人材の積極的な採用');
    });
  });
});