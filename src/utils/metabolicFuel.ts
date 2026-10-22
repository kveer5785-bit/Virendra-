/**
 * PulseFit Metabolic Fuel Partitioning Engine
 * Calculates estimated lipid (fat) vs glycogen (carbohydrate) substrate oxidation
 * based on exercise physiology crossover concepts and walking cadence intensity.
 */

export interface FuelPartitioning {
  fatPercent: number;        // e.g. 68%
  carbPercent: number;       // e.g. 32%
  fatGramsBurned: number;    // e.g. 26.8g
  carbGramsBurned: number;   // e.g. 28.3g
  fatCalories: number;       // kcal
  carbCalories: number;      // kcal
  aerobicZone: 'Low Zone 1 (Lipid Dominant)' | 'Zone 2 (Aerobic Fat Max)' | 'Zone 3 (Glycolytic Shift)';
  physiologicalInsight: string;
}

export function calculateFuelPartitioning(
  activeCaloriesBurned: number,
  cadenceSpm = 115
): FuelPartitioning {
  if (activeCaloriesBurned <= 0) {
    return {
      fatPercent: 70,
      carbPercent: 30,
      fatGramsBurned: 0,
      carbGramsBurned: 0,
      fatCalories: 0,
      carbCalories: 0,
      aerobicZone: 'Zone 2 (Aerobic Fat Max)',
      physiologicalInsight: 'Start walking to activate lipid oxidation and muscle glucose uptake.',
    };
  }

  // Determine substrate partitioning ratio based on cadence intensity
  let fatRatio = 0.65;
  let zone: FuelPartitioning['aerobicZone'] = 'Zone 2 (Aerobic Fat Max)';
  let insight = 'Moderate brisk walking (105-120 SPM) sits near FatMax, where skeletal muscle oxidizes primarily free fatty acids.';

  if (cadenceSpm < 100) {
    fatRatio = 0.72; // Very gentle stroll, low glycolytic flux
    zone = 'Low Zone 1 (Lipid Dominant)';
    insight = 'Gentle recovery walking utilizes circulating plasma fatty acids with minimal lactate accumulation.';
  } else if (cadenceSpm >= 100 && cadenceSpm <= 125) {
    fatRatio = 0.64; // Brisk walk / power walk
    zone = 'Zone 2 (Aerobic Fat Max)';
    insight = 'Brisk aerobic cadence optimizes mitochondrial fat oxidation while promoting post-meal glucose clearance.';
  } else {
    fatRatio = 0.48; // Fast jog or running cadence, glycolytic shift
    zone = 'Zone 3 (Glycolytic Shift)';
    insight = 'Higher cadence stimulates glycolytic pathways, increasing carbohydrate burn per minute over fat oxidation.';
  }

  const carbRatio = 1 - fatRatio;
  const fatKcal = activeCaloriesBurned * fatRatio;
  const carbKcal = activeCaloriesBurned * carbRatio;

  // 1g of fat = 9 kcal; 1g of carbohydrate = 4 kcal
  const fatGrams = Number((fatKcal / 9).toFixed(1));
  const carbGrams = Number((carbKcal / 4).toFixed(1));

  return {
    fatPercent: Math.round(fatRatio * 100),
    carbPercent: Math.round(carbRatio * 100),
    fatGramsBurned: fatGrams,
    carbGramsBurned: carbGrams,
    fatCalories: Math.round(fatKcal),
    carbCalories: Math.round(carbKcal),
    aerobicZone: zone,
    physiologicalInsight: insight,
  };
}
