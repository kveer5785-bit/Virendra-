import React, { useState } from 'react';
import { HourlyStepRecord } from '../types/health';
import { Sun, Sunset, Moon, Sparkles, Clock, CheckCircle2, Footprints } from 'lucide-react';

interface CircadianClockViewProps {
  hourlySteps: HourlyStepRecord[];
  totalSteps: number;
}

export const CircadianClockView: React.FC<CircadianClockViewProps> = ({
  hourlySteps,
  totalSteps,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'morning' | 'midday' | 'evening' | 'night'>('morning');

  // Group steps by circadian quadrant
  const morningSteps = hourlySteps
    .filter((h) => h.hour >= 6 && h.hour < 12)
    .reduce((sum, h) => sum + h.steps, 0);

  const middaySteps = hourlySteps
    .filter((h) => h.hour >= 12 && h.hour < 17)
    .reduce((sum, h) => sum + h.steps, 0);

  const eveningSteps = hourlySteps
    .filter((h) => h.hour >= 17 && h.hour < 22)
    .reduce((sum, h) => sum + h.steps, 0);

  const nightSteps = hourlySteps
    .filter((h) => h.hour >= 22 || h.hour < 6)
    .reduce((sum, h) => sum + h.steps, 0);

  const phases = {
    morning: {
      title: 'Dawn & Morning Sun Window',
      hours: '06:00 – 12:00',
      steps: morningSteps,
      icon: Sun,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      insight: 'Morning outdoor movement accelerates cortisol awakening response and suppresses residual melatonin, priming your circadian clock for deep nocturnal sleep tonight.',
      targetGuidance: 'Aim for at least 2,500 steps outdoors within 2 hours of waking.',
    },
    midday: {
      title: 'Midday Metabolic Peak',
      hours: '12:00 – 17:00',
      steps: middaySteps,
      icon: Sun,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      insight: 'Core body temperature and neuromuscular reaction speed peak in the early afternoon, making this the ideal physiological window for brisk walking and cadence training.',
      targetGuidance: 'Accumulate the bulk of daily steps (3,500+) during this window.',
    },
    evening: {
      title: 'Dusk & Post-Dinner Stroll',
      hours: '17:00 – 22:00',
      steps: eveningSteps,
      icon: Sunset,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      insight: 'A low-intensity 15-minute stroll following dinner blunts glycemic surges and initiates parasympathetic vagal recovery without raising core body temperature before bed.',
      targetGuidance: 'Light strolling only; avoid intense vigorous sprints within 2 hours of sleep.',
    },
    night: {
      title: 'Nocturnal Recovery Window',
      hours: '22:00 – 06:00',
      steps: nightSteps,
      icon: Moon,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      insight: 'Physical rest during this window promotes growth hormone secretion, cellular autophagy, and central nervous system glycogen replenishment.',
      targetGuidance: 'Minimal movement expected; prioritize restful dark environment.',
    },
  };

  const currentPhaseData = phases[selectedPhase];
  const CurrentIcon = currentPhaseData.icon;

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Circadian Physiology
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">24-Hour Solar Alignment</span>
          </div>
          <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Circadian Movement Dial</span>
          </h3>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {totalSteps.toLocaleString()} Total Daily Steps
        </span>
      </div>

      {/* 4 Circadian Phase Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        {(Object.keys(phases) as Array<keyof typeof phases>).map((key) => {
          const item = phases[key];
          const Icon = item.icon;
          const isSelected = selectedPhase === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedPhase(key)}
              className={`p-3 rounded-2xl text-left border transition-all min-h-[44px] ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-[10px] text-slate-400 font-mono">{item.hours.split(' ')[0]}</span>
              </div>
              <span className="text-xs font-bold text-white block capitalize">{key}</span>
              <span className="font-mono text-xs text-slate-300 font-semibold mt-0.5 block">
                {item.steps.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">steps</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Showcase */}
      <div className={`p-4 rounded-2xl border ${currentPhaseData.bg} transition-all`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <CurrentIcon className={`w-5 h-5 ${currentPhaseData.color}`} />
            <div>
              <h4 className="text-sm font-bold text-white">{currentPhaseData.title}</h4>
              <span className="text-[11px] text-slate-400 font-mono">{currentPhaseData.hours}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-base font-extrabold text-white font-mono tabular-nums">
              {currentPhaseData.steps.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">steps logged</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-2">
          {currentPhaseData.insight}
        </p>

        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span><strong>Actionable Protocol:</strong> {currentPhaseData.targetGuidance}</span>
        </div>
      </div>
    </div>
  );
};
