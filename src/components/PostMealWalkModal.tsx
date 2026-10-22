import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Timer, Sparkles, CheckCircle2, Footprints, Flame, AlertCircle } from 'lucide-react';

interface PostMealWalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSessionSteps: (steps: number) => void;
  currentSteps: number;
}

export const PostMealWalkModal: React.FC<PostMealWalkModalProps> = ({
  isOpen,
  onClose,
  onAddSessionSteps,
}) => {
  const [durationMins, setDurationMins] = useState<10 | 15>(10);
  const [timeLeftSecs, setTimeLeftSecs] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionSteps, setSessionSteps] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const stepIntervalRef = useRef<number | null>(null);

  // Set initial duration
  const handleSelectDuration = (mins: 10 | 15) => {
    if (!isActive) {
      setDurationMins(mins);
      setTimeLeftSecs(mins * 60);
    }
  };

  useEffect(() => {
    let timer: number | null = null;
    if (isActive && timeLeftSecs > 0) {
      timer = window.setInterval(() => {
        setTimeLeftSecs((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeftSecs === 0) {
      setIsActive(false);
      setIsCompleted(true);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeftSecs]);

  // Simulate active session steps during post-meal timer
  useEffect(() => {
    if (isActive) {
      stepIntervalRef.current = window.setInterval(() => {
        setSessionSteps((prev) => {
          const next = prev + 2;
          onAddSessionSteps(2);
          return next;
        });
      }, 950);
    } else {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
        stepIntervalRef.current = null;
      }
    }

    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [isActive, onAddSessionSteps]);

  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsCompleted(false);
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeftSecs(durationMins * 60);
    setSessionSteps(0);
  };

  if (!isOpen) return null;

  const totalSecs = durationMins * 60;
  const progressPercent = Math.min(Math.round(((totalSecs - timeLeftSecs) / totalSecs) * 100), 100);
  const minutes = Math.floor(timeLeftSecs / 60);
  const seconds = timeLeftSecs % 60;

  // SVG Ring
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Circadian Timing Protocol
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-400">Post-Prandial Stroll</span>
        </div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-emerald-400" />
          <span>Post-Meal Glucose Stroll</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
          A dedicated 10–15 min stroll immediately following lunch or dinner clears circulating glucose via muscle contraction without heavy insulin spikes.
        </p>

        {/* Duration selector */}
        {!isActive && !isCompleted && (
          <div className="flex gap-2 my-4">
            <button
              type="button"
              onClick={() => handleSelectDuration(10)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[44px] ${
                durationMins === 10
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              10-Minute Stroll (~1,150 steps)
            </button>
            <button
              type="button"
              onClick={() => handleSelectDuration(15)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[44px] ${
                durationMins === 15
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              15-Minute Stroll (~1,700 steps)
            </button>
          </div>
        )}

        {/* Countdown Ring */}
        <div className="my-5 flex flex-col items-center justify-center relative">
          <svg className="transform -rotate-90 w-48 h-48" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#1e293b"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              fill="none"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {isActive ? 'Walking in progress...' : isCompleted ? 'Session Complete!' : 'Ready to start'}
            </span>
            <span className="text-xs font-semibold text-emerald-400 mt-1 font-mono">
              +{sessionSteps} steps logged
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleStartStop}
            className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isActive ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Pause Stroll</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{isCompleted ? 'Start Another Walk' : 'Start Post-Meal Stroll'}</span>
              </>
            )}
          </button>

          {(isActive || timeLeftSecs < totalSecs) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors min-h-[44px]"
            >
              Reset
            </button>
          )}
        </div>

        {/* Exercise Physiology Micro-Card */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Post-Meal Movement Works:</span>
          </div>
          <p className="text-slate-400">
            Contracting large leg muscle groups (quadriceps and soleus) prompts GLUT4 glucose transporters to migrate to cell membranes, clearing blood sugars directly into muscle cells without demanding large insulin surges.
          </p>
        </div>
      </div>
    </div>
  );
};
