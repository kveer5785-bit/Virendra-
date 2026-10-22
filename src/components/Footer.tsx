import React from 'react';
import {
  Footprints,
  Flame,
  Watch,
  BookOpen,
  Calendar,
  Shield,
  ShieldAlert,
  Info,
  Mail,
  Database,
  Globe,
  TrendingUp,
  Cpu,
  Volume2,
  Eye,
  Bluetooth,
  Heart,
} from 'lucide-react';
import { ActiveTab } from '../types/health';

interface FooterProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenStorageModal: () => void;
  onOpenSeoModal: () => void;
  onOpenInstallModal: () => void;
  onOpenAdSenseModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenStorageModal,
  onOpenSeoModal,
  onOpenInstallModal,
  onOpenAdSenseModal,
}) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 mt-16 text-slate-400">
      {/* Top feature badges: Chrome Web APIs */}
      <div className="border-b border-slate-800/60 bg-slate-900/40 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Google Chrome & Modern Browser Web APIs:</span>
          </span>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Web Audio Metronome</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Screen Wake Lock</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Bluetooth className="w-3.5 h-3.5 text-indigo-400" />
              <span>Web Bluetooth BLE</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>Private LocalStorage</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Col */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
              P
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">PulseFit</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Privacy-first movement and metabolic tracking web application designed for Google Chrome, Android, and iOS. Track steps, monitor energy partitioning, and pace cadence with zero server tracking.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Install as Chrome App
            </button>
            <button
              type="button"
              onClick={onOpenStorageModal}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Backup JSON
            </button>
          </div>
        </div>

        {/* Tracking Modules */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Fitness Tracking</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('dashboard')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <span>Dashboard Overview</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('steps')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <span>Daily Pedometer & Cadence</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('weekly')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <span>7-Day Trends & Consistency</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('calories')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <span>Calorie Deficit & Macro Diary</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('wearables')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <span>Wearable Device Sync Hub</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Resources & Support */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources & Science</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('education')}
                className="hover:text-cyan-400 transition-colors"
              >
                Movement Science & NEAT Guides
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('appointments')}
                className="hover:text-cyan-400 transition-colors"
              >
                Coaching & Specialist Consultations
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenStorageModal}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <span>Local Data Backup & Restore</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenSeoModal}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <span>Google Search Console & GA4 Setup</span>
              </button>
            </li>
            {onOpenAdSenseModal && (
              <li>
                <button
                  type="button"
                  onClick={onOpenAdSenseModal}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400/90 font-medium"
                >
                  <span>Google AdSense & Revenue Setup</span>
                </button>
              </li>
            )}
            <li>
              <a
                href="/ads.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-[11px] text-slate-500 font-mono"
              >
                <span>View /ads.txt Record</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Transparency & Legal */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Transparency & Trust</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('about')}
                className="hover:text-cyan-400 transition-colors"
              >
                About PulseFit Architecture
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('contact')}
                className="hover:text-cyan-400 transition-colors"
              >
                Contact & Support Inquiries
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('privacy')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy Policy & Ad Cookies</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('terms')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Terms of Service</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectTab('disclaimer')}
                className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Non-Medical Health Disclaimer</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar & Medical Notice */}
      <div className="border-t border-slate-800/80 bg-slate-950 px-4 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p className="text-center md:text-left leading-relaxed">
            <strong>Non-Medical Notice:</strong> PulseFit is an informational wellness and physical activity companion. Estimated calories, lipid oxidation, cadence, and vitality indices are derived from generalized exercise physiology equations and are not diagnostic medical values. Always consult a qualified physician before starting a rigorous exercise program.
          </p>

          <div className="flex items-center gap-4 shrink-0 text-slate-400">
            <span>© 2026 PulseFit</span>
            <span>·</span>
            <span>Runs locally on Chrome</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
