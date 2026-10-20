import React from 'react';
import { HealthMeterMetrics } from '../types/health';
import { ShieldCheck, Heart, Flame, Footprints, Moon, Droplets } from 'lucide-react';

interface HealthMeterGaugeProps {
  metrics: HealthMeterMetrics;
  onExploreBreakdown?: () => void;
  compact?: boolean;
}

export const HealthMeterGauge: React.FC<HealthMeterGaugeProps> = ({
  metrics,
  onExploreBreakdown,
  compact = false,
}) => {
  const { overallScore, tier, breakdown, restingHeartRateBpm, sleepHours, waterIntakeMl } = metrics;

  // Arc calculation for radial gauge (270 degrees sweep)
  const radius = compact ? 54 : 76;
  const strokeWidth = compact ? 10 : 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * (circumference * 0.75);
  const totalArc = circumference * 0.75;

  const getTierColor = (t: HealthMeterMetrics['tier']) => {
    switch (t) {
      case 'Elite':
        return { text: 'text-emerald-400', stroke: '#10b981', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'Optimal':
        return { text: 'text-cyan-400', stroke: '#06b6d4', bg: 'bg-cyan-500/10 border-cyan-500/20' };
      case 'Good':
        return { text: 'text-amber-400', stroke: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/20' };
      default:
        return { text: 'text-rose-400', stroke: '#f43f5e', bg: 'bg-rose-500/10 border-rose-500/20' };
    }
  };

  const tierStyle = getTierColor(tier);

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800/80 p-5 backdrop-blur-xl relative overflow-hidden shadow-xl">
      {/* Subtle decorative glow */}
      <div 
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: tierStyle.stroke }}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
              Composite Health Meter
            </span>
            <span className="text-[10px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-400">Wearable Calibrated</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Daily Vitality Score</h3>
        </div>

        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${tierStyle.bg} ${tierStyle.text}`}>
          {tier}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Radial Meter Graphic */}
        <div className={`sm:col-span-5 flex flex-col items-center justify-center ${compact ? 'py-1' : 'py-2'}`}>
          <div className="relative flex items-center justify-center">
            <svg
              className="transform -rotate-135"
              width={compact ? 130 : 176}
              height={compact ? 130 : 176}
              viewBox="0 0 180 180"
            >
              {/* Background Arc */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
                strokeDasharray={`${totalArc} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Animated Progress Arc */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={tierStyle.stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={`${totalArc} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
                {overallScore}
              </span>
              <span className="text-[11px] font-medium text-slate-400">/ 100</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Vitals Index</span>
            </div>
          </div>
        </div>

        {/* 5 Sub-metric Pillar Progress Cards */}
        <div className="sm:col-span-7 space-y-2.5">
          {/* Activity / Steps */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.activityScore}%` }}
                />
              </div>
              <span className="font-mono text-slate-200 tabular-nums w-8 text-right font-medium">
                {breakdown.activityScore}%
              </span>
            </div>
          </div>

          {/* Calorie & Nutrition */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Caloric Pacing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-rose-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.nutritionScore}%` }}
                />
              </div>
              <span className="font-mono text-slate-200 tabular-nums w-8 text-right font-medium">
                {breakdown.nutritionScore}%
              </span>
            </div>
          </div>

          {/* Cardio & HRV */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>Cardio ({restingHeartRateBpm} bpm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-pink-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.cardioScore}%` }}
                />
              </div>
              <span className="font-mono text-slate-200 tabular-nums w-8 text-right font-medium">
                {breakdown.cardioScore}%
              </span>
            </div>
          </div>

          {/* Sleep & Recovery */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sleep ({sleepHours}h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.recoveryScore}%` }}
                />
              </div>
              <span className="font-mono text-slate-200 tabular-nums w-8 text-right font-medium">
                {breakdown.recoveryScore}%
              </span>
            </div>
          </div>

          {/* Hydration */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hydration ({waterIntakeMl}ml)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${breakdown.hydrationScore}%` }}
                />
              </div>
              <span className="font-mono text-slate-200 tabular-nums w-8 text-right font-medium">
                {breakdown.hydrationScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Clinical Recommendation */}
      {metrics.recommendations.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            <span className="font-medium text-slate-200">Coach Guidance: </span>
            {metrics.recommendations[0]}
          </p>
        </div>
      )}

      {onExploreBreakdown && (
        <button
          onClick={onExploreBreakdown}
          className="mt-3 w-full py-2 text-center text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View Full Clinical Breakdown & Weighting →
        </button>
      )}
    </div>
  );
};
