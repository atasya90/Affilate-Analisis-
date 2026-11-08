import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGrowthRate,
  classifyTrendStatus,
  calculateProductOpportunityScore,
  calculateProfitScenarios,
  formatIDR,
  formatCompact,
} from './calculations';

test('calculateGrowthRate calculates percentage correctly', () => {
  // 120 vs 100 is +20%
  const growth = calculateGrowthRate(120, 100);
  assert.equal(growth, 20);

  // 80 vs 100 is -20%
  const drop = calculateGrowthRate(80, 100);
  assert.equal(drop, -20);

  // previous is 0 or null returns null (N/A)
  assert.equal(calculateGrowthRate(100, 0), null);
  assert.equal(calculateGrowthRate(100, null), null);
  assert.equal(calculateGrowthRate(100, -10), null);
});

test('classifyTrendStatus assigns correct label', () => {
  assert.equal(classifyTrendStatus(25), 'Rising');
  assert.equal(classifyTrendStatus(5), 'Stable');
  assert.equal(classifyTrendStatus(-15), 'Declining');
  assert.equal(classifyTrendStatus(null), 'New Trend');
  assert.equal(classifyTrendStatus(50, true), 'New Trend');
});

test('calculateProductOpportunityScore computes normalized composite score', () => {
  const result = calculateProductOpportunityScore({
    growth7d: 40,
    popularity30d: 85,
    soldCount: 8500,
    commissionRate: 15,
    competitionLevel: 'Low Competition',
    hashtagScore: 80,
  });

  assert.ok(result.total >= 70 && result.total <= 100);
  assert.equal(result.dataCompleteness, 100);
  assert.equal(result.isProvisional, false);
  assert.equal(result.level, 'High Opportunity');
  assert.ok(result.breakdown.trendGrowth7d > 50);
});

test('calculateProductOpportunityScore handles partial data with provisional flag', () => {
  const result = calculateProductOpportunityScore({
    growth7d: 20,
    popularity30d: 70,
    soldCount: null,
    commissionRate: null,
    competitionLevel: null,
    hashtagScore: null,
  });

  // Less than 75% completeness should be provisional
  assert.ok(result.dataCompleteness < 75);
  assert.equal(result.isProvisional, true);
  assert.ok(typeof result.total === 'number');
});

test('calculateProfitScenarios calculates conservative, moderate, optimistic', () => {
  const price = 100000;
  const commissionRate = 10; // 10% = 10,000 IDR per sale
  const clicks = 500;
  const baseConversionRate = 2.0;

  const result = calculateProfitScenarios(price, commissionRate, clicks, baseConversionRate);

  assert.equal(result.commissionPerSale, 10000);
  assert.equal(result.scenarios.length, 3);

  const conservative = result.scenarios.find(s => s.name === 'Konservatif');
  const moderate = result.scenarios.find(s => s.name === 'Moderat');
  const optimistic = result.scenarios.find(s => s.name === 'Optimistis');

  assert.ok(conservative && moderate && optimistic);
  assert.ok(optimistic.dailyRevenue >= moderate.dailyRevenue);
  assert.ok(moderate.dailyRevenue >= conservative.dailyRevenue);
  assert.equal(moderate.monthlyRevenue, moderate.dailyRevenue * 30);
});

test('formatIDR formats currency in Rupiah', () => {
  assert.equal(formatIDR(150000), 'Rp 150.000');
  assert.equal(formatIDR(0), 'Rp 0');
});

test('formatCompact formats numbers compactly', () => {
  assert.equal(formatCompact(1500), '1.5k');
  assert.equal(formatCompact(2500000), '2.5M');
  assert.equal(formatCompact(450), '450');
});
