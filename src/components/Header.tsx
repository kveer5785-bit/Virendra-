import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  RefreshCw,
  Menu,
  X,
  LayoutDashboard,
  Footprints,
  Dumbbell,
  Calendar,
  Flame,
  Watch,
  BookOpen,
  Info,
  Mail,
  Shield,
  ShieldAlert,
  Database,
  Globe,
  TrendingUp,
  DollarSign,
  FileText,
} from 'lucide-react';
import { WearableDevice, ActiveTab } from '../types/health';

interface HeaderProps {
  activeWearable: WearableDevice;
  deviceFrame: 'iphone' | 'pixel' | 'fullscreen';
  activeTab: ActiveTab;
  onChangeFrame: (frame: 'iphone' | 'pixel' | 'fullscreen') => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenInstallModal: () => void;
  onOpenStorageModal: () => void;
  onOpenSeoModal: () => void;
  onOpenAdSenseModal?: () => void;
  onQuickSync: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeWearable,
  deviceFrame,
  activeTab,
  onChangeFrame,
  onSelectTab,
  onOpenInstallModal,
  onOpenStorageModal,
  onOpenSeoModal,
  onOpenAdSenseModal,
  onQuickSync,
  isSyncing,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'steps' as const, label: 'Daily Steps', icon: Footprints },
    { id: 'exercises' as const, label: 'Workouts', icon: Dumbbell },
    { id: 'weekly' as const, label: 'Weekly Trends', icon: TrendingUp },
    { id: 'calories' as const, label: 'Calories', icon: Flame },
    { id: 'wearables' as const, label: 'Wearables', icon: Watch },
    { id: 'education' as const, label: 'Guides', icon: BookOpen },
    { id: 'appointments' as const, label: 'Coaching', icon: Calendar },
  ];

  const secondaryNavItems = [
    { id: 'about' as const, label: 'About', icon: Info },
    { id: 'contact' as const, label: 'Contact', icon: Mail },
    { id: 'privacy' as const, label: 'Privacy Policy', icon: Shield },
    { id: 'terms' as const, label: 'Terms of Service', icon: FileText },
    { id: 'disclaimer' as const, label: 'Medical Disclaimer', icon: ShieldAlert },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single element wordmark & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20 shrink-0">
                P
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight leading-none block">
                  PulseFit
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none block mt-0.5">
                  Step & Vitality Tracker
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links (Responsive) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2">
            {/* Viewport Frame Mode Selector (Desktop only) */}
            <div className="hidden xl:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => onChangeFrame('fullscreen')}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  deviceFrame === 'fullscreen' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Full-screen website layout for Chrome & desktop browsers"
              >
                Website
              </button>
              <button
                type="button"
                onClick={() => onChangeFrame('iphone')}
                className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  deviceFrame === 'iphone' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Simulate iPhone mobile screen frame"
              >
                iPhone View
              </button>
              <button
                type="button"
                onClick={() => onChangeFrame('pixel')}
                className={`px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  deviceFrame === 'pixel' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Simulate Google Pixel mobile screen frame"
              >
                Pixel View
              </button>
            </div>

            {/* Quick Wearable Sync */}
            <button
              type="button"
              onClick={onQuickSync}
              disabled={isSyncing}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-xl transition-colors border border-transparent hover:border-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={`Sync ${activeWearable.name}`}
              aria-label="Sync Wearable Device"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            {/* AdSense & Revenue Setup */}
            {onOpenAdSenseModal && (
              <button
                type="button"
                onClick={onOpenAdSenseModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition-colors min-h-[44px]"
                title="Google AdSense & Ad Revenue Status: Verified & Live"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">AdSense Verified</span>
              </button>
            )}

            {/* In-App PWA Install */}
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-colors min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Responsive Slide-Over Menu (for Mobile & Tablet) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-xs bg-slate-950 border-r border-slate-800 h-full p-5 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl">
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm">
                    P
                  </div>
                  <div>
                    <span className="text-base font-extrabold text-white">PulseFit</span>
                    <span className="text-[10px] text-slate-400 block leading-none">Navigation Menu</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main App Destinations */}
              <div className="py-4 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 block mb-1">
                  Fitness Tracking
                </span>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Information & Legal Pages */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 block mb-1">
                  Information & Legal
                </span>

                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions: Storage & SEO Integration */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenStorageModal();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Storage & Backup</span>
                </div>
                <span className="text-[10px] text-slate-500">Local DB</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenSeoModal();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Search & Analytics</span>
                </div>
                <span className="text-[10px] text-slate-500">GSC / GA4</span>
              </button>

              {onOpenAdSenseModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdSenseModal();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-300 min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google AdSense</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Verified
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
