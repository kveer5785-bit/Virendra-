/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  UserProfile,
  DailyActivity,
  FoodItem,
  WearableDevice,
  Specialist,
  HealthAppointment,
  ActiveTab,
  DayHistoryRecord,
} from './types/health';
import {
  INITIAL_USER_PROFILE,
  INITIAL_ACTIVITY,
  INITIAL_MEALS,
  INITIAL_WEARABLES,
  INITIAL_SPECIALISTS,
  INITIAL_APPOINTMENTS,
  INITIAL_LOGGED_WORKOUTS,
  getLocalTodayDateString,
  generateInitialWeeklyHistory,
} from './utils/initialData';
import { calculateHealthMeter } from './utils/healthMeter';
import { PedometerEngine } from './utils/pedometer';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { DashboardView } from './components/DashboardView';
import { StepCounterView } from './components/StepCounterView';
import { WeeklyProgressView } from './components/WeeklyProgressView';
import { CalorieTrackerView } from './components/CalorieTrackerView';
import { ExerciseView } from './components/ExerciseView';
import { AppointmentsView } from './components/AppointmentsView';
import { WearablesSyncView } from './components/WearablesSyncView';
import { FitnessEducationView } from './components/FitnessEducationView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { DisclaimerView } from './components/DisclaimerView';
import { TermsOfServiceView } from './components/TermsOfServiceView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { StorageExplanationModal } from './components/StorageExplanationModal';
import { AnalyticsAndSeoModal } from './components/AnalyticsAndSeoModal';
import { CadencePacerModal } from './components/CadencePacerModal';
import { PostMealWalkModal } from './components/PostMealWalkModal';
import { AdSenseBanner } from './components/AdSenseBanner';
import { AdSenseManagerModal } from './components/AdSenseManagerModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { Footer } from './components/Footer';
import { AdSenseConfig, LoggedWorkout } from './types/health';
import { Wifi, Battery, CheckCircle, Info, Calendar, Sparkles, Gauge, Timer, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'pulsefit_app_data_v2';

export default function App() {
  // 1. Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.adsenseConfig || !parsed.adsenseConfig.publisherId) {
          parsed.adsenseConfig = {
            ...(INITIAL_USER_PROFILE.adsenseConfig || {}),
            ...(parsed.adsenseConfig || {}),
            publisherId: INITIAL_USER_PROFILE.adsenseConfig?.publisherId || 'ca-pub-3718193681856121',
          };
        }
        return parsed;
      }
      return INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  // 2. Activity State (Daily)
  const [activity, setActivity] = useState<DailyActivity>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Date check: ensure we retain date integrity
        return parsed;
      }
      return INITIAL_ACTIVITY;
    } catch {
      return INITIAL_ACTIVITY;
    }
  });

  // 3. Weekly History State (Past days)
  const [weeklyHistory, setWeeklyHistory] = useState<DayHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_history`);
      return saved ? JSON.parse(saved) : generateInitialWeeklyHistory();
    } catch {
      return generateInitialWeeklyHistory();
    }
  });

  // 4. Meals State
  const [meals, setMeals] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_meals`);
      return saved ? JSON.parse(saved) : INITIAL_MEALS;
    } catch {
      return INITIAL_MEALS;
    }
  });

  // 5. Water Intake State
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_water`);
      return saved ? JSON.parse(saved) : 1850;
    } catch {
      return 1850;
    }
  });

  // 6. Wearables State
  const [wearables, setWearables] = useState<WearableDevice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wearables`);
      return saved ? JSON.parse(saved) : INITIAL_WEARABLES;
    } catch {
      return INITIAL_WEARABLES;
    }
  });

  // 7. Appointments State
  const [appointments, setAppointments] = useState<HealthAppointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // 8. Logged Workouts State
  const [loggedWorkouts, setLoggedWorkouts] = useState<LoggedWorkout[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_workouts`);
      return saved ? JSON.parse(saved) : INITIAL_LOGGED_WORKOUTS;
    } catch {
      return INITIAL_LOGGED_WORKOUTS;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [deviceFrame, setDeviceFrame] = useState<'iphone' | 'pixel' | 'fullscreen'>('fullscreen');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isCadenceModalOpen, setIsCadenceModalOpen] = useState(false);
  const [isPostMealModalOpen, setIsPostMealModalOpen] = useState(false);
  const [isAdSenseModalOpen, setIsAdSenseModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Pedometer Motion Engine ref
  const pedometerRef = useRef<PedometerEngine>(new PedometerEngine(activity.steps));

  // Sync Pedometer engine initial steps
  useEffect(() => {
    pedometerRef.current.setStepCount(activity.steps);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // -------------------------------------------------------------
  // Automatic Daily Reset at Local Midnight
  // -------------------------------------------------------------
  const checkAndPerformDailyReset = useCallback(() => {
    const currentLocalDate = getLocalTodayDateString();

    if (activity.date && activity.date !== currentLocalDate) {
      // 1. Archive yesterday's data into weekly history
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const pastDateObj = new Date(activity.date + 'T12:00:00');
      const dayLabel = isNaN(pastDateObj.getDay()) ? 'Day' : dayNames[pastDateObj.getDay()];

      const yesterdayRecord: DayHistoryRecord = {
        date: activity.date,
        dayLabel,
        steps: activity.steps,
        stepGoal: activity.stepGoal,
        distanceKm: activity.distanceKm,
        activeCalories: activity.activeCaloriesBurned,
        caloriesConsumed: meals.reduce((sum, m) => sum + m.calories, 0),
        waterIntakeMl,
        vitalityScore: Math.min(Math.round((activity.steps / activity.stepGoal) * 100), 100),
        completed: activity.steps >= activity.stepGoal,
      };

      setWeeklyHistory((prev) => {
        const filtered = prev.filter((h) => h.date !== activity.date);
        return [...filtered.slice(-13), yesterdayRecord];
      });

      // 2. Start fresh day activity
      const resetActivity: DailyActivity = {
        date: currentLocalDate,
        steps: 0,
        stepGoal: userProfile.dailyStepGoal,
        distanceKm: 0,
        activeMinutes: 0,
        activeCaloriesBurned: 0,
        hourlySteps: [{ hour: new Date().getHours(), steps: 0 }],
        isLiveTracking: false,
        cadenceSpm: 0,
      };

      pedometerRef.current.setStepCount(0);
      setActivity(resetActivity);
      setMeals([]);
      setWaterIntakeMl(0);

      showToast(`Welcome to a new day (${currentLocalDate})! Yesterday's metrics were saved to Weekly Trends.`);
    }
  }, [activity, meals, waterIntakeMl, userProfile.dailyStepGoal, showToast]);

  // Check on mount and on tab focus/visibility change
  useEffect(() => {
    checkAndPerformDailyReset();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAndPerformDailyReset();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    const interval = setInterval(checkAndPerformDailyReset, 60000); // Check once per minute

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [checkAndPerformDailyReset]);

  // -------------------------------------------------------------
  // LocalStorage Persistence
  // -------------------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(userProfile));
      localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(activity));
      localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(weeklyHistory));
      localStorage.setItem(`${STORAGE_KEY}_meals`, JSON.stringify(meals));
      localStorage.setItem(`${STORAGE_KEY}_water`, JSON.stringify(waterIntakeMl));
      localStorage.setItem(`${STORAGE_KEY}_wearables`, JSON.stringify(wearables));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_workouts`, JSON.stringify(loggedWorkouts));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [userProfile, activity, weeklyHistory, meals, waterIntakeMl, wearables, appointments, loggedWorkouts]);

  // -------------------------------------------------------------
  // Dynamic SEO Page Title & Canonical Hook
  // -------------------------------------------------------------
  useEffect(() => {
    const titles: Record<ActiveTab, string> = {
      dashboard: 'PulseFit - Health Vitality & Daily Step Tracker',
      steps: 'Daily Step Counter & Live Pedometer - PulseFit',
      exercises: 'Targeted Health Promotion & Clinical Workouts - PulseFit',
      weekly: '7-Day Weekly Movement Trends & Consistency - PulseFit',
      calories: 'Calorie Deficit & Macro Tracker - PulseFit',
      wearables: 'Wearable Sync Gateway (Apple Watch & Wear OS) - PulseFit',
      education: 'Evidence-Based Fitness & Movement Science - PulseFit',
      appointments: 'Fitness Coaching & Movement Consultations - PulseFit',
      about: 'About PulseFit - Privacy-First Fitness Companion',
      contact: 'Contact Support & Feedback - PulseFit',
      privacy: 'Privacy Policy & Local Data Commitment - PulseFit',
      disclaimer: 'Non-Medical Health & Fitness Disclaimer - PulseFit',
      terms: 'Terms of Service & User Agreement - PulseFit',
    };

    document.title = titles[activeTab] || 'PulseFit - Health & Step Tracker';
  }, [activeTab]);

  // -------------------------------------------------------------
  // Optional Privacy-Preserving GA4 Injection
  // -------------------------------------------------------------
  useEffect(() => {
    const gaId =
      userProfile.gaMeasurementId ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID);

    if (gaId && gaId.startsWith('G-') && typeof window !== 'undefined') {
      const existingScript = document.getElementById('ga4-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'ga4-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        const inline = document.createElement('script');
        inline.id = 'ga4-inline-config';
        inline.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            'anonymize_ip': true,
            'allow_ad_personalization_signals': false,
            'allow_google_signals': false
          });
        `;
        document.head.appendChild(inline);
      }
    }
  }, [userProfile.gaMeasurementId]);

  // Compute composite Health Meter Score
  const totalCaloriesConsumed = useMemo(() => {
    return meals.reduce((sum, m) => sum + m.calories, 0);
  }, [meals]);

  const healthMeterMetrics = useMemo(() => {
    return calculateHealthMeter({
      steps: activity.steps,
      stepGoal: activity.stepGoal,
      caloriesConsumed: totalCaloriesConsumed,
      calorieBudget: userProfile.dailyCalorieBudget,
      caloriesBurnedActive: activity.activeCaloriesBurned,
      restingHeartRateBpm: 58,
      hrvMs: 64,
      sleepHours: 7.8,
      waterIntakeMl,
      waterGoalMl: userProfile.dailyWaterGoalMl,
    });
  }, [activity.steps, activity.stepGoal, totalCaloriesConsumed, userProfile, activity.activeCaloriesBurned, waterIntakeMl]);

  // Step Update Handler
  const handleUpdateSteps = (newSteps: number, isLive = false) => {
    const distanceKm = PedometerEngine.calculateDistanceKm(newSteps);
    const activeCaloriesBurned = PedometerEngine.calculateCaloriesBurned(newSteps, userProfile.weightKg);
    const activeMinutes = Math.round(newSteps / 110);

    const currentHour = new Date().getHours();
    const updatedHourly = [...activity.hourlySteps];
    const existingIndex = updatedHourly.findIndex((h) => h.hour === currentHour);

    if (existingIndex >= 0) {
      const diff = Math.max(0, newSteps - activity.steps);
      updatedHourly[existingIndex].steps += diff;
    } else {
      updatedHourly.push({ hour: currentHour, steps: 150 });
    }

    setActivity((prev) => ({
      ...prev,
      steps: newSteps,
      distanceKm,
      activeCaloriesBurned,
      activeMinutes,
      hourlySteps: updatedHourly,
      isLiveTracking: isLive,
      cadenceSpm: isLive ? 122 : prev.cadenceSpm,
    }));
  };

  const handleUpdateStepGoal = (newGoal: number) => {
    setActivity((prev) => ({ ...prev, stepGoal: newGoal }));
    setUserProfile((prev) => ({ ...prev, dailyStepGoal: newGoal }));
    showToast(`Daily step goal updated to ${newGoal.toLocaleString()} steps!`);
  };

  const handleAddSteps = useCallback((stepDelta: number) => {
    setActivity((prev) => {
      const newSteps = prev.steps + stepDelta;
      const distanceKm = PedometerEngine.calculateDistanceKm(newSteps);
      const activeCaloriesBurned = PedometerEngine.calculateCaloriesBurned(newSteps, userProfile.weightKg);
      const activeMinutes = Math.round(newSteps / 110);

      const currentHour = new Date().getHours();
      const updatedHourly = [...prev.hourlySteps];
      const existingIndex = updatedHourly.findIndex((h) => h.hour === currentHour);

      if (existingIndex >= 0) {
        updatedHourly[existingIndex] = {
          ...updatedHourly[existingIndex],
          steps: updatedHourly[existingIndex].steps + stepDelta,
        };
      } else {
        updatedHourly.push({ hour: currentHour, steps: stepDelta });
      }

      return {
        ...prev,
        steps: newSteps,
        distanceKm,
        activeCaloriesBurned,
        activeMinutes,
        hourlySteps: updatedHourly,
      };
    });
    pedometerRef.current.setStepCount(pedometerRef.current.getStepCount() + stepDelta);
  }, [userProfile.weightKg]);

  const handleAddWorkout = (workout: Omit<LoggedWorkout, 'id' | 'completedAt'>) => {
    const item: LoggedWorkout = {
      ...workout,
      id: `wk_${Date.now()}`,
      completedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLoggedWorkouts((prev) => [item, ...prev]);
    showToast(`Logged "${item.routineTitle}" (+${item.caloriesBurned} kcal)`);
  };

  // Meal Handlers
  const handleAddMeal = (newMeal: Omit<FoodItem, 'id' | 'timeLogged'>) => {
    const now = new Date();
    const timeLogged = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const item: FoodItem = {
      ...newMeal,
      id: `meal_${Date.now()}`,
      timeLogged,
    };
    setMeals((prev) => [item, ...prev]);
    showToast(`Logged "${item.name}" (+${item.calories} kcal)`);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
    showToast('Meal removed from daily diary');
  };

  const handleAddWater = (ml: number) => {
    setWaterIntakeMl((prev) => prev + ml);
    showToast(`Added +${ml}ml hydration!`);
  };

  // Appointment Handlers
  const handleBookAppointment = (aptData: Omit<HealthAppointment, 'id' | 'createdAt'>) => {
    const created: HealthAppointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [created, ...prev]);
    showToast(`Consultation confirmed with ${created.specialistName}`);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Appointment cancelled');
  };

  // Wearable Sync Handlers
  const handleSelectActiveWearable = (id: string) => {
    setUserProfile((prev) => ({ ...prev, activeWearableId: id }));
    showToast('Primary wearable gateway changed');
  };

  const handleSyncAllWearables = async () => {
    setIsSyncing(true);
    await new Promise((r) => setTimeout(r, 1100));

    // Simulate pulling fresh telemetry from wearable
    const additionalSteps = 160;
    const additionalBurn = 7;
    const newSteps = activity.steps + additionalSteps;
    pedometerRef.current.setStepCount(newSteps);
    handleUpdateSteps(newSteps);

    setWearables((prev) =>
      prev.map((w) => ({
        ...w,
        lastSync: 'Just now',
        status: 'connected',
      }))
    );

    setIsSyncing(false);
    showToast(`Synced with ${activeWearable.name}: +${additionalSteps} steps & +${additionalBurn} kcal updated`);
  };

  const handleTriggerDeviceSync = () => {
    handleSyncAllWearables();
  };

  // -------------------------------------------------------------
  // Data Export & Restore Handlers (Requirement #2)
  // -------------------------------------------------------------
  const handleExportData = () => {
    const backupObj = {
      version: 2,
      exportedAt: new Date().toISOString(),
      userProfile,
      activity,
      weeklyHistory,
      meals,
      waterIntakeMl,
      wearables,
      appointments,
      loggedWorkouts,
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PulseFit-Backup-${getLocalTodayDateString()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Backup file downloaded to your device!');
  };

  const handleImportData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.userProfile || !parsed.activity) {
        return false;
      }

      setUserProfile(parsed.userProfile);
      setActivity(parsed.activity);
      if (parsed.weeklyHistory) setWeeklyHistory(parsed.weeklyHistory);
      if (parsed.meals) setMeals(parsed.meals);
      if (typeof parsed.waterIntakeMl === 'number') setWaterIntakeMl(parsed.waterIntakeMl);
      if (parsed.wearables) setWearables(parsed.wearables);
      if (parsed.appointments) setAppointments(parsed.appointments);
      if (parsed.loggedWorkouts) setLoggedWorkouts(parsed.loggedWorkouts);

      pedometerRef.current.setStepCount(parsed.activity.steps || 0);
      showToast('Data restored successfully!');
      return true;
    } catch (e) {
      console.warn('Backup import parsing failed:', e);
      return false;
    }
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setUserProfile(INITIAL_USER_PROFILE);
    setActivity(INITIAL_ACTIVITY);
    setWeeklyHistory(generateInitialWeeklyHistory());
    setMeals(INITIAL_MEALS);
    setWaterIntakeMl(1850);
    setWearables(INITIAL_WEARABLES);
    setAppointments(INITIAL_APPOINTMENTS);
    setLoggedWorkouts(INITIAL_LOGGED_WORKOUTS);
    pedometerRef.current.setStepCount(INITIAL_ACTIVITY.steps);
    showToast('All local storage reset to defaults.');
  };

  const handleSaveGaMeasurementId = (id: string) => {
    setUserProfile((prev) => ({ ...prev, gaMeasurementId: id }));
    showToast(id ? 'GA4 Measurement ID saved!' : 'Analytics disabled.');
  };

  const handleSaveAdSenseConfig = (updated: AdSenseConfig) => {
    setUserProfile((prev) => ({ ...prev, adsenseConfig: updated }));
    showToast(updated.publisherId ? `AdSense saved for ${updated.publisherId}!` : 'AdSense configuration saved!');
  };

  const activeWearable = wearables.find((w) => w.id === userProfile.activeWearableId) || wearables[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Bar with Full Responsive Drawer */}
      <Header
        activeWearable={activeWearable}
        deviceFrame={deviceFrame}
        activeTab={activeTab}
        onChangeFrame={setDeviceFrame}
        onSelectTab={setActiveTab}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenStorageModal={() => setIsStorageModalOpen(true)}
        onOpenSeoModal={() => setIsSeoModalOpen(true)}
        onOpenAdSenseModal={() => setIsAdSenseModalOpen(true)}
        onQuickSync={handleSyncAllWearables}
        isSyncing={isSyncing}
      />

      {/* Main Container Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-semibold text-xs shadow-2xl animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* CONTAINER SWITCHER: Mobile Device Mockup Frame vs Fullscreen Responsive */}
        {deviceFrame === 'iphone' ? (
          /* iPhone 16 Pro Device Frame */
          <div className="w-full max-w-[420px] bg-slate-950 rounded-[52px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col min-h-[850px] my-2 ring-1 ring-slate-700/50">
            {/* Dynamic Island & Speaker */}
            <div className="pt-3 pb-2 px-6 flex items-center justify-between z-30 select-none bg-slate-950">
              <span className="text-[12px] font-semibold tracking-tight text-white font-mono">
                9:41
              </span>

              {/* Dynamic Island capsule */}
              <div className="w-28 h-6 bg-black rounded-full flex items-center justify-center gap-1.5 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                <div className="w-2 h-2 rounded-full bg-cyan-500/80 animate-pulse" />
              </div>

              <div className="flex items-center gap-1.5 text-white">
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable Mobile Screen Content */}
            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24 space-y-4">
              {activeTab === 'dashboard' && (
                <DashboardView
                  activity={activity}
                  metrics={healthMeterMetrics}
                  budgetKcal={userProfile.dailyCalorieBudget}
                  meals={meals}
                  wearables={wearables}
                  activeWearableId={userProfile.activeWearableId}
                  appointments={appointments}
                  adsenseConfig={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                  onNavigateTab={setActiveTab}
                  onQuickSync={handleSyncAllWearables}
                  onOpenCadencePacer={() => setIsCadenceModalOpen(true)}
                  onOpenPostMealWalk={() => setIsPostMealModalOpen(true)}
                />
              )}

              {activeTab === 'steps' && (
                <StepCounterView
                  activity={activity}
                  onUpdateSteps={handleUpdateSteps}
                  onUpdateStepGoal={handleUpdateStepGoal}
                  pedometer={pedometerRef.current}
                  onOpenCadencePacer={() => setIsCadenceModalOpen(true)}
                  onOpenPostMealWalk={() => setIsPostMealModalOpen(true)}
                />
              )}

              {activeTab === 'weekly' && (
                <WeeklyProgressView
                  history={weeklyHistory}
                  todayActivity={activity}
                />
              )}

              {activeTab === 'calories' && (
                <CalorieTrackerView
                  budgetKcal={userProfile.dailyCalorieBudget}
                  activeBurnedKcal={activity.activeCaloriesBurned}
                  meals={meals}
                  waterIntakeMl={waterIntakeMl}
                  waterGoalMl={userProfile.dailyWaterGoalMl}
                  adsenseConfig={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                  onAddMeal={handleAddMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onAddWater={handleAddWater}
                />
              )}

              {activeTab === 'exercises' && (
                <ExerciseView
                  activity={activity}
                  userWeightKg={userProfile.weightKg}
                  loggedWorkouts={loggedWorkouts}
                  onAddWorkout={handleAddWorkout}
                  onAddSteps={handleAddSteps}
                  adsenseConfig={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                />
              )}

              {activeTab === 'wearables' && (
                <WearablesSyncView
                  wearables={wearables}
                  activeWearableId={userProfile.activeWearableId}
                  onSelectActiveWearable={handleSelectActiveWearable}
                  onSyncAll={handleSyncAllWearables}
                  onTriggerDeviceSync={handleTriggerDeviceSync}
                />
              )}

              {activeTab === 'education' && (
                <FitnessEducationView
                  config={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsView
                  specialists={INITIAL_SPECIALISTS}
                  appointments={appointments}
                  metrics={healthMeterMetrics}
                  activity={activity}
                  onBookAppointment={handleBookAppointment}
                  onCancelAppointment={handleCancelAppointment}
                />
              )}

              {activeTab === 'about' && <AboutView />}
              {activeTab === 'contact' && <ContactView />}
              {activeTab === 'privacy' && <PrivacyPolicyView />}
              {activeTab === 'terms' && <TermsOfServiceView />}
              {activeTab === 'disclaimer' && <DisclaimerView />}
            </div>

            {/* Bottom Tab Bar for Mobile Frame */}
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} isInsideFrame={true} />

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full z-50 pointer-events-none" />
          </div>
        ) : deviceFrame === 'pixel' ? (
          /* Pixel 9 Pro Device Frame */
          <div className="w-full max-w-[420px] bg-slate-950 rounded-[44px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col min-h-[850px] my-2 ring-1 ring-slate-700/50">
            {/* Pixel Status Bar & Camera Punch-hole */}
            <div className="pt-2.5 pb-2 px-6 flex items-center justify-between z-30 select-none bg-slate-950">
              <span className="text-[12px] font-semibold text-white font-mono">10:00</span>

              {/* Centered Camera Cutout */}
              <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800" />

              <div className="flex items-center gap-1.5 text-white">
                <span className="text-[10px] font-mono">5G</span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24 space-y-4">
              {activeTab === 'dashboard' && (
                <DashboardView
                  activity={activity}
                  metrics={healthMeterMetrics}
                  budgetKcal={userProfile.dailyCalorieBudget}
                  meals={meals}
                  wearables={wearables}
                  activeWearableId={userProfile.activeWearableId}
                  appointments={appointments}
                  adsenseConfig={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                  onNavigateTab={setActiveTab}
                  onQuickSync={handleSyncAllWearables}
                  onOpenCadencePacer={() => setIsCadenceModalOpen(true)}
                  onOpenPostMealWalk={() => setIsPostMealModalOpen(true)}
                />
              )}

              {activeTab === 'steps' && (
                <StepCounterView
                  activity={activity}
                  onUpdateSteps={handleUpdateSteps}
                  onUpdateStepGoal={handleUpdateStepGoal}
                  pedometer={pedometerRef.current}
                  onOpenCadencePacer={() => setIsCadenceModalOpen(true)}
                  onOpenPostMealWalk={() => setIsPostMealModalOpen(true)}
                />
              )}

              {activeTab === 'weekly' && (
                <WeeklyProgressView
                  history={weeklyHistory}
                  todayActivity={activity}
                />
              )}

              {activeTab === 'calories' && (
                <CalorieTrackerView
                  budgetKcal={userProfile.dailyCalorieBudget}
                  activeBurnedKcal={activity.activeCaloriesBurned}
                  meals={meals}
                  waterIntakeMl={waterIntakeMl}
                  waterGoalMl={userProfile.dailyWaterGoalMl}
                  adsenseConfig={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                  onAddMeal={handleAddMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onAddWater={handleAddWater}
                />
              )}

              {activeTab === 'exercises' && (
                <ExerciseView
                  activity={activity}
                  userWeightKg={userProfile.weightKg}
                  loggedWorkouts={loggedWorkouts}
                  onAddWorkout={handleAddWorkout}
                  onAddSteps={handleAddSteps}
                  adsenseConfig={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                />
              )}

              {activeTab === 'wearables' && (
                <WearablesSyncView
                  wearables={wearables}
                  activeWearableId={userProfile.activeWearableId}
                  onSelectActiveWearable={handleSelectActiveWearable}
                  onSyncAll={handleSyncAllWearables}
                  onTriggerDeviceSync={handleTriggerDeviceSync}
                />
              )}

              {activeTab === 'education' && (
                <FitnessEducationView
                  config={userProfile.adsenseConfig}
                  onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsView
                  specialists={INITIAL_SPECIALISTS}
                  appointments={appointments}
                  metrics={healthMeterMetrics}
                  activity={activity}
                  onBookAppointment={handleBookAppointment}
                  onCancelAppointment={handleCancelAppointment}
                />
              )}

              {activeTab === 'about' && <AboutView />}
              {activeTab === 'contact' && <ContactView />}
              {activeTab === 'privacy' && <PrivacyPolicyView />}
              {activeTab === 'terms' && <TermsOfServiceView />}
              {activeTab === 'disclaimer' && <DisclaimerView />}
            </div>

            {/* Bottom Tab Bar */}
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} isInsideFrame={true} />

            {/* Android Navigation Gesture Line */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-500 rounded-full z-50 pointer-events-none" />
          </div>
        ) : (
          /* Responsive Fullscreen Website View for Chrome & Desktop/Mobile Browsers */
          <div className="w-full max-w-6xl mx-auto pb-16 pt-2 space-y-6">
            {/* Chrome Web Portal Header Ribbon */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                      Chrome Web Portal · Client-Side Execution
                    </span>
                    <span className="text-slate-600 hidden sm:inline">·</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">100% Private Local Storage</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                    PulseFit Health & Movement Portal
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time pedometer tracking, metabolic substrate partitioning, and wearable telemetry sync running natively in your browser.
                  </p>
                </div>

                {/* Quick Action Pills for Chrome Desktop */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCadenceModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center gap-2 min-h-[44px]"
                  >
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <span>Cadence Pacer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPostMealModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-2 min-h-[44px]"
                  >
                    <Timer className="w-4 h-4 text-emerald-400" />
                    <span>Post-Meal Stroll</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncAllWearables}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 min-h-[44px]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>Sync Vitals</span>
                  </button>
                </div>
              </div>

              {/* Quick Web Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium uppercase">Active Date</span>
                  <span className="text-white font-mono font-bold mt-0.5">{activity.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium uppercase">Step Goal Progress</span>
                  <span className="text-emerald-400 font-mono font-bold mt-0.5">
                    {activity.steps.toLocaleString()} / {activity.stepGoal.toLocaleString()} (
                    {Math.min(Math.round((activity.steps / activity.stepGoal) * 100), 100)}%)
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium uppercase">Vitality Score</span>
                  <span className="text-cyan-400 font-mono font-bold mt-0.5">{healthMeterMetrics.overallScore}/100</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-medium uppercase">Active Gateway</span>
                  <span className="text-slate-200 font-mono font-bold mt-0.5 truncate">{activeWearable.name}</span>
                </div>
              </div>
            </div>

            {/* Responsive Leaderboard AdSense Unit */}
            <AdSenseBanner
              format="leaderboard"
              config={userProfile.adsenseConfig}
              onOpenAdManager={() => setIsAdSenseModalOpen(true)}
            />

            {activeTab === 'dashboard' && (
              <DashboardView
                activity={activity}
                metrics={healthMeterMetrics}
                budgetKcal={userProfile.dailyCalorieBudget}
                meals={meals}
                wearables={wearables}
                activeWearableId={userProfile.activeWearableId}
                appointments={appointments}
                adsenseConfig={userProfile.adsenseConfig}
                onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                onNavigateTab={setActiveTab}
                onQuickSync={handleSyncAllWearables}
                onOpenCadencePacer={() => setIsCadenceModalOpen(true)}
                onOpenPostMealWalk={() => setIsPostMealModalOpen(true)}
              />
            )}

            {activeTab === 'steps' && (
              <StepCounterView
                activity={activity}
                onUpdateSteps={handleUpdateSteps}
                onUpdateStepGoal={handleUpdateStepGoal}
                pedometer={pedometerRef.current}
                onOpenCadencePacer={() => setIsCadenceModalOpen(true)}
                onOpenPostMealWalk={() => setIsPostMealModalOpen(true)}
              />
            )}

            {activeTab === 'weekly' && (
              <WeeklyProgressView
                history={weeklyHistory}
                todayActivity={activity}
              />
            )}

            {activeTab === 'calories' && (
              <CalorieTrackerView
                budgetKcal={userProfile.dailyCalorieBudget}
                activeBurnedKcal={activity.activeCaloriesBurned}
                meals={meals}
                waterIntakeMl={waterIntakeMl}
                waterGoalMl={userProfile.dailyWaterGoalMl}
                adsenseConfig={userProfile.adsenseConfig}
                onOpenAdManager={() => setIsAdSenseModalOpen(true)}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
                onAddWater={handleAddWater}
              />
            )}

            {activeTab === 'exercises' && (
              <ExerciseView
                activity={activity}
                userWeightKg={userProfile.weightKg}
                loggedWorkouts={loggedWorkouts}
                onAddWorkout={handleAddWorkout}
                onAddSteps={handleAddSteps}
                adsenseConfig={userProfile.adsenseConfig}
                onOpenAdManager={() => setIsAdSenseModalOpen(true)}
              />
            )}

            {activeTab === 'wearables' && (
              <WearablesSyncView
                wearables={wearables}
                activeWearableId={userProfile.activeWearableId}
                onSelectActiveWearable={handleSelectActiveWearable}
                onSyncAll={handleSyncAllWearables}
                onTriggerDeviceSync={handleTriggerDeviceSync}
              />
            )}

            {activeTab === 'education' && (
              <FitnessEducationView
                config={userProfile.adsenseConfig}
                onOpenAdManager={() => setIsAdSenseModalOpen(true)}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsView
                specialists={INITIAL_SPECIALISTS}
                appointments={appointments}
                metrics={healthMeterMetrics}
                activity={activity}
                onBookAppointment={handleBookAppointment}
                onCancelAppointment={handleCancelAppointment}
              />
            )}

            {activeTab === 'about' && <AboutView />}
            {activeTab === 'contact' && <ContactView />}
            {activeTab === 'privacy' && <PrivacyPolicyView />}
            {activeTab === 'terms' && <TermsOfServiceView />}
            {activeTab === 'disclaimer' && <DisclaimerView />}

            {/* Bottom Tab Bar for Mobile screen sizes */}
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        )}
      </main>

      {/* Main Website Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenStorageModal={() => setIsStorageModalOpen(true)}
        onOpenSeoModal={() => setIsSeoModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenAdSenseModal={() => setIsAdSenseModalOpen(true)}
      />

      {/* Modals */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <StorageExplanationModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetAllData={handleResetAllData}
      />

      <AnalyticsAndSeoModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        currentMeasurementId={userProfile.gaMeasurementId || ''}
        onSaveMeasurementId={handleSaveGaMeasurementId}
      />

      <CadencePacerModal
        isOpen={isCadenceModalOpen}
        onClose={() => setIsCadenceModalOpen(false)}
        currentCadenceSpm={activity.cadenceSpm}
      />

      <PostMealWalkModal
        isOpen={isPostMealModalOpen}
        onClose={() => setIsPostMealModalOpen(false)}
        onAddSessionSteps={handleAddSteps}
        currentSteps={activity.steps}
      />

      <AdSenseManagerModal
        isOpen={isAdSenseModalOpen}
        onClose={() => setIsAdSenseModalOpen(false)}
        config={
          userProfile.adsenseConfig || {
            publisherId: '',
            leaderboardSlotId: '1234567890',
            articleSlotId: '2345678901',
            sidebarSlotId: '3456789012',
            enableAutoAds: true,
            testMode: true,
            adUnitsEnabled: true,
          }
        }
        onSaveConfig={handleSaveAdSenseConfig}
      />

      {/* GDPR / CCPA Cookie & Ad Transparency Consent Banner */}
      <CookieConsentBanner onNavigateTab={setActiveTab} />
    </div>
  );
}
