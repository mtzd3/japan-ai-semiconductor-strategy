// 完全版分析実行スクリプト

import JapanAISemiconductorStrategySystem from './integrated-system.js';
import { writeFile } from 'fs/promises';

/**
 * 完全版分析の実行
 */
async function runCompleteAnalysis() {
  console.log('🇯🇵 日本AI半導体戦略統合システム v1.0.0');
  console.log('=' .repeat(60));
  console.log('📋 実行モジュール:');
  console.log('  ✅ 市場分析エンジン');
  console.log('  ✅ 課題分析エンジン');
  console.log('  ✅ 実装計画システム');
  console.log('  ✅ 国際ベンチマーキング');
  console.log('  ✅ 新興機会分析');
  console.log('  ✅ 文書生成システム');
  console.log('=' .repeat(60));
  console.log();

  try {
    // 統合システムの初期化
    const system = new JapanAISemiconductorStrategySystem();

    // 完全分析の実行
    const result = await system.executeComprehensiveAnalysis({
      enableDataCollection: false,
      enableMarketAnalysis: true,
      enableChallengeAnalysis: true,
      enableImplementationPlanning: true,
      enableBenchmarking: true,
      enableOpportunityAnalysis: true,
      generateFullDocument: true,
      outputFormats: ['markdown'],
      language: 'ja'
    });

    // 結果の保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `output/complete-strategy-analysis-${timestamp}.md`;
    
    await writeFile(filename, result.executiveSummary, 'utf-8');

    // 分析結果サマリーの表示
    console.log('📊 分析結果サマリー:');
    console.log('=' .repeat(60));
    
    if (result.marketAnalysis) {
      console.log('📈 市場分析:');
      console.log(`  市場規模: ${result.marketAnalysis.currentState.marketSize.toLocaleString()}億円`);
      console.log(`  成長率: ${result.marketAnalysis.currentState.growthRate.toFixed(1)}%`);
      console.log(`  日本シェア: ${result.marketAnalysis.competitivePosition.japanMarketShare.toFixed(1)}%`);
      console.log(`  競争レベル: ${result.marketAnalysis.currentState.competitionLevel}`);
      console.log();
    }

    if (result.challengeAnalysis) {
      console.log('⚠️  課題分析:');
      console.log(`  総課題数: ${result.challengeAnalysis.overview.totalChallenges}件`);
      console.log(`  重要課題: ${result.challengeAnalysis.overview.criticalChallenges}件`);
      console.log(`  平均深刻度: ${result.challengeAnalysis.overview.averageSeverity.toFixed(1)}/10`);
      console.log(`  リスクレベル: ${result.challengeAnalysis.overview.riskLevel}`);
      console.log();
    }

    if (result.implementationPlan) {
      console.log('📋 実装計画:');
      console.log(`  総フェーズ数: ${result.implementationPlan.overview.totalPhases}`);
      console.log(`  総期間: ${result.implementationPlan.overview.totalDuration}ヶ月`);
      console.log(`  総予算: ${result.implementationPlan.overview.totalBudget.toLocaleString()}億円`);
      console.log(`  リスクレベル: ${result.implementationPlan.overview.riskLevel}`);
      console.log();
    }

    if (result.internationalBenchmark) {
      console.log('🌍 国際ベンチマーキング:');
      console.log(`  分析対象国: ${result.internationalBenchmark.overview.totalCountries}カ国`);
      console.log(`  総投資額: ${result.internationalBenchmark.overview.totalInvestment.toLocaleString()}億円`);
      console.log(`  トップパフォーマー: ${result.internationalBenchmark.overview.topPerformers.join(', ')}`);
      console.log();
    }

    if (result.opportunityAnalysis) {
      console.log('🔮 新興機会分析:');
      console.log(`  総機会数: ${result.opportunityAnalysis.overview.totalOpportunities}件`);
      console.log(`  市場ポテンシャル: ${result.opportunityAnalysis.overview.totalMarketPotential.toLocaleString()}億円`);
      console.log(`  平均市場投入期間: ${result.opportunityAnalysis.overview.averageTimeToMarket.toFixed(1)}年`);
      console.log();
    }

    console.log('📊 データ品質:');
    console.log(`  総合スコア: ${result.dataQuality.overallScore.toFixed(1)}/100`);
    console.log(`  完全性: ${result.dataQuality.completeness.toFixed(1)}%`);
    console.log(`  精度: ${result.dataQuality.accuracy.toFixed(1)}%`);
    console.log(`  一貫性: ${result.dataQuality.consistency.toFixed(1)}%`);
    console.log();

    console.log('🎯 戦略推奨事項:');
    console.log(`  総推奨数: ${result.strategicRecommendations.length}件`);
    console.log(`  高優先度: ${result.strategicRecommendations.filter(r => r.priority === 'high').length}件`);
    console.log(`  中優先度: ${result.strategicRecommendations.filter(r => r.priority === 'medium').length}件`);
    console.log(`  低優先度: ${result.strategicRecommendations.filter(r => r.priority === 'low').length}件`);
    console.log();

    console.log('⚡ システム性能:');
    console.log(`  処理時間: ${result.metadata.totalProcessingTime}ms`);
    console.log(`  分析モジュール: ${result.metadata.analysisModules.length}個`);
    console.log(`  データソース: ${result.metadata.dataSourceCount}個`);
    console.log(`  生成日時: ${result.metadata.generatedAt.toLocaleString('ja-JP')}`);
    console.log();

    console.log('=' .repeat(60));
    console.log('🎉 完全版分析が正常に完了しました！');
    console.log(`📁 レポートファイル: ${filename}`);
    console.log('=' .repeat(60));

    // 主要推奨事項の表示
    console.log('\n🎯 主要戦略推奨事項:');
    result.strategicRecommendations
      .filter(r => r.priority === 'high')
      .slice(0, 5)
      .forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.title}`);
        console.log(`   カテゴリ: ${rec.category}`);
        console.log(`   実装コスト: ${rec.implementationCost.toLocaleString()}億円`);
        console.log(`   期間: ${rec.timeframe}`);
        console.log();
      });

    return result;

  } catch (error) {
    console.error('❌ 完全版分析でエラーが発生しました:');
    console.error(error);
    process.exit(1);
  }
}

// 実行
if (import.meta.url === `file://${process.argv[1]}`) {
  runCompleteAnalysis()
    .then(() => {
      console.log('\n✨ 日本AI半導体戦略の未来を切り開く準備が整いました！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 システム実行に失敗しました:', error);
      process.exit(1);
    });
}

export { runCompleteAnalysis };