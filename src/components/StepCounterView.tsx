import React, { useState } from 'react';
import { DailyActivity } from '../types/health';
import {
  Footprints,
  Flame,
  Timer,
  TrendingUp,
  Play,
  Square,
  Plus,
  Settings2,
  Sparkles,
  Smartphone,
  Eye,
  Info,
  Gauge,
  Clock,
} from 'lucide-react';
import { PedometerEngine } from '../utils/pedometer';
import { CircadianClockView } from './CircadianClockView';
import { MetabolicFuelWidget } from './MetabolicFuelWidget';

interface StepCounterViewProps {
  activity: DailyActivity;
  onUpdateSteps: (newSteps: number, isLive?: boolean) => void;
  onUpdateStepGoal: (newGoal: number) => void;
  pedometer: PedometerEngine;
  onOpenCadencePacer?: () => void;
  onOpenPostMealWalk?: () => void;
}

export const StepCounterView: React.FC<StepCounterViewProps> = ({
  activity,
  onUpdateSteps,
  onUpdateStepGoal,
  pedometer,
  onOpenCadencePacer,
  onOpenPostMealWalk,
}) => {
  const [isSimulating, setIsSimulating] = useState(pedometer.isSimulating());
  const [isLiveActive, setIsLiveActive] = useState(activity.isLiveTracking);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(activity.stepGoal);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  const completionPercent = Math.min(Math.round((activity.steps / activity.stepGoal) * 100), 100);
  const remainingSteps = Math.max(0, activity.stepGoal - activity.steps);

  // SVG Ring calculation
  const radius = 105;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(activity.steps / activity.stepGoal, 1)) * circumference;

  const handleToggleLiveSensor = async () => {
    if (isLiveActive) {
      pedometer.stop();
      setIsLiveActive(false);
      onUpdateSteps(activity.steps, false);
      setPermissionStatus(null);
    } else {
      const granted = await pedometer.requestPermission();
      if (granted) {
        setPermissionStatus('active');
        setIsLiveActive(true);
        pedometer.start({
          onStep: (count) => {
            onUpdateSteps(count, true);
          },
          onError: (msg) => {
            setPermissionStatus(`Notice: ${msg}`);
          },
        });
      } else {
        setPermissionStatus('denied');
      }
    }
  };

  const handleToggleSimulation = () => {
    if (isSimulating) {
      pedometer.stopSimulation();
      setIsSimulating(false);
      onUpdateSteps(activity.steps, false);
    } else {
      pedometer.setStepCount(activity.steps);
      pedometer.startSimulation(850);
      setIsSimulating(true);
      pedometer.start({
        onStep: (count) => {
          onUpdateSteps(count, true);
        },
      });
    }
  };

  const handleQuickAdd = (increment: number) => {
    const updated = activity.steps + increment;
    pedometer.setStepCount(updated);
    onUpdateSteps(updated, false);
  };

  const handleSaveGoal = () => {
    if (tempGoal >= 1000 && tempGoal <= 50000) {
      onUpdateStepGoal(tempGoal);
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Step Ring Hero Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Pedometer Engine
              </span>
              {isLiveActive && (
                <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-medium bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  <Eye className="w-3 h-3" />
                  <span>Screen Kept Awake</span>
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">Daily Step Counter</h2>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingGoal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors min-h-[44px]"
          >
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Goal: {activity.stepGoal.toLocaleString()}</span>
          </button>
        </div>

        {/* Large SVG Step Ring */}
        <div className="flex flex-col items-center justify-center my-4 relative">
          <svg className="transform -rotate-90 w-64 h-64" viewBox="0 0 250 250">
            {/* Background ring */}
            <circle
              cx="125"
              cy="125"
              r={radius}
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Active progress ring */}
            <circle
              cx="125"
              cy="125"
              r={radius}
              stroke="#10b981"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              style={{
                transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </svg>

          {/* Centered Ring Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Footprints className="w-6 h-6 text-emerald-400 mb-1" />
            <span className="text-4xl font-extrabold text-white tracking-tight tabular-nums font-mono">
              {activity.steps.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400 mt-0.5">
              of {activity.stepGoal.toLocaleString()} steps
            </span>
            <span className="text-xs font-semibold text-emerald-400 mt-1">
              {completionPercent}% Completed
            </span>
          </div>
        </div>

        {/* 3 Metric Tiles (with non-medical estimation notes) */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/50 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Distance</span>
            </div>
            <div className="text-lg font-bold text-white tabular-nums font-mono">
              {activity.distanceKm} <span className="text-xs text-slate-400 font-normal">km</span>
            </div>
            <span className="text-[9px] text-slate-500 block mt-0.5">~0.76m/step est.</span>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/50 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Active Burn</span>
            </div>
            <div className="text-lg font-bold text-white tabular-nums font-mono">
              {activity.activeCaloriesBurned} <span className="text-xs text-slate-400 font-normal">kcal</span>
            </div>
            <span className="text-[9px] text-slate-500 block mt-0.5">MET estimation</span>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/50 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Time</span>
            </div>
            <div className="text-lg font-bold text-white tabular-nums font-mono">
              {activity.activeMinutes} <span className="text-xs text-slate-400 font-normal">min</span>
            </div>
            <span className="text-[9px] text-slate-500 block mt-0.5">cadence filtered</span>
          </div>
        </div>

        {/* Live Cadence and Walk Status */}
        <div className="mt-4 flex items-center justify-between text-xs px-2 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Cadence:</span>
            <span className="font-mono text-emerald-400 font-semibold tabular-nums">{activity.cadenceSpm} SPM</span>
            <span className="text-slate-500">·</span>
            <span>{activity.cadenceSpm >= 115 ? 'Brisk Pace' : 'Moderate Pace'}</span>
          </div>
          <div>
            {remainingSteps > 0 ? (
              <span className="text-slate-400">{remainingSteps.toLocaleString()} steps remaining</span>
            ) : (
              <span className="text-emerald-400 font-semibold">Goal Surpassed!</span>
            )}
          </div>
        </div>
      </div>

      {/* DISTINCTIVE PROTOCOL WORKFLOWS: Cadence Metronome & Post-Meal Walk Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {onOpenCadencePacer && (
          <button
            type="button"
            onClick={onOpenCadencePacer}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group shadow-xl flex items-center justify-between min-h-[44px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-cyan-300 transition-colors">
                  Cadence Metronome & Pacer
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Web Audio rhythm pacer (95–180 SPM)
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              Open →
            </span>
          </button>
        )}

        {onOpenPostMealWalk && (
          <button
            type="button"
            onClick={onOpenPostMealWalk}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group shadow-xl flex items-center justify-between min-h-[44px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-emerald-300 transition-colors">
                  Post-Meal Glucose Stroll
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  10/15-min post-prandial timer
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              Start →
            </span>
          </button>
        )}
      </div>

      {/* DISTINCTIVE FEATURE: Metabolic Fuel Partitioning (Fat vs Glycogen) */}
      <MetabolicFuelWidget
        activeCaloriesBurned={activity.activeCaloriesBurned}
        cadenceSpm={activity.cadenceSpm}
      />

      {/* Real-time Tracking & Sensor Controls */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Motion Sensor & Walk Mode</h3>
            <p className="text-xs text-slate-400">
              Captures footsteps via smartphone accelerometer, with Screen Wake Lock.
            </p>
          </div>
          <Smartphone className="w-5 h-5 text-slate-400" />
        </div>

        {/* Limitation Explanation Notice */}
        <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            <strong>Mobile Browser Behavior:</strong> Web browsers (iOS Safari & Android Chrome) suspend sensor listeners when the phone screen turns completely black or is backgrounded to preserve battery. When you start walk mode below, PulseFit activates the Screen Wake Lock so your screen stays awake during your walk.
          </p>
        </div>

        {permissionStatus === 'denied' && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
            Motion permission was denied in your browser settings. You can re-enable it in browser site settings or use the Walk Simulator below!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Hardware Sensor Toggle */}
          <button
            type="button"
            onClick={handleToggleLiveSensor}
            className={`flex items-center justify-center gap-2 min-h-[48px] rounded-xl text-xs font-semibold transition-all ${
              isLiveActive
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isLiveActive ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Accelerometer Walk Mode</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Accelerometer (Phone)</span>
              </>
            )}
          </button>

          {/* Real-time Walking Simulator Toggle */}
          <button
            type="button"
            onClick={handleToggleSimulation}
            className={`flex items-center justify-center gap-2 min-h-[48px] rounded-xl text-xs font-semibold transition-all ${
              isSimulating
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isSimulating ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Walk Simulator</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Simulate Walking Pace</span>
              </>
            )}
          </button>
        </div>

        {/* Manual Quick Step Increments */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 block mb-2">
            Manual Step Calibration & Verification
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickAdd(250)}
              className="flex-1 py-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>+250 Steps</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(500)}
              className="flex-1 py-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>+500 Steps</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(1000)}
              className="flex-1 py-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>+1,000 Steps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hourly Step Distribution Chart */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Today's Hourly Rhythm</h3>
            <p className="text-xs text-slate-400">Step distribution throughout the day</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-medium">Peak: 12:00 PM (1,420 steps)</span>
        </div>

        {/* Bar chart representation */}
        <div className="h-36 flex items-end gap-1.5 pt-4 pb-1 px-1 border-b border-slate-800">
          {activity.hourlySteps.map((item) => {
            const maxStep = 1500;
            const heightPercent = Math.min(Math.round((item.steps / maxStep) * 100), 100);
            return (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-800 text-[10px] text-white py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap transition-opacity font-mono z-10 border border-slate-700">
                  {item.steps}
                </div>
                <div
                  className="w-full bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t transition-all duration-300"
                  style={{ height: `${heightPercent}%`, minHeight: '6px' }}
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1">
                  {item.hour % 12 || 12}{item.hour < 12 ? 'a' : 'p'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISTINCTIVE FEATURE: 24-Hour Solar Circadian Movement Dial */}
      <CircadianClockView
        hourlySteps={activity.hourlySteps}
        totalSteps={activity.steps}
      />

      {/* Edit Step Goal Modal */}
      {isEditingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Adjust Daily Step Goal</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Set a realistic target based on your lifestyle and conditioning.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Target Steps</label>
                <input
                  type="number"
                  step="500"
                  min="2000"
                  max="50000"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Preset buttons */}
              <div className="flex gap-2">
                {[6000, 8000, 10000, 12500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTempGoal(val)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors min-h-[44px] ${
                      tempGoal === val
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {(val / 1000)}k
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingGoal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveGoal}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors min-h-[44px]"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
