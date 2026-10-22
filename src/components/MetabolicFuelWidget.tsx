import React from 'react';
import { calculateFuelPartitioning } from '../utils/metabolicFuel';
import { Flame, Droplet, Zap, Info, ArrowUpRight } from 'lucide-react';

interface MetabolicFuelWidgetProps {
  activeCaloriesBurned: number;
  cadenceSpm: number;
  compact?: boolean;
}

export const MetabolicFuelWidget: React.FC<MetabolicFuelWidgetProps> = ({
  activeCaloriesBurned,
  cadenceSpm,
  compact = false,
}) => {
  const fuel = calculateFuelPartitioning(activeCaloriesBurned, cadenceSpm);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Metabolic Substrate
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-[11px] text-slate-400 font-mono">Fat vs Glycogen</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
            Active Fuel Oxidation Lab
          </h3>
        </div>

        <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
          {fuel.aerobicZone}
        </span>
      </div>

      {/* Dual Grams Display */}
      <div className="grid grid-cols-2 gap-3 my-3">
        {/* Lipid / Fat Oxidation */}
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-cyan-500/20 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs mb-1">
            <Droplet className="w-4 h-4 fill-current" />
            <span className="font-semibold">Lipid Oxidation</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {fuel.fatGramsBurned} <span className="text-xs text-slate-400 font-normal">grams</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
            <span>{fuel.fatCalories} kcal</span>
            <span className="text-cyan-400 font-semibold">{fuel.fatPercent}% of burn</span>
          </div>
        </div>

        {/* Carbohydrate / Glycogen Oxidation */}
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-1">
            <Zap className="w-4 h-4 fill-current" />
            <span className="font-semibold">Glycogen Burned</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {fuel.carbGramsBurned} <span className="text-xs text-slate-400 font-normal">grams</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
            <span>{fuel.carbCalories} kcal</span>
            <span className="text-amber-400 font-semibold">{fuel.carbPercent}% of burn</span>
          </div>
        </div>
      </div>

      {/* Split Bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
          <div
            className="h-full bg-cyan-400 rounded-l-full transition-all duration-500"
            style={{ width: `${fuel.fatPercent}%` }}
          />
          <div
            className="h-full bg-amber-400 rounded-r-full transition-all duration-500"
            style={{ width: `${fuel.carbPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
          <span>Fat Substrate ({fuel.fatPercent}%)</span>
          <span>Carb Substrate ({fuel.carbPercent}%)</span>
        </div>
      </div>

      {/* Physiological Note */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-slate-400">
          {fuel.physiologicalInsight}
        </p>
      </div>
    </div>
  );
};
