import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';
import { ActiveTab } from '../types/health';

interface CookieConsentBannerProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onNavigateTab }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('pulsefit_cookie_consent');
      if (!consent) {
        // Delay slightly for smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('pulsefit_cookie_consent', 'accepted');
    } catch {}
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('pulsefit_cookie_consent', 'essential_only');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-900/95 border border-slate-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <Cookie className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Cookie & Ad Transparency
          </span>
        </div>
        <button
          type="button"
          onClick={handleEssentialOnly}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Dismiss cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        PulseFit uses essential cookies for your local fitness logs and partners with Google AdSense to display relevant ads that support this free service. Your private health vitals and meal logs are never sold or shared with advertisers.
      </p>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
        <button
          type="button"
          onClick={handleAccept}
          className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 min-h-[44px]"
        >
          Accept All Cookies
        </button>

        <button
          type="button"
          onClick={handleEssentialOnly}
          className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors border border-slate-700 min-h-[44px]"
        >
          Essential Only
        </button>

        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            onNavigateTab('privacy');
          }}
          className="text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 py-1 px-2 whitespace-nowrap"
        >
          Privacy Policy
        </button>
      </div>
    </div>
  );
};
