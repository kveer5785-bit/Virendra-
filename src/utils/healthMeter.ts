import { HealthMeterMetrics } from '../types/health';

interface HealthMeterInput {
  steps: number;
  stepGoal: number;
  caloriesConsumed: number;
  calorieBudget: number;
  caloriesBurnedActive: number;
  restingHeartRateBpm: number;
  hrvMs: number;
  sleepHours: number;
  waterIntakeMl: number;
  waterGoalMl: number;
}

export function calculateHealthMeter(input: HealthMeterInput): HealthMeterMetrics {
  const {
    steps,
    stepGoal,
    caloriesConsumed,
    calorieBudget,
    caloriesBurnedActive,
    restingHeartRateBpm,
    hrvMs,
    sleepHours,
    waterIntakeMl,
    waterGoalMl,
  } = input;

  // 1. Activity Score (weight: 30%)
  // Based on step completion ratio
  const stepRatio = Math.min(steps / Math.max(stepGoal, 1), 1.5);
  const activityScore = Math.min(Math.round(stepRatio * 85 + (stepRatio >= 1 ? 15 : 0)), 100);

  // 2. Nutrition & Calorie Score (weight: 25%)
  // Ideal is staying within ±10% of budget considering active burn
  const netCalories = caloriesConsumed - caloriesBurnedActive;
  const targetNet = calorieBudget - 350; // mild deficit or balance
  const calorieDiff = Math.abs(netCalories - targetNet);
  let nutritionScore = 100;
  if (calorieDiff > 700) {
    nutritionScore = Math.max(50, 100 - Math.round((calorieDiff - 700) / 15));
  } else if (calorieDiff > 300) {
    nutritionScore = Math.max(75, 100 - Math.round((calorieDiff - 300) / 16));
  }

  // 3. Cardio & HRV Score (weight: 20%)
  // Optimal resting HR is 50-68 bpm; optimal HRV is 45-85+ ms
  let cardioScore = 85;
  if (restingHeartRateBpm >= 50 && restingHeartRateBpm <= 65) {
    cardioScore += 10;
  } else if (restingHeartRateBpm > 75) {
    cardioScore -= Math.min(25, (restingHeartRateBpm - 75) * 2);
  }
  if (hrvMs >= 60) {
    cardioScore += 5;
  } else if (hrvMs < 35) {
    cardioScore -= 10;
  }
  cardioScore = Math.min(Math.max(cardioScore, 30), 100);

  // 4. Recovery & Sleep Score (weight: 15%)
  // Ideal sleep: 7.5 - 9.0 hours
  let recoveryScore = 70;
  if (sleepHours >= 7.5 && sleepHours <= 9.0) {
    recoveryScore = 95;
  } else if (sleepHours >= 6.5) {
    recoveryScore = 82;
  } else if (sleepHours < 6) {
    recoveryScore = Math.max(40, Math.round(sleepHours * 10));
  }

  // 5. Hydration Score (weight: 10%)
  const hydrationRatio = Math.min(waterIntakeMl / Math.max(waterGoalMl, 1), 1);
  const hydrationScore = Math.round(hydrationRatio * 100);

  // Composite calculation
  const composite = Math.round(
    activityScore * 0.30 +
    nutritionScore * 0.25 +
    cardioScore * 0.20 +
    recoveryScore * 0.15 +
    hydrationScore * 0.10
  );

  const overallScore = Math.min(Math.max(composite, 10), 100);

  // Determine Tier
  let tier: HealthMeterMetrics['tier'] = 'Good';
  if (overallScore >= 90) tier = 'Elite';
  else if (overallScore >= 78) tier = 'Optimal';
  else if (overallScore >= 60) tier = 'Good';
  else tier = 'Needs Attention';

  // Dynamic lifestyle and training guidance (non-medical estimations)
  const recommendations: string[] = [];

  if (steps < stepGoal) {
    const remainingSteps = stepGoal - steps;
    const estMins = Math.round(remainingSteps / 115);
    recommendations.push(`Walk ${remainingSteps.toLocaleString()} more steps (~${estMins} min stroll) to achieve your daily target.`);
  } else {
    recommendations.push(`Daily step goal achieved! Active recovery stretch recommended this evening.`);
  }

  if (waterIntakeMl < waterGoalMl) {
    const def = waterGoalMl - waterIntakeMl;
    recommendations.push(`Hydration is below your daily target. Drink ${def}ml of water before 8 PM.`);
  }

  if (restingHeartRateBpm <= 62) {
    recommendations.push(`Resting heart rate estimation (${restingHeartRateBpm} bpm) indicates good aerobic fitness.`);
  } else if (restingHeartRateBpm > 72) {
    recommendations.push(`Estimated heart rate is elevated (${restingHeartRateBpm} bpm). Consider light walking and recovery breathing.`);
  }

  if (sleepHours < 7.0) {
    recommendations.push(`Prioritize restful sleep tonight: your recovery index is lower than usual (${sleepHours}h recorded).`);
  }

  return {
    overallScore,
    tier,
    breakdown: {
      activityScore,
      nutritionScore,
      cardioScore,
      recoveryScore,
      hydrationScore,
    },
    restingHeartRateBpm,
    hrvMs,
    sleepHours,
    sleepQualityPercent: Math.min(Math.round((sleepHours / 8.0) * 94), 98),
    waterIntakeMl,
    recommendations: recommendations.slice(0, 3),
  };
}
