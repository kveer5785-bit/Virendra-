import React from 'react';
import { ActiveTab } from '../types/health';
import { LayoutDashboard, Footprints, Dumbbell, Flame, TrendingUp } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isInsideFrame?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  isInsideFrame = false,
}) => {
  const tabs = [
    { id: 'dashboard' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'steps' as const, label: 'Steps', icon: Footprints },
    { id: 'exercises' as const, label: 'Exercise', icon: Dumbbell },
    { id: 'calories' as const, label: 'Calories', icon: Flame },
    { id: 'weekly' as const, label: 'Trends', icon: TrendingUp },
  ];

  return (
    <nav
      className={`${
        isInsideFrame
          ? 'absolute bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 w-full'
          : 'fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 max-w-xl mx-auto lg:hidden'
      }`}
    >
      <div className="grid grid-cols-5 items-center h-16 px-1 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all relative ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[62px]">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

