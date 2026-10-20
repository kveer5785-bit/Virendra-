import React from 'react';
import { Smartphone, Download, Sparkles, RefreshCw, Watch } from 'lucide-react';
import { WearableDevice } from '../types/health';

interface HeaderProps {
  activeWearable: WearableDevice;
  deviceFrame: 'iphone' | 'pixel' | 'fullscreen';
  onChangeFrame: (frame: 'iphone' | 'pixel' | 'fullscreen') => void;
  onOpenInstallModal: () => void;
  onQuickSync: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeWearable,
  deviceFrame,
  onChangeFrame,
  onOpenInstallModal,
  onQuickSync,
  isSyncing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand wordmark - Clean single element */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
            P
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight leading-none block">
              PulseFit
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none block mt-0.5">
              Health & Step Sync
            </span>
          </div>
        </div>

        {/* Viewport Frame Mode Selector (Phone preview vs Fullscreen) */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => onChangeFrame('iphone')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              deviceFrame === 'iphone'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            iPhone 16
          </button>
          <button
            onClick={() => onChangeFrame('pixel')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              deviceFrame === 'pixel'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pixel 9
          </button>
          <button
            onClick={() => onChangeFrame('fullscreen')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              deviceFrame === 'fullscreen'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Responsive
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Quick sync trigger */}
          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-xl transition-colors border border-transparent hover:border-slate-800"
            title={`Sync ${activeWearable.name}`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* PWA Install Button */}
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Install App</span>
          </button>
        </div>
      </div>
    </header>
  );
};
