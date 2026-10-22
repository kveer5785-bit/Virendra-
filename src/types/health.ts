/**
 * PulseFit Core Domain Types
 */

export interface AdSenseConfig {
  publisherId: string; // e.g. "ca-pub-1234567890123456"
  leaderboardSlotId: string;
  articleSlotId: string;
  sidebarSlotId: string;
  enableAutoAds: boolean;
  testMode: boolean; // default true for safe preview
  adUnitsEnabled: boolean; // master toggle
}

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  dailyStepGoal: number;
  dailyCalorieBudget: number;
  dailyWaterGoalMl: number;
  activeWearableId: string;
  gaMeasurementId?: string;
  adsenseConfig?: AdSenseConfig;
}

export interface HourlyStepRecord {
  hour: number; // 0 to 23
  steps: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD in local time
  steps: number;
  stepGoal: number;
  distanceKm: number;
  activeMinutes: number;
  activeCaloriesBurned: number;
  hourlySteps: HourlyStepRecord[];
  isLiveTracking: boolean;
  cadenceSpm: number;
}

export interface DayHistoryRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  steps: number;
  stepGoal: number;
  distanceKm: number;
  activeCalories: number;
  caloriesConsumed: number;
  waterIntakeMl: number;
  vitalityScore: number;
  completed: boolean;
}

export interface HealthMeterMetrics {
  overallScore: number; // 0 - 100
  tier: 'Elite' | 'Optimal' | 'Good' | 'Needs Attention';
  breakdown: {
    activityScore: number;      // 0 - 100
    nutritionScore: number;     // 0 - 100
    cardioScore: number;        // 0 - 100
    recoveryScore: number;      // 0 - 100
    hydrationScore: number;     // 0 - 100
  };
  restingHeartRateBpm: number;
  hrvMs: number;
  sleepHours: number;
  sleepQualityPercent: number;
  waterIntakeMl: number;
  recommendations: string[];
}

export interface FoodItem {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  timeLogged: string;
}

export interface CalorieData {
  budgetKcal: number;
  meals: FoodItem[];
  waterIntakeMl: number;
}

export type WearableType = 'apple_watch' | 'galaxy_watch' | 'pixel_watch' | 'garmin' | 'whoop' | 'fitbit' | 'ble_sensor';

export interface WearableDevice {
  id: string;
  name: string;
  model: string;
  type: WearableType;
  platform: 'ios' | 'android' | 'cross_platform';
  batteryLevel: number;
  lastSync: string;
  status: 'connected' | 'syncing' | 'disconnected';
  syncedMetrics: string[];
  firmwareVersion: string;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  credentials: string;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  slots: string[];
  consultationFee: string;
  avatarColor: string;
  bio: string;
}

export interface HealthAppointment {
  id: string;
  specialistId: string;
  specialistName: string;
  specialistTitle: string;
  consultationType: 'video' | 'in_person' | 'wearable_review';
  focusArea: 'Step & Cardio Optimization' | 'Calorie Deficit & Macros' | 'Wearable Data Review' | 'Recovery & Sleep' | 'Comprehensive Fitness Assessment';
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  patientNotes: string;
  includeHealthVitals: boolean;
  meetingLink?: string;
  createdAt: string;
}

export interface FitnessArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Movement' | 'Nutrition' | 'Recovery' | 'Wearables';
  readTime: string;
  summary: string;
  publishedDate: string;
  content: string[];
  actionableTakeaways: string[];
  author: string;
}

export interface ExerciseRoutine {
  id: string;
  title: string;
  subtitle: string;
  category: 'Cardio' | 'Metabolic' | 'Mobility' | 'Strength' | 'Recovery';
  durationMins: number;
  intensity: 'Low' | 'Moderate' | 'High';
  targetHeartRateZone: string;
  caloriesBurnEstimate: number;
  stepsEstimate: number;
  primaryBenefit: string;
  scientificRationale: string;
  intervals: {
    name: string;
    durationSecs: number;
    instruction: string;
    formCue: string;
  }[];
}

export interface LoggedWorkout {
  id: string;
  routineTitle: string;
  category: string;
  durationMins: number;
  caloriesBurned: number;
  stepsContributed: number;
  completedAt: string;
  intensity: 'Low' | 'Moderate' | 'High';
}

export type ActiveTab =
  | 'dashboard'
  | 'steps'
  | 'exercises'
  | 'weekly'
  | 'calories'
  | 'appointments'
  | 'wearables'
  | 'education'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'disclaimer'
  | 'terms';

