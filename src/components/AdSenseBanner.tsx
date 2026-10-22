import React, { useEffect } from 'react';
import { ExternalLink, Settings2, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { AdSenseConfig } from '../types/health';

interface AdSenseBannerProps {
  format: 'leaderboard' | 'in-article' | 'sidebar' | 'responsive-feed';
  config?: AdSenseConfig;
  onOpenAdManager?: () => void;
  className?: string;
}

// Preset realistic health & fitness creative mocks for preview/testing prior to live AdSense approval
const PREVIEW_CREATIVES = {
  leaderboard: {
    tag: 'SPONSOR SPOTLIGHT',
    title: 'Hydrate Smarter: Evidence-Based Mineral Electrolytes',
    cta: 'Explore Formula',
    brand: 'HydroOptima Labs',
    desc: 'Scientifically balanced sodium-to-potassium ratios for prolonged aerobic walking sessions and optimal cellular fluid balance.',
  },
  'in-article': {
    tag: 'HEALTH PARTNER',
    title: 'Track Real-Time Glycemic Response with CGM Biosensors',
    cta: 'Learn More',
    brand: 'MetabolicSync',
    desc: 'Pair your post-meal 15-minute walks with continuous glucose monitoring to visualize real-time blood sugar clearance.',
  },
  sidebar: {
    tag: 'FITNESS GEAR',
    title: 'Biomechanical Running & Walking Cadence Pods',
    cta: 'View Sensor',
    brand: 'StrideMetrics Pro',
    desc: 'Zero-latency stride analytics, vertical oscillation tracking, and real-time audio cadence metronome integration.',
  },
  'responsive-feed': {
    tag: 'WELLNESS SPONSOR',
    title: 'Zone 2 Precision Heart Rate Monitors & Chest Straps',
    cta: 'See Review',
    brand: 'CardioPrecision',
    desc: 'Dual-band Bluetooth Low Energy & ANT+ heart rate straps calibrated for sub-lactate lipid oxidation pacing.',
  },
};

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  format,
  config,
  onOpenAdManager,
  className = '',
}) => {
  const isLiveAdSense = Boolean(
    config?.publisherId &&
    config.publisherId.startsWith('ca-pub-') &&
    !config.testMode &&
    config.adUnitsEnabled
  );

  const slotId =
    format === 'leaderboard'
      ? config?.leaderboardSlotId || '1234567890'
      : format === 'in-article'
      ? config?.articleSlotId || '2345678901'
      : config?.sidebarSlotId || '3456789012';

  // Inject Google AdSense Script when in Live Mode
  useEffect(() => {
    if (isLiveAdSense && config?.publisherId && typeof window !== 'undefined') {
      const scriptId = 'google-adsense-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisherId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      try {
        const win = window as unknown as { adsbygoogle?: Array<object> };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch (e) {
        console.warn('AdSense ad push warning:', e);
      }
    }
  }, [isLiveAdSense, config?.publisherId]);

  if (config && !config.adUnitsEnabled) {
    return null;
  }

  const creative = PREVIEW_CREATIVES[format] || PREVIEW_CREATIVES.leaderboard;

  return (
    <div
      className={`w-full my-4 relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/60 transition-all ${className}`}
      style={{
        minHeight: format === 'leaderboard' ? '100px' : format === 'sidebar' ? '250px' : '130px',
      }}
    >
      {/* Required Google AdSense "ADVERTISEMENT" Disclosure Badge */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/70 border-b border-slate-800/80 text-[10px] text-slate-400 select-none">
        <div className="flex items-center gap-1.5 font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Advertisement</span>
          {config?.testMode && (
            <span className="text-[9px] text-amber-400 font-mono font-normal ml-1">
              (AdSense Ready · Preview Mode)
            </span>
          )}
        </div>

        {onOpenAdManager && (
          <button
            type="button"
            onClick={onOpenAdManager}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            title="Configure AdSense Publisher ID & Slot IDs"
          >
            <Settings2 className="w-3 h-3" />
            <span className="hidden sm:inline">AdSense Setup</span>
          </button>
        )}
      </div>

      {/* Live Google AdSense Ins Tag vs. Polished Compliant Preview Ad */}
      {isLiveAdSense ? (
        <div className="p-2 flex items-center justify-center min-h-[90px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={config?.publisherId || ''}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        /* Realistic, High-Converting Fitness Ad Preview */
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Activity className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {creative.tag}
                </span>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-xs text-slate-400 font-medium">{creative.brand}</span>
              </div>

              <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                {creative.title}
              </h4>

              <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-2 leading-relaxed">
                {creative.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {onOpenAdManager ? (
              <button
                type="button"
                onClick={onOpenAdManager}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20 min-h-[44px]"
              >
                <span>{creative.cta}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700">
                {creative.cta}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
