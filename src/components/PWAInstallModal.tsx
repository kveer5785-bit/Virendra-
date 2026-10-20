import React, { useState } from 'react';
import { X, Smartphone, Apple, Check, Share, PlusSquare, Download } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall?: () => void;
  isInstallable?: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  isInstallable,
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-lg">
            P
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Install PulseFit Mobile App</h3>
            <p className="text-xs text-slate-400">Step tracking & health meter on your home screen</p>
          </div>
        </div>

        {/* Platform switcher tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-5">
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              platform === 'ios'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Apple iOS</span>
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              platform === 'android'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>
        </div>

        {/* iOS Step-by-Step Instructions */}
        {platform === 'ios' ? (
          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </div>
              <div>
                <p className="text-slate-200 font-medium">Open in Safari</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Launch this URL in Apple Safari on your iPhone or iPad.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <span>Tap Share Button</span>
                  <Share className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Located in the bottom navigation bar of Safari.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <span>Select "Add to Home Screen"</span>
                  <PlusSquare className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  PulseFit will install as a native standalone app with full-screen experience and motion sensor support.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Android Step-by-Step Instructions */
          <div className="space-y-3.5 text-xs">
            {isInstallable && onTriggerInstall ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                <p className="text-slate-200 font-semibold">
                  Instant WebAPK Installation Available!
                </p>
                <button
                  onClick={() => {
                    onTriggerInstall();
                    onClose();
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Install PulseFit on Android</span>
                </button>
              </div>
            ) : (
              <>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium">Open in Chrome</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Open this web application in Google Chrome for Android.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium">Tap the Three Dots Menu (⋮)</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <p className="text-slate-200 font-medium">Direct Wearable & Sensor Sync</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Syncs with Google Health Connect, Wear OS, and internal pedometer sensors.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
