import { CompetitionLevel, ProfitScenario, TrendStatus } from '../types';

/**
 * Calculates percentage growth rate between two periods.
 * Formula: ((current - previous) / previous) * 100
 * If previous is zero or undefined, returns null to avoid division by zero / misleading values.
 */
export function calculateGrowthRate(current: number, previous: number | null | undefined): number | null {
  if (previous === null || previous === undefined || previous <= 0) {
    return null;
  }
  const growth = ((current - previous) / previous) * 100;
  return Math.round(growth * 10) / 10;
}

/**
 * Classifies trend status based on 7-day velocity.
 */
export function classifyTrendStatus(growth7d: number | null, isNewItem = false): TrendStatus {
  if (growth7d === null || isNewItem) {
    return 'New Trend';
  }
  if (growth7d >= 15) {
    return 'Rising';
  }
  if (growth7d <= -10) {
    return 'Declining';
  }
  return 'Stable';
}

export interface OpportunityScoreInput {
  growth7d: number | null;
  popularity30d: number | null; // 0 - 100
  soldCount: number | null;
  commissionRate: number | null; // e.g. 15 for 15%
  competitionLevel: CompetitionLevel | null;
  hashtagScore: number | null; // 0 - 100
}

export interface OpportunityScoreResult {
  total: number;
  level: 'High Opportunity' | 'Good Opportunity' | 'Moderate Opportunity' | 'Low Opportunity';
  isProvisional: boolean;
  dataCompleteness: number; // percentage
  breakdown: {
    trendGrowth7d: number;
    popularity30d: number;
    marketDemand: number;
    commissionRate: number;
    competitionScore: number;
    hashtagRelevance: number;
  };
}

/**
 * Calculates AI Product Opportunity Score (0-100)
 * Composition:
 * - 7-day trend growth: 25%
 * - 30-day popularity: 20%
 * - Market demand (sales velocity): 20%
 * - Affiliate commission rate: 15%
 * - Competition level (lower competition = higher score): 10%
 * - Hashtag relevance & momentum: 10%
 *
 * If data is missing, weights are proportionally normalized instead of zeroing out.
 * If data completeness < 75%, score is marked provisional.
 */
export function calculateProductOpportunityScore(input: OpportunityScoreInput): OpportunityScoreResult {
  let availableWeightSum = 0;
  let weightedScoreSum = 0;

  // 1. Trend growth 7d (weight 25%)
  let normGrowth = 50;
  if (input.growth7d !== null) {
    // Normalization: 0% growth = 50 pts, +50% growth = 100 pts, -50% = 0 pts
    normGrowth = Math.min(100, Math.max(0, Math.round(50 + input.growth7d)));
    availableWeightSum += 0.25;
    weightedScoreSum += normGrowth * 0.25;
  }

  // 2. Popularity 30d (weight 20%)
  let normPopularity = 50;
  if (input.popularity30d !== null) {
    normPopularity = Math.min(100, Math.max(0, input.popularity30d));
    availableWeightSum += 0.20;
    weightedScoreSum += normPopularity * 0.20;
  }

  // 3. Market demand / sold count (weight 20%)
  let normDemand = 50;
  if (input.soldCount !== null) {
    // 0 sold = 20, 10,000+ sold = 100 (log scale or stepped)
    if (input.soldCount >= 10000) normDemand = 95;
    else if (input.soldCount >= 5000) normDemand = 85;
    else if (input.soldCount >= 1000) normDemand = 75;
    else if (input.soldCount >= 200) normDemand = 60;
    else normDemand = 40;

    availableWeightSum += 0.20;
    weightedScoreSum += normDemand * 0.20;
  }

  // 4. Affiliate commission rate (weight 15%)
  let normCommission = 50;
  if (input.commissionRate !== null) {
    // 3% = 30 pts, 10% = 70 pts, 20%+ = 100 pts
    normCommission = Math.min(100, Math.max(0, Math.round((input.commissionRate / 20) * 100)));
    availableWeightSum += 0.15;
    weightedScoreSum += normCommission * 0.15;
  }

  // 5. Competition level (weight 10%) - Inverted: Low is better!
  let normCompetition = 50;
  if (input.competitionLevel !== null) {
    if (input.competitionLevel === 'Low Competition') normCompetition = 95;
    else if (input.competitionLevel === 'Medium Competition') normCompetition = 65;
    else normCompetition = 35;

    availableWeightSum += 0.10;
    weightedScoreSum += normCompetition * 0.10;
  }

  // 6. Hashtag relevance & momentum (weight 10%)
  let normHashtag = 50;
  if (input.hashtagScore !== null) {
    normHashtag = Math.min(100, Math.max(0, input.hashtagScore));
    availableWeightSum += 0.10;
    weightedScoreSum += normHashtag * 0.10;
  }

  const dataCompleteness = Math.round(availableWeightSum * 100);
  const isProvisional = dataCompleteness < 75;

  // Normalized final total
  const finalScore = availableWeightSum > 0
    ? Math.round(weightedScoreSum / availableWeightSum)
    : 50;

  let level: OpportunityScoreResult['level'] = 'Low Opportunity';
  if (finalScore >= 80) level = 'High Opportunity';
  else if (finalScore >= 65) level = 'Good Opportunity';
  else if (finalScore >= 50) level = 'Moderate Opportunity';

  return {
    total: finalScore,
    level,
    isProvisional,
    dataCompleteness,
    breakdown: {
      trendGrowth7d: normGrowth,
      popularity30d: normPopularity,
      marketDemand: normDemand,
      commissionRate: normCommission,
      competitionScore: normCompetition,
      hashtagRelevance: normHashtag,
    },
  };
}

/**
 * Affiliate Profit Calculator logic for 3 scenarios
 */
export function calculateProfitScenarios(
  price: number,
  commissionRate: number,
  clicks: number,
  baseConversionRate: number
): {
  commissionPerSale: number;
  scenarios: ProfitScenario[];
} {
  const commissionPerSale = Math.round(price * (commissionRate / 100));

  const configs: { name: ProfitScenario['name']; crMultiplier: number; roi: string }[] = [
    { name: 'Konservatif', crMultiplier: 0.6, roi: 'Est. Realistis saat konten biasa' },
    { name: 'Moderat', crMultiplier: 1.0, roi: 'Est. Standar creator dengan engagement baik' },
    { name: 'Optimistis', crMultiplier: 1.6, roi: 'Est. Konten masuk FYP / Live Flash Sale' },
  ];

  const scenarios: ProfitScenario[] = configs.map((cfg) => {
    const cr = Math.max(0.1, Math.round(baseConversionRate * cfg.crMultiplier * 10) / 10);
    const estimatedDailySales = Math.max(1, Math.round(clicks * (cr / 100)));
    const dailyRevenue = estimatedDailySales * commissionPerSale;
    const weeklyRevenue = dailyRevenue * 7;
    const monthlyRevenue = dailyRevenue * 30;

    return {
      name: cfg.name,
      conversionRate: cr,
      estimatedSales: estimatedDailySales,
      commissionPerSale,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      roiEstimate: cfg.roi,
    };
  });

  return {
    commissionPerSale,
    scenarios,
  };
}

/**
 * Format currency to Indonesian Rupiah (IDR)
 */
export function formatIDR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

/**
 * Format large numbers to compact notation (e.g. 12.4K, 1.5M)
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return value.toString();
}
