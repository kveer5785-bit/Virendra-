import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Volume2, Sparkles, Footprints, Gauge, Sliders, CheckCircle } from 'lucide-react';
import { CadencePacerEngine } from '../utils/audioPacer';

interface CadencePacerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCadenceSpm: number;
}

const PRESETS = [
  { label: 'Recovery Stroll', spm: 95, desc: 'Gentle joint-friendly pacing' },
  { label: 'Aerobic Walk', spm: 115, desc: 'Zone 2 FatMax aerobic cadence' },
  { label: 'Power Walking', spm: 125, desc: 'Elevated heart rate & high NEAT' },
  { label: 'Smooth Jog', spm: 160, desc: 'Aerobic running threshold' },
  { label: 'Running Stride', spm: 180, desc: 'Biomechanically optimal 180 SPM' },
];

export const CadencePacerModal: React.FC<CadencePacerModalProps> = ({
  isOpen,
  onClose,
  currentCadenceSpm,
}) => {
  const [targetSpm, setTargetSpm] = useState(115);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<'woodblock' | 'soft_chime' | 'subtle_click'>('woodblock');
  const [beatPulse, setBeatPulse] = useState(false);
  const [beatCount, setBeatCount] = useState(0);

  const engineRef = useRef<CadencePacerEngine | null>(null);

  useEffect(() => {
    engineRef.current = new CadencePacerEngine(targetSpm);
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTempo(targetSpm);
    }
  }, [targetSpm]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSoundType(soundType);
    }
  }, [soundType]);

  const handleTogglePlay = () => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setBeatPulse(false);
    } else {
      engineRef.current.start((count) => {
        setBeatCount(count);
        setBeatPulse(true);
        setTimeout(() => setBeatPulse(false), 140);
      });
      setIsPlaying(true);
    }
  };

  const handleClose = () => {
    if (engineRef.current && isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
    }
    onClose();
  };

  if (!isOpen) return null;

  // Pace sync comparison
  const cadenceDiff = Math.abs(currentCadenceSpm - targetSpm);
  const isPacingMatched = currentCadenceSpm > 0 && cadenceDiff <= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative my-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Audio-Visual Metronome
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-400">Web Audio API</span>
        </div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <span>Cadence Pacing Lab</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Train your neuromuscular rhythm to optimize aerobic fat burn and joint efficiency.
        </p>

        {/* Central Pulsing Beat Orb */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Outer concentric ripple */}
            <div
              className={`absolute w-44 h-44 rounded-full border border-cyan-500/20 transition-all duration-300 pointer-events-none ${
                beatPulse ? 'scale-125 opacity-70 border-cyan-400' : 'scale-100 opacity-20'
              }`}
            />
            {/* Middle ripple */}
            <div
              className={`absolute w-36 h-36 rounded-full border border-cyan-500/30 transition-all duration-200 pointer-events-none ${
                beatPulse ? 'scale-110 opacity-90 border-cyan-300' : 'scale-100 opacity-30'
              }`}
            />

            {/* Inner Interactive Orb */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-2xl z-10 ${
                isPlaying
                  ? beatPulse
                    ? 'bg-cyan-400 text-slate-950 scale-105 shadow-cyan-400/50'
                    : 'bg-cyan-500 text-slate-950 shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
              aria-label={isPlaying ? 'Stop Metronome' : 'Start Metronome'}
            >
              {isPlaying ? (
                <>
                  <Square className="w-6 h-6 fill-current mb-0.5" />
                  <span className="text-[11px] font-bold">Stop Pacer</span>
                </>
              ) : (
                <>
                  <Play className="w-7 h-7 fill-current ml-1 mb-0.5 text-cyan-400" />
                  <span className="text-[11px] font-bold">Start Pacer</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {targetSpm} <span className="text-sm font-normal text-slate-400">SPM</span>
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Steps Per Minute (Target Tempo)
            </span>
          </div>
        </div>

        {/* Live Cadence Comparison HUD */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 mb-4 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Your Live Stride Cadence:</span>
            <span className="font-mono text-white font-bold text-sm">
              {currentCadenceSpm > 0 ? `${currentCadenceSpm} SPM` : 'Sensor Standing By'}
            </span>
          </div>

          <div>
            {currentCadenceSpm > 0 ? (
              isPacingMatched ? (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>On Rhythm</span>
                </span>
              ) : currentCadenceSpm < targetSpm ? (
                <span className="text-amber-400 font-medium text-[11px] bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                  Step faster (+{targetSpm - currentCadenceSpm} SPM)
                </span>
              ) : (
                <span className="text-cyan-400 font-medium text-[11px] bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20">
                  Ease cadence (-{currentCadenceSpm - targetSpm} SPM)
                </span>
              )
            ) : (
              <span className="text-slate-500 text-[11px]">Walk to calibrate</span>
            )}
          </div>
        </div>

        {/* Cadence Presets */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[11px] font-semibold text-slate-300 block">
            Target Cadence Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((preset) => {
              const isSelected = targetSpm === preset.spm;
              return (
                <button
                  key={preset.spm}
                  type="button"
                  onClick={() => setTargetSpm(preset.spm)}
                  className={`p-2 rounded-xl text-left border transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono font-bold text-xs block">{preset.spm} SPM</span>
                  <span className="text-[10px] text-slate-400 block truncate">{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Sound Profile Selector */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tone:</span>
          </span>

          <div className="flex gap-1.5">
            {[
              { id: 'woodblock', label: 'Woodblock' },
              { id: 'soft_chime', label: 'Chime' },
              { id: 'subtle_click', label: 'Click' },
            ].map((sound) => (
              <button
                key={sound.id}
                type="button"
                onClick={() => setSoundType(sound.id as typeof soundType)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  soundType === sound.id
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sound.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
