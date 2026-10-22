import React, { useState, useEffect, useRef } from 'react';
import {
  ExerciseRoutine,
  LoggedWorkout,
  AdSenseConfig,
  DailyActivity,
} from '../types/health';
import { INITIAL_EXERCISE_ROUTINES } from '../utils/initialData';
import { AdSenseBanner } from './AdSenseBanner';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle,
  Flame,
  Footprints,
  Timer,
  Heart,
  Sparkles,
  Info,
  Plus,
  Activity,
  Layers,
  Zap,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface ExerciseViewProps {
  activity: DailyActivity;
  userWeightKg: number;
  loggedWorkouts: LoggedWorkout[];
  onAddWorkout: (workout: Omit<LoggedWorkout, 'id' | 'completedAt'>) => void;
  onAddSteps: (stepDelta: number) => void;
  adsenseConfig?: AdSenseConfig;
  onOpenAdManager?: () => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  activity,
  userWeightKg,
  loggedWorkouts,
  onAddWorkout,
  onAddSteps,
  adsenseConfig,
  onOpenAdManager,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeRoutine, setActiveRoutine] = useState<ExerciseRoutine | null>(null);
  
  // Active Workout Player State
  const [intervalIndex, setIntervalIndex] = useState(0);
  const [intervalSecondsRemaining, setIntervalSecondsRemaining] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [lastFinishedWorkout, setLastFinishedWorkout] = useState<LoggedWorkout | null>(null);

  // Custom Quick Log Form State
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<'Cardio' | 'Strength' | 'Mobility' | 'Metabolic'>('Cardio');
  const [customDurationMins, setCustomDurationMins] = useState<number | ''>(20);
  const [customIntensity, setCustomIntensity] = useState<'Low' | 'Moderate' | 'High'>('Moderate');

  // Web Audio Context for synthesized interval beeps (zero external audio file dependency)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playChime = (frequency = 880, duration = 0.15, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Filter routines
  const categories = ['All', 'Metabolic', 'Cardio', 'Strength', 'Mobility'];
  const filteredRoutines = selectedCategory === 'All'
    ? INITIAL_EXERCISE_ROUTINES
    : INITIAL_EXERCISE_ROUTINES.filter((r) => r.category === selectedCategory);

  // Launch routine player
  const handleStartRoutine = (routine: ExerciseRoutine) => {
    setActiveRoutine(routine);
    setIntervalIndex(0);
    setIntervalSecondsRemaining(routine.intervals[0].durationSecs);
    setIsWorkoutRunning(true);
    initAudio();
    playChime(660, 0.2);
  };

  // Routine Interval Timer Effect
  useEffect(() => {
    let timer: number | null = null;
    if (isWorkoutRunning && activeRoutine) {
      timer = window.setInterval(() => {
        setIntervalSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Check if next interval exists
            const nextIdx = intervalIndex + 1;
            if (nextIdx < activeRoutine.intervals.length) {
              setIntervalIndex(nextIdx);
              playChime(1046.5, 0.35, 'triangle'); // high celebratory interval chime
              return activeRoutine.intervals[nextIdx].durationSecs;
            } else {
              // Routine complete!
              setIsWorkoutRunning(false);
              playChime(1318.5, 0.5, 'triangle');
              
              const finished: LoggedWorkout = {
                id: `wk_${Date.now()}`,
                routineTitle: activeRoutine.title,
                category: activeRoutine.category,
                durationMins: activeRoutine.durationMins,
                caloriesBurned: activeRoutine.caloriesBurnEstimate,
                stepsContributed: activeRoutine.stepsEstimate,
                completedAt: 'Just now',
                intensity: activeRoutine.intensity,
              };

              onAddWorkout({
                routineTitle: finished.routineTitle,
                category: finished.category,
                durationMins: finished.durationMins,
                caloriesBurned: finished.caloriesBurned,
                stepsContributed: finished.stepsContributed,
                intensity: finished.intensity,
              });

              if (finished.stepsContributed > 0) {
                onAddSteps(finished.stepsContributed);
              }

              setLastFinishedWorkout(finished);
              setIsCompletedModalOpen(true);
              return 0;
            }
          }

          // 3-2-1 warning countdown beeps
          if (prev <= 4 && prev > 1) {
            playChime(440, 0.08, 'sine');
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWorkoutRunning, activeRoutine, intervalIndex, onAddWorkout, onAddSteps]);

  const handleSkipInterval = () => {
    if (!activeRoutine) return;
    const nextIdx = intervalIndex + 1;
    if (nextIdx < activeRoutine.intervals.length) {
      setIntervalIndex(nextIdx);
      setIntervalSecondsRemaining(activeRoutine.intervals[nextIdx].durationSecs);
      playChime(880, 0.15);
    } else {
      // Finish early
      setIsWorkoutRunning(false);
    }
  };

  const handleCloseActiveRoutine = () => {
    setIsWorkoutRunning(false);
    setActiveRoutine(null);
  };

  // Handle Manual Quick Log
  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customDurationMins) return;

    // MET calculation for energy burn:
    // MET values: Low ~ 3.0, Moderate ~ 5.0, High ~ 8.0
    const met = customIntensity === 'Low' ? 3.3 : customIntensity === 'Moderate' ? 5.5 : 8.0;
    const burn = Math.round((met * 3.5 * userWeightKg * Number(customDurationMins)) / 200);
    const stepsEst = customCategory === 'Cardio' ? Math.round(Number(customDurationMins) * 115) : 0;

    onAddWorkout({
      routineTitle: customTitle,
      category: customCategory,
      durationMins: Number(customDurationMins),
      caloriesBurned: burn,
      stepsContributed: stepsEst,
      intensity: customIntensity,
    });

    if (stepsEst > 0) {
      onAddSteps(stepsEst);
    }

    setCustomTitle('');
    setIsQuickLogOpen(false);
  };

  // Cumulative today workout stats
  const totalWorkoutMinutes = loggedWorkouts.reduce((sum, w) => sum + w.durationMins, 0);
  const totalWorkoutCalories = loggedWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  return (
    <div className="space-y-6">
      {/* Hero: Health Promotion & Exercise Suite */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold uppercase tracking-wider">Exercise Science</span>
              <span aria-hidden="true">·</span>
              <span>Health Promotion</span>
              <span aria-hidden="true">·</span>
              <span>Metabolic Adaptation</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Movement as Medicine: Targeted Clinical Routines
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
              Evidence-based workout routines designed to blunt post-meal blood sugar surges, trigger mitochondrial fat oxidation (Zone 2), and counteract sedentary workplace stiffness.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsQuickLogOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Log Custom Activity</span>
          </button>
        </div>

        {/* Quick Health Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Today's Workouts</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-white font-mono">{loggedWorkouts.length}</span>
              <span className="text-xs text-slate-400 font-medium">sessions</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Minutes</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-cyan-400 font-mono">{totalWorkoutMinutes}</span>
              <span className="text-xs text-slate-400 font-medium">mins</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Workout Burn</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-extrabold text-rose-400 font-mono">{totalWorkoutCalories}</span>
              <span className="text-xs text-slate-400 font-medium">kcal</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Health Status</span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Optimal Stimulus</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Segmented Control */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutines.map((routine) => {
          return (
            <div
              key={routine.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">{routine.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{routine.durationMins} mins</span>
                    <span aria-hidden="true">·</span>
                    <span className={
                      routine.intensity === 'Low' ? 'text-emerald-400' :
                      routine.intensity === 'Moderate' ? 'text-cyan-400' : 'text-amber-400'
                    }>
                      {routine.intensity} Intensity
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    ~{routine.caloriesBurnEstimate} kcal
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {routine.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {routine.subtitle}
                </p>

                {/* Clinical Benefit Callout */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{routine.primaryBenefit}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {routine.scientificRationale}
                  </p>
                </div>

                {/* Interval Steps Preview */}
                <div className="mt-3.5 flex items-center gap-1.5 overflow-hidden text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 shrink-0">Flow:</span>
                  <span className="truncate">
                    {routine.intervals.map((i) => i.name).join(' → ')}
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  {routine.stepsEstimate > 0 && (
                    <span className="flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                      +{routine.stepsEstimate} steps
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    {routine.targetHeartRateZone.split('(')[0].trim()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartRoutine(routine)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/10 min-h-[40px]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Routine</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-Feed Sponsored Health & Wellness Unit */}
      <AdSenseBanner
        format="responsive-feed"
        config={adsenseConfig}
        onOpenAdManager={onOpenAdManager}
      />

      {/* Completed Workouts Log Section */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-300 font-semibold">Activity Diary</span>
              <span aria-hidden="true">·</span>
              <span>Recent Completed Sessions</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">Workout History & Energy Partitioning</h3>
          </div>

          <span className="text-xs text-cyan-400 font-mono font-semibold">
            {loggedWorkouts.length} logged
          </span>
        </div>

        {loggedWorkouts.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
            <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No workout sessions logged yet today.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Select one of the guided clinical routines above or log a custom session.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {loggedWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{workout.routineTitle}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-slate-300 font-medium">{workout.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{workout.durationMins} mins</span>
                      <span aria-hidden="true">·</span>
                      <span>{workout.completedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-rose-400 font-mono tabular-nums">
                    +{workout.caloriesBurned} kcal
                  </div>
                  {workout.stepsContributed > 0 && (
                    <div className="text-[11px] text-cyan-400 font-mono">
                      +{workout.stepsContributed} steps
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE WORKOUT PLAYER MODAL */}
      {activeRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{activeRoutine.title}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>Interval {intervalIndex + 1} of {activeRoutine.intervals.length}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-cyan-400">{activeRoutine.targetHeartRateZone.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                  title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCloseActiveRoutine}
                  className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Current Interval Spotlight Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <div className="text-xs uppercase font-semibold tracking-wider text-cyan-400">
                Current Exercise Focus
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {activeRoutine.intervals[intervalIndex].name}
              </h2>

              {/* Countdown Display */}
              <div className="py-2">
                <span className="text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                  {Math.floor(intervalSecondsRemaining / 60)}:
                  {String(intervalSecondsRemaining % 60).padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400 block mt-1">remaining in interval</span>
              </div>

              {/* Form Instruction & Biomechanical Cue */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 text-left space-y-1.5">
                <div className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeRoutine.intervals[intervalIndex].instruction}
                </div>
                <div className="text-[11px] text-cyan-300 font-mono leading-normal pt-1 border-t border-slate-800">
                  <span className="font-semibold text-slate-400">Form Cue: </span>
                  {activeRoutine.intervals[intervalIndex].formCue}
                </div>
              </div>
            </div>

            {/* Play / Pause / Skip Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsWorkoutRunning((prev) => !prev)}
                className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all min-h-[44px] ${
                  isWorkoutRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isWorkoutRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume Session</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkipInterval}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-2xl transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <SkipForward className="w-4 h-4" />
                <span>Next Interval</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKOUT COMPLETED CELEBRATION MODAL */}
      {isCompletedModalOpen && lastFinishedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-white">Routine Complete!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Outstanding work. You successfully completed <span className="text-white font-semibold">{lastFinishedWorkout.routineTitle}</span>.
            </p>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Calorie Burn</span>
                <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                  +{lastFinishedWorkout.caloriesBurned} kcal
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Steps Contributed</span>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  +{lastFinishedWorkout.stepsContributed} steps
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsCompletedModalOpen(false);
                setActiveRoutine(null);
              }}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors min-h-[44px]"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* QUICK LOG CUSTOM WORKOUT MODAL */}
      {isQuickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Custom Physical Activity</h3>
              <button
                type="button"
                onClick={() => setIsQuickLogOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickLogSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Exercise / Activity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Outdoor Cycling, Reformer Pilates, Swimming Laps"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Cardio">Cardio / Aerobic</option>
                    <option value="Strength">Strength / Hypertrophy</option>
                    <option value="Mobility">Mobility / Yoga</option>
                    <option value="Metabolic">Metabolic Conditioning</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={customDurationMins}
                    onChange={(e) => setCustomDurationMins(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Perceived Exertion Intensity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Moderate', 'High'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCustomIntensity(lvl)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        customIntensity === lvl
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                Energy expenditure will be dynamically computed using clinical Metabolic Equivalent of Task (MET) models adjusted for your body mass ({userWeightKg} kg).
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all min-h-[44px]"
              >
                Log Activity to Health Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
