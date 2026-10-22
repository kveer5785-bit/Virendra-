import React from 'react';
import { DailyActivity, HealthMeterMetrics, FoodItem, WearableDevice, HealthAppointment, ActiveTab, AdSenseConfig } from '../types/health';
import { HealthMeterGauge } from './HealthMeterGauge';
import { MetabolicFuelWidget } from './MetabolicFuelWidget';
import { AdSenseBanner } from './AdSenseBanner';
import {
  Footprints,
  Flame,
  Calendar,
  Watch,
  ChevronRight,
  Plus,
  Play,
  Sparkles,
  Video,
  ArrowUpRight,
  TrendingUp,
  Gauge,
  Timer,
  Dumbbell,
} from 'lucide-react';

interface DashboardViewProps {
  activity: DailyActivity;
  metrics: HealthMeterMetrics;
  budgetKcal: number;
  meals: FoodItem[];
  wearables: WearableDevice[];
  activeWearableId: string;
  appointments: HealthAppointment[];
  adsenseConfig?: AdSenseConfig;
  onOpenAdManager?: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onQuickSync: () => void;
  onOpenCadencePacer?: () => void;
  onOpenPostMealWalk?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activity,
  metrics,
  budgetKcal,
  meals,
  wearables,
  activeWearableId,
  appointments,
  adsenseConfig,
  onOpenAdManager,
  onNavigateTab,
  onQuickSync,
  onOpenCadencePacer,
  onOpenPostMealWalk,
}) => {
  const activeDevice = wearables.find((w) => w.id === activeWearableId) || wearables[0];
  const nextAppointment = appointments.find((a) => a.status === 'confirmed');

  const totalCaloriesConsumed = meals.reduce((sum, m) => sum + m.calories, 0);
  const remainingCalories = budgetKcal - totalCaloriesConsumed + activity.activeCaloriesBurned;

  return (
    <div className="space-y-6">
      {/* Wearable Connection Micro-Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Watch className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">
            {activeDevice.name}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[11px] text-emerald-400 font-mono">Synced {activeDevice.lastSync}</span>
        </div>

        <button
          onClick={onQuickSync}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 min-h-[44px] min-w-[44px] justify-end"
        >
          <span>Sync</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Vitality Meter Gauge */}
      <HealthMeterGauge
        metrics={metrics}
        onExploreBreakdown={() => onNavigateTab('steps')}
      />

      {/* 2-Column Split: Daily Step Quick Card + Calorie Quick Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step Counter Summary Card */}
        <div
          onClick={() => onNavigateTab('steps')}
          className="rounded-3xl bg-slate-900 border border-slate-800 p-5 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Daily Pedometer
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {activity.steps.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">
                / {activity.stepGoal.toLocaleString()}
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              {Math.min(Math.round((activity.steps / activity.stepGoal) * 100), 100)}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((activity.steps / activity.stepGoal) * 100, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{activity.distanceKm} km walked</span>
            <span>+{activity.activeCaloriesBurned} kcal active</span>
          </div>
        </div>

        {/* Calorie Deficit & Macro Card */}
        <div
          onClick={() => onNavigateTab('calories')}
          className="rounded-3xl bg-slate-900 border border-slate-800 p-5 hover:border-rose-500/40 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Caloric Balance
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums font-mono">
                {remainingCalories}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">kcal left</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Budget: {budgetKcal}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalCaloriesConsumed / budgetKcal) * 100, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{totalCaloriesConsumed} kcal food</span>
            <span>+{activity.activeCaloriesBurned} kcal burn</span>
          </div>
        </div>
      </div>

      {/* In-Feed Sponsored Health & Fitness Unit */}
      <AdSenseBanner
        format="responsive-feed"
        config={adsenseConfig}
        onOpenAdManager={onOpenAdManager}
      />

      {/* DISTINCTIVE FEATURE: Metabolic Fuel Partitioning (Grams of Fat vs Glycogen) */}
      <MetabolicFuelWidget
        activeCaloriesBurned={activity.activeCaloriesBurned}
        cadenceSpm={activity.cadenceSpm}
      />

      {/* Next Appointment Spotlight Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Health Specialist Consultation
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('appointments')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>{nextAppointment ? 'Manage' : 'Book'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nextAppointment ? (
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xs">
                {nextAppointment.specialistName.slice(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{nextAppointment.specialistName}</h4>
                <p className="text-xs text-slate-400">
                  {nextAppointment.date} at {nextAppointment.timeSlot} · {nextAppointment.focusArea}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('appointments')}
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto min-h-[44px]"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Call</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
            <p className="text-xs text-slate-400 mb-2">No appointments scheduled.</p>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium min-h-[44px]"
            >
              Schedule Health Review
            </button>
          </div>
        )}
      </div>

      {/* Targeted Health Routines Spotlight Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold uppercase tracking-wider">Health Promotion</span>
              <span aria-hidden="true">·</span>
              <span>5 Clinical Routines</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">Post-Meal Walks, Zone 2 & ACSM 7-Min Workouts</h4>
            <p className="text-xs text-slate-400 mt-0.5">Guided interval timers with real-time step and active calorie tracking.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('exercises')}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 min-h-[40px] flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>Explore Workouts</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* DISTINCTIVE PROTOCOL WORKFLOWS & LAUNCHPAD */}
      <div>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block mb-2 px-1">
          Specialized Pacing & Circadian Protocols
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Metronome Cadence Pacer */}
          {onOpenCadencePacer ? (
            <button
              type="button"
              onClick={onOpenCadencePacer}
              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-2xl text-left transition-colors flex items-center gap-2.5 min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Cadence Pacer</span>
                <span className="text-[10px] text-slate-400 block">Metronome</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateTab('steps')}
              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl text-left transition-colors flex items-center gap-2.5 min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Walk Mode</span>
                <span className="text-[10px] text-slate-400 block">Pedometer</span>
              </div>
            </button>
          )}

          {/* Post-Meal Glucose Stroll */}
          {onOpenPostMealWalk ? (
            <button
              type="button"
              onClick={onOpenPostMealWalk}
              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-left transition-colors flex items-center gap-2.5 min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Post-Meal Stroll</span>
                <span className="text-[10px] text-slate-400 block">Glucose Timer</span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigateTab('weekly')}
              className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl text-left transition-colors flex items-center gap-2.5 min-h-[44px]"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Weekly Trends</span>
                <span className="text-[10px] text-slate-400 block">7-Day History</span>
              </div>
            </button>
          )}

          {/* Log Food */}
          <button
            onClick={() => onNavigateTab('calories')}
            className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl text-left transition-colors flex items-center gap-2.5 min-h-[44px]"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Log Food</span>
              <span className="text-[10px] text-slate-400 block">Macros & kcal</span>
            </div>
          </button>

          {/* Book Coach */}
          <button
            onClick={() => onNavigateTab('appointments')}
            className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl text-left transition-colors flex items-center gap-2.5 min-h-[44px]"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Book Coach</span>
              <span className="text-[10px] text-slate-400 block">Consultation</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
