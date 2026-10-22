import React, { useState } from 'react';
import { DayHistoryRecord, DailyActivity } from '../types/health';
import {
  Calendar,
  TrendingUp,
  Award,
  Flame,
  Footprints,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';

interface WeeklyProgressViewProps {
  history: DayHistoryRecord[];
  todayActivity: DailyActivity;
  onSelectDay?: (record: DayHistoryRecord) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      day: string;
      vitalityScore: number;
      steps: number;
      stepGoal: number;
      completed: boolean;
    };
  }>;
}

const CustomVitalityTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1 z-30 font-sans">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1 mb-1">
          <span className="font-bold text-white">{data.day}</span>
          <span className="text-[10px] text-slate-400 font-mono">{data.date}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Vitality Score:</span>
          <span className="font-bold text-cyan-400 font-mono text-sm">{data.vitalityScore} / 100</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Steps:</span>
          <span className="font-semibold text-slate-200 font-mono">{data.steps.toLocaleString()}</span>
        </div>
        <div className="pt-1 flex items-center justify-between text-[10px]">
          <span className="text-slate-500">Target: {data.stepGoal.toLocaleString()}</span>
          <span className={data.completed ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
            {data.completed ? 'Goal Met' : 'In Progress'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const WeeklyProgressView: React.FC<WeeklyProgressViewProps> = ({
  history,
  todayActivity,
}) => {
  // Combine past history with today's live activity
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayDate = new Date();
  const todayLabel = dayNames[todayDate.getDay()];

  const todayRecord: DayHistoryRecord = {
    date: todayActivity.date,
    dayLabel: `${todayLabel} (Today)`,
    steps: todayActivity.steps,
    stepGoal: todayActivity.stepGoal,
    distanceKm: todayActivity.distanceKm,
    activeCalories: todayActivity.activeCaloriesBurned,
    caloriesConsumed: 0,
    waterIntakeMl: 0,
    vitalityScore: Math.min(Math.round((todayActivity.steps / todayActivity.stepGoal) * 100), 100),
    completed: todayActivity.steps >= todayActivity.stepGoal,
  };

  // Full 7-day view (history + today)
  const fullWeek = [...history.slice(-6), todayRecord];
  const [selectedRecord, setSelectedRecord] = useState<DayHistoryRecord>(todayRecord);

  // Weekly aggregates
  const totalWeeklySteps = fullWeek.reduce((sum, d) => sum + d.steps, 0);
  const avgDailySteps = Math.round(totalWeeklySteps / fullWeek.length);
  const totalActiveCalories = fullWeek.reduce((sum, d) => sum + d.activeCalories, 0);
  const daysMetGoal = fullWeek.filter((d) => d.completed).length;

  // Average Vitality Score
  const avgVitalityScore = Math.round(
    fullWeek.reduce((sum, d) => sum + d.vitalityScore, 0) / fullWeek.length
  );

  // Streak calculation (consecutive days met goal ending today or yesterday)
  let streak = 0;
  for (let i = fullWeek.length - 1; i >= 0; i--) {
    if (fullWeek[i].completed) {
      streak++;
    } else {
      break;
    }
  }

  const maxStepsInWeek = Math.max(...fullWeek.map((d) => d.steps), todayActivity.stepGoal, 12000);

  // Format dataset for Recharts line graph
  const chartData = fullWeek.map((record) => ({
    date: record.date,
    day: record.dayLabel.split(' ')[0],
    vitalityScore: record.vitalityScore,
    steps: record.steps,
    stepGoal: record.stepGoal,
    completed: record.completed,
    fullRecord: record,
  }));

  return (
    <div className="space-y-6">
      {/* Top Weekly Hero */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Movement Analytics
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">7-Day Trend</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Weekly Progress & Consistency
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Monitors your daily step volume, active energy expenditure, and goal completion streaks. Resets automatically at local midnight.
            </p>
          </div>

          {/* Goal Streak Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-950 border border-emerald-500/30 self-start sm:self-auto shadow-sm">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs text-slate-400 block font-medium leading-none">Goal Streak</span>
              <span className="text-sm font-bold text-white font-mono mt-0.5 block leading-none">
                {streak} {streak === 1 ? 'Day' : 'Days'} Active
              </span>
            </div>
          </div>
        </div>

        {/* 4 Weekly KPI Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">7-Day Total</span>
            <span className="text-lg font-bold text-white tabular-nums font-mono">
              {totalWeeklySteps.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">steps</span>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">Daily Average</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums font-mono">
              {avgDailySteps.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">steps / day</span>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">Active Burn</span>
            <span className="text-lg font-bold text-rose-400 tabular-nums font-mono">
              {totalActiveCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block">kcal total</span>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-3 border border-slate-800/60 text-center">
            <span className="text-xs text-slate-400 block mb-0.5">Vitality Average</span>
            <span className="text-lg font-bold text-cyan-400 tabular-nums font-mono">
              {avgVitalityScore} / 100
            </span>
            <span className="text-[10px] text-slate-400 block">{daysMetGoal} of 7 goals met</span>
          </div>
        </div>
      </div>

      {/* RECHARTS LINE GRAPH: Vitality Score Trends over last 7 days */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Recharts Analytics
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">0 - 100 Index</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Vitality Score Trend (Last 7 Days)</span>
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Vitality Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500/80 border-t border-dashed border-emerald-400" />
              <span>Optimal Zone (80+)</span>
            </div>
          </div>
        </div>

        {/* Line Chart Canvas */}
        <div className="w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
              onClick={(e: unknown) => {
                const chartEvent = e as { activePayload?: Array<{ payload?: { fullRecord?: DayHistoryRecord } }> };
                const clicked = chartEvent?.activePayload?.[0]?.payload?.fullRecord;
                if (clicked) setSelectedRecord(clicked);
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                domain={[30, 100]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                ticks={[40, 60, 80, 100]}
              />
              <Tooltip content={<CustomVitalityTooltip />} />
              <ReferenceLine
                y={80}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="vitalityScore"
                name="Vitality Score"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: '#06b6d4',
                  stroke: '#0f172a',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: '#38bdf8',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1 border-t border-slate-800/80 pt-2">
          <span>Click any point along the curve to inspect that day's complete metrics.</span>
          <span className="font-mono text-cyan-400 font-medium">Weekly Peak: {Math.max(...chartData.map(d => d.vitalityScore))}/100</span>
        </div>
      </div>

      {/* 7-Day Step Breakdown Bar Graph */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">7-Day Step Volume</h3>
            <p className="text-xs text-slate-400">Daily walking volume against targets</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
              <span className="text-slate-400 text-[11px]">Goal Met</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
              <span className="text-slate-400 text-[11px]">In Progress</span>
            </div>
          </div>
        </div>

        {/* The Step Bar Graph */}
        <div className="h-44 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-1 border-b border-slate-800">
          {fullWeek.map((record, idx) => {
            const heightPercent = Math.min(Math.round((record.steps / maxStepsInWeek) * 100), 100);
            const isSelected = selectedRecord.date === record.date;
            const isCompleted = record.completed;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedRecord(record)}
                className="flex-1 flex flex-col items-center gap-1.5 group relative focus:outline-none min-h-[44px]"
              >
                {/* Floating tooltip */}
                <div
                  className={`absolute -top-7 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  } bg-slate-800 text-[10px] text-white py-0.5 px-2 rounded-md pointer-events-none whitespace-nowrap transition-opacity font-mono z-10 shadow-md border border-slate-700`}
                >
                  {record.steps.toLocaleString()}
                </div>

                {/* The vertical bar */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isCompleted
                      ? isSelected
                        ? 'bg-emerald-400 ring-2 ring-emerald-300'
                        : 'bg-emerald-500/80 group-hover:bg-emerald-400'
                      : isSelected
                      ? 'bg-cyan-400 ring-2 ring-cyan-300'
                      : 'bg-slate-700 group-hover:bg-slate-600'
                  }`}
                  style={{ height: `${Math.max(heightPercent, 8)}%` }}
                />

                {/* Day label */}
                <span
                  className={`text-[11px] font-mono transition-colors ${
                    isSelected ? 'text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {record.dayLabel.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Goal line benchmark indicator */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Target line: {todayActivity.stepGoal.toLocaleString()} steps</span>
          <span>Max volume: {maxStepsInWeek.toLocaleString()} steps</span>
        </div>
      </div>

      {/* Selected Day Details Panel */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">
              Details for {selectedRecord.dayLabel} ({selectedRecord.date})
            </h4>
          </div>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              selectedRecord.completed
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {selectedRecord.completed ? 'Goal Achieved' : 'Pacing Target'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              <span>Steps Recorded</span>
            </div>
            <div className="text-base font-bold text-white font-mono">
              {selectedRecord.steps.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Goal: {selectedRecord.stepGoal.toLocaleString()}
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Distance Walked</span>
            </div>
            <div className="text-base font-bold text-white font-mono">
              {selectedRecord.distanceKm} km
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              ~{Number((selectedRecord.distanceKm * 0.621371).toFixed(2))} miles
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Active Calories</span>
            </div>
            <div className="text-base font-bold text-white font-mono">
              {selectedRecord.activeCalories} kcal
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Estimated MET burn
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Vitality Score</span>
            </div>
            <div className="text-base font-bold text-white font-mono text-cyan-400">
              {selectedRecord.vitalityScore} / 100
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Lifestyle index
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
