/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  UserProfile,
  DailyActivity,
  FoodItem,
  WearableDevice,
  Specialist,
  HealthAppointment,
  ActiveTab,
} from './types/health';
import {
  INITIAL_USER_PROFILE,
  INITIAL_ACTIVITY,
  INITIAL_MEALS,
  INITIAL_WEARABLES,
  INITIAL_SPECIALISTS,
  INITIAL_APPOINTMENTS,
} from './utils/initialData';
import { calculateHealthMeter } from './utils/healthMeter';
import { PedometerEngine } from './utils/pedometer';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { DashboardView } from './components/DashboardView';
import { StepCounterView } from './components/StepCounterView';
import { CalorieTrackerView } from './components/CalorieTrackerView';
import { AppointmentsView } from './components/AppointmentsView';
import { WearablesSyncView } from './components/WearablesSyncView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { Wifi, Battery, CheckCircle, Smartphone } from 'lucide-react';

const STORAGE_KEY = 'pulsefit_app_data_v1';

export default function App() {
  // Load persisted state or fallback to seeded data
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [activity, setActivity] = useState<DailyActivity>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY;
    } catch {
      return INITIAL_ACTIVITY;
    }
  });

  const [meals, setMeals] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_meals`);
      return saved ? JSON.parse(saved) : INITIAL_MEALS;
    } catch {
      return INITIAL_MEALS;
    }
  });

  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_water`);
      return saved ? JSON.parse(saved) : 1850;
    } catch {
      return 1850;
    }
  });

  const [wearables, setWearables] = useState<WearableDevice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_wearables`);
      return saved ? JSON.parse(saved) : INITIAL_WEARABLES;
    } catch {
      return INITIAL_WEARABLES;
    }
  });

  const [appointments, setAppointments] = useState<HealthAppointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [deviceFrame, setDeviceFrame] = useState<'iphone' | 'pixel' | 'fullscreen'>('iphone');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Pedometer Motion Engine ref
  const pedometerRef = useRef<PedometerEngine>(new PedometerEngine(activity.steps));

  // Sync Pedometer engine initial steps
  useEffect(() => {
    pedometerRef.current.setStepCount(activity.steps);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(userProfile));
      localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(activity));
      localStorage.setItem(`${STORAGE_KEY}_meals`, JSON.stringify(meals));
      localStorage.setItem(`${STORAGE_KEY}_water`, JSON.stringify(waterIntakeMl));
      localStorage.setItem(`${STORAGE_KEY}_wearables`, JSON.stringify(wearables));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [userProfile, activity, meals, waterIntakeMl, wearables, appointments]);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Step Update Handler
  const handleUpdateSteps = (newSteps: number, isLive = false) => {
    const distanceKm = PedometerEngine.calculateDistanceKm(newSteps);
    const activeCaloriesBurned = PedometerEngine.calculateCaloriesBurned(newSteps, userProfile.weightKg);
    const activeMinutes = Math.round(newSteps / 110);

    const currentHour = new Date().getHours();
    const updatedHourly = [...activity.hourlySteps];
    const existingIndex = updatedHourly.findIndex(h => h.hour === currentHour);

    if (existingIndex >= 0) {
      const diff = Math.max(0, newSteps - activity.steps);
      updatedHourly[existingIndex].steps += diff;
    } else {
      updatedHourly.push({ hour: currentHour, steps: 150 });
    }

    setActivity(prev => ({
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
    setActivity(prev => ({ ...prev, stepGoal: newGoal }));
    setUserProfile(prev => ({ ...prev, dailyStepGoal: newGoal }));
    showToast(`Daily step goal updated to ${newGoal.toLocaleString()} steps!`);
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
    setMeals(prev => [item, ...prev]);
    showToast(`Logged "${item.name}" (+${item.calories} kcal)`);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
    showToast('Meal removed from daily diary');
  };

  const handleAddWater = (ml: number) => {
    setWaterIntakeMl(prev => prev + ml);
    showToast(`Added +${ml}ml hydration!`);
  };

  // Appointment Handlers
  const handleBookAppointment = (aptData: Omit<HealthAppointment, 'id' | 'createdAt'>) => {
    const created: HealthAppointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [created, ...prev]);
    showToast(`Appointment confirmed with ${created.specialistName}`);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    showToast('Appointment cancelled');
  };

  // Wearable Sync Handlers
  const handleSelectActiveWearable = (id: string) => {
    setUserProfile(prev => ({ ...prev, activeWearableId: id }));
    showToast('Primary wearable gateway changed');
  };

  const handleSyncAllWearables = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1100));

    // Simulate pulling fresh telemetry from wearable
    const additionalSteps = 160;
    const additionalBurn = 7;
    const newSteps = activity.steps + additionalSteps;
    pedometerRef.current.setStepCount(newSteps);
    handleUpdateSteps(newSteps);

    setWearables(prev =>
      prev.map(w => ({
        ...w,
        lastSync: 'Just now',
        status: 'connected',
      }))
    );

    setIsSyncing(false);
    showToast(`Synced with ${activeWearable.name}: +${additionalSteps} steps & +${additionalBurn} kcal updated`);
  };

  const handleTriggerDeviceSync = (deviceId: string) => {
    handleSyncAllWearables();
  };

  const activeWearable = wearables.find(w => w.id === userProfile.activeWearableId) || wearables[0];
  const upcomingCount = appointments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Bar */}
      <Header
        activeWearable={activeWearable}
        deviceFrame={deviceFrame}
        onChangeFrame={setDeviceFrame}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onQuickSync={handleSyncAllWearables}
        isSyncing={isSyncing}
      />

      {/* Main Container Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-semibold text-xs shadow-2xl animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle className="w-4 h-4" />
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
                  onNavigateTab={setActiveTab}
                  onQuickSync={handleSyncAllWearables}
                />
              )}

              {activeTab === 'steps' && (
                <StepCounterView
                  activity={activity}
                  onUpdateSteps={handleUpdateSteps}
                  onUpdateStepGoal={handleUpdateStepGoal}
                  pedometer={pedometerRef.current}
                />
              )}

              {activeTab === 'calories' && (
                <CalorieTrackerView
                  budgetKcal={userProfile.dailyCalorieBudget}
                  activeBurnedKcal={activity.activeCaloriesBurned}
                  meals={meals}
                  waterIntakeMl={waterIntakeMl}
                  waterGoalMl={userProfile.dailyWaterGoalMl}
                  onAddMeal={handleAddMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onAddWater={handleAddWater}
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

              {activeTab === 'wearables' && (
                <WearablesSyncView
                  wearables={wearables}
                  activeWearableId={userProfile.activeWearableId}
                  onSelectActiveWearable={handleSelectActiveWearable}
                  onSyncAll={handleSyncAllWearables}
                  onTriggerDeviceSync={handleTriggerDeviceSync}
                />
              )}
            </div>

            {/* Fixed Bottom Tab Bar for Mobile Frame */}
            <BottomTabBar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              appointmentsCount={upcomingCount}
            />

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full z-50 pointer-events-none" />
          </div>
        ) : deviceFrame === 'pixel' ? (
          /* Pixel 9 Pro Device Frame */
          <div className="w-full max-w-[420px] bg-slate-950 rounded-[44px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative flex flex-col min-h-[850px] my-2 ring-1 ring-slate-700/50">
            {/* Pixel Status Bar & Camera Punch-hole */}
            <div className="pt-2.5 pb-2 px-6 flex items-center justify-between z-30 select-none bg-slate-950">
              <span className="text-[12px] font-semibold text-white font-mono">
                10:00
              </span>

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
                  onNavigateTab={setActiveTab}
                  onQuickSync={handleSyncAllWearables}
                />
              )}

              {activeTab === 'steps' && (
                <StepCounterView
                  activity={activity}
                  onUpdateSteps={handleUpdateSteps}
                  onUpdateStepGoal={handleUpdateStepGoal}
                  pedometer={pedometerRef.current}
                />
              )}

              {activeTab === 'calories' && (
                <CalorieTrackerView
                  budgetKcal={userProfile.dailyCalorieBudget}
                  activeBurnedKcal={activity.activeCaloriesBurned}
                  meals={meals}
                  waterIntakeMl={waterIntakeMl}
                  waterGoalMl={userProfile.dailyWaterGoalMl}
                  onAddMeal={handleAddMeal}
                  onDeleteMeal={handleDeleteMeal}
                  onAddWater={handleAddWater}
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

              {activeTab === 'wearables' && (
                <WearablesSyncView
                  wearables={wearables}
                  activeWearableId={userProfile.activeWearableId}
                  onSelectActiveWearable={handleSelectActiveWearable}
                  onSyncAll={handleSyncAllWearables}
                  onTriggerDeviceSync={handleTriggerDeviceSync}
                />
              )}
            </div>

            {/* Bottom Tab Bar */}
            <BottomTabBar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              appointmentsCount={upcomingCount}
            />

            {/* Android Navigation Gesture Line */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-500 rounded-full z-50 pointer-events-none" />
          </div>
        ) : (
          /* Responsive Fullscreen View for Desktop / Tablets */
          <div className="w-full max-w-4xl mx-auto pb-24 pt-2 space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardView
                activity={activity}
                metrics={healthMeterMetrics}
                budgetKcal={userProfile.dailyCalorieBudget}
                meals={meals}
                wearables={wearables}
                activeWearableId={userProfile.activeWearableId}
                appointments={appointments}
                onNavigateTab={setActiveTab}
                onQuickSync={handleSyncAllWearables}
              />
            )}

            {activeTab === 'steps' && (
              <StepCounterView
                activity={activity}
                onUpdateSteps={handleUpdateSteps}
                onUpdateStepGoal={handleUpdateStepGoal}
                pedometer={pedometerRef.current}
              />
            )}

            {activeTab === 'calories' && (
              <CalorieTrackerView
                budgetKcal={userProfile.dailyCalorieBudget}
                activeBurnedKcal={activity.activeCaloriesBurned}
                meals={meals}
                waterIntakeMl={waterIntakeMl}
                waterGoalMl={userProfile.dailyWaterGoalMl}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
                onAddWater={handleAddWater}
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

            {activeTab === 'wearables' && (
              <WearablesSyncView
                wearables={wearables}
                activeWearableId={userProfile.activeWearableId}
                onSelectActiveWearable={handleSelectActiveWearable}
                onSyncAll={handleSyncAllWearables}
                onTriggerDeviceSync={handleTriggerDeviceSync}
              />
            )}

            {/* Fixed Bottom Tab Bar */}
            <BottomTabBar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              appointmentsCount={upcomingCount}
            />
          </div>
        )}
      </main>

      {/* PWA Home Screen Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
