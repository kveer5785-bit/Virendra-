/**
 * PulseFit Core Domain Types
 */

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  dailyStepGoal: number;
  dailyCalorieBudget: number;
  dailyWaterGoalMl: number;
  activeWearableId: string;
}

export interface HourlyStepRecord {
  hour: number; // 0 to 23
  steps: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  steps: number;
  stepGoal: number;
  distanceKm: number;
  activeMinutes: number;
  activeCaloriesBurned: number;
  hourlySteps: HourlyStepRecord[];
  isLiveTracking: boolean;
  cadenceSpm: number;
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
  focusArea: 'Step & Cardio Optimization' | 'Calorie Deficit & Macros' | 'Wearable Data Review' | 'Recovery & Sleep' | 'Comprehensive Health Check';
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  patientNotes: string;
  includeHealthVitals: boolean;
  meetingLink?: string;
  createdAt: string;
}

export type ActiveTab = 'dashboard' | 'steps' | 'calories' | 'appointments' | 'wearables';
