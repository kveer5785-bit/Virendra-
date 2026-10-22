import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Lock,
  Footprints,
  Flame,
  Activity,
  Heart,
  Droplets,
  Watch,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle,
  Database,
  Cpu,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'mission' | 'features' | 'science' | 'privacy'>('mission');

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-cyan-400">About PulseFit</span>
          <span aria-hidden="true">·</span>
          <span>Health Promotion & Movement Platform</span>
          <span aria-hidden="true">·</span>
          <span>Version 2.4</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-1.5">
          Science-Backed Daily Movement, Vitality & Metabolic Health
        </h2>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
          PulseFit is a modern, privacy-first wellness application built to transform daily physical habits into lasting vitality. By combining real-time device motion sensing, metabolic fuel partitioning, and evidence-based exercise routines, PulseFit bridges the gap between passive step counters and clinical health promotion.
        </p>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'mission' as const, label: 'Mission & Philosophy' },
            { id: 'features' as const, label: 'Feature Walkthrough' },
            { id: 'science' as const, label: 'Physiology & Algorithms' },
            { id: 'privacy' as const, label: 'Data Privacy & Architecture' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSection === tab.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Mission & Philosophy */}
      {activeSection === 'mission' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2.5 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Footprints className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Daily Consistency Over Intensity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extreme sporadic workouts cause burnout and injury. Cumulative Non-Exercise Activity Thermogenesis (NEAT)—sustained daily stepping and light movement—is the most reliable predictor of cardiovascular longevity.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2.5 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Metabolic Timing & Balance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Movement timed around meals (10-minute postprandial walks) and Zone 2 aerobic pacing optimizes mitochondrial function and clears circulating glucose without fatiguing muscle glycogen.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2.5 shadow-xl">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Uncompromised Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Health vitals belong to you. PulseFit operates on a client-side architecture where step counts, dietary logs, and wearable sync states stay stored in your browser's private storage.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white">Why PulseFit is Different</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Most fitness applications lock basic features behind aggressive paywalls, bombard users with intrusive pop-up dialogs, or sell behavioral movement telemetry to advertisers. PulseFit was designed as a sustainable, privacy-respecting, and clinically grounded daily wellness companion.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 2: Feature Walkthrough */}
      {activeSection === 'features' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2 shadow-xl">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Live Motion Sensor & Pedometer</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connects directly to your phone's triaxial accelerometer via the HTML5 DeviceMotionEvent API. Features adaptive peak filtering, noise thresholding, and cadence estimation in steps per minute (SPM).
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2 shadow-xl">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Guided Exercise & Health Routines</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeted workouts including the 10-Minute Post-Meal Glucose Blaster, 15-Minute Zone 2 Fat-Max Walk, 7-Minute Clinical Bodyweight Circuit, and Seated Soleus Pumps with real-time interval timers and audio chimes.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2 shadow-xl">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Metabolic Fuel Partitioning</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualizes grams of subcutaneous and visceral fat burned versus glycogen consumed in real time, encouraging users to walk at optimal fat-burning cadences (115-125 SPM).
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2 shadow-xl">
            <div className="flex items-center gap-2">
              <Watch className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Wearable Sync Gateway</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulates and synchronizes health vitals across Apple Watch Ultra, Galaxy Watch 7, Pixel Watch 3, and Garmin Forerunner with automatic battery and metric status monitoring.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2 shadow-xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Health Specialist Consultations</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Book virtual video consultations with certified sports nutritionists, physical therapists, and clinical exercise physiologists with one-click vitals export.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-2 shadow-xl">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Local Storage & One-Click Backup</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete data sovereignty: export your complete health history, meals, and wearable telemetry into a clean JSON file and restore it on any device anytime.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: Physiology & Algorithms */}
      {activeSection === 'science' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-xl">
          <div>
            <h3 className="text-base font-bold text-white">Our Estimation Methodology & Math</h3>
            <p className="text-xs text-slate-400 mt-1">
              PulseFit calculates health metrics using validated peer-reviewed sports science formulations:
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-cyan-400 font-mono">1. Step Distance Estimation</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculated using an individual adult stride length approximation of 0.762 meters per step (<span className="font-mono text-slate-200">distanceKm = (steps * 0.762) / 1000</span>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-rose-400 font-mono">2. Metabolic Equivalent of Task (MET) Energy Burn</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dynamic caloric expenditure is computed using standard MET tables adjusted for user weight:
                <br />
                <span className="font-mono text-slate-200 mt-1 block">
                  kcal = (MET * 3.5 * weightKg * durationMins) / 200
                </span>
                For baseline stepping at ~115 SPM, energy expenditure approximates 0.042 kcal per step for a 72kg person.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 font-mono">3. PulseFit Vitality Composite Index</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                An integrated 0-100 score assessing five core lifestyle dimensions:
                Movement consistency (30%), Caloric & Macro balance (20%), Resting cardiovascular rate (20%), Sleep duration & quality (15%), and Hydration compliance (15%).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Data Privacy & Architecture */}
      {activeSection === 'privacy' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Privacy-First Architecture</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            PulseFit was engineered from the ground up to protect user privacy. All physical activity data, dietary records, wearable configurations, and appointments are stored strictly inside your client browser's <code className="text-cyan-300 font-mono bg-slate-950 px-1 py-0.5 rounded">localStorage</code> sandbox.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">Zero Cloud Account Mandate</span>
                Use the full functionality of the application without having to create an account or provide passwords.
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">Zero Behavioral Data Brokerage</span>
                We never monetize or broker your movement data or biometric patterns to insurance or third-party marketing brokers.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
