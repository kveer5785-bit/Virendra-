import React, { useState } from 'react';
import { X, Database, Download, Upload, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';

interface StorageExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => boolean;
  onResetAllData: () => void;
}

export const StorageExplanationModal: React.FC<StorageExplanationModalProps> = ({
  isOpen,
  onClose,
  onExportData,
  onImportData,
  onResetAllData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportData(content);
        if (success) {
          setImportStatus('Backup restored successfully! Refreshing view...');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1400);
        } else {
          setImportStatus('Invalid backup file format. Please check the JSON structure.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Browser Storage & Device Limitations</h3>
            <p className="text-xs text-slate-400">How your daily health data is saved and preserved</p>
          </div>
        </div>

        {/* Informational Explanation List */}
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-5">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="font-semibold text-white block">1. 100% On-Device Persistence</span>
            <p className="text-[11px] text-slate-400">
              Your step logs, daily goals, meal diary, water intake, and appointments are stored locally in your browser's <code>localStorage</code> database under your current origin.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="font-semibold text-amber-300 block">2. Private & Incognito Browsing Caveat</span>
            <p className="text-[11px] text-slate-400">
              If you browse in Private (Safari) or Incognito (Chrome), browsers discard local storage once all private tabs are closed. Use regular browsing or install PulseFit to your Home Screen to ensure persistence.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-300 block">3. iOS Safari 7-Day Storage Cap (WebKit ITP)</span>
            <p className="text-[11px] text-slate-400">
              Apple WebKit may delete script-writable storage after 7 days of inactivity in Safari. <strong>Installing PulseFit to your iPhone Home Screen (PWA mode)</strong> bypasses this restriction and grants permanent storage.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block">4. Background Accelerometer Execution</span>
            <p className="text-[11px] text-slate-400">
              Web browsers pause JavaScript motion listeners when the phone screen is turned off or minimized. PulseFit activates the Screen Wake Lock API during active walk workouts to keep tracking uninterrupted.
            </p>
          </div>
        </div>

        {/* Data Backup & Restore Action Bar */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-white block">Data Backup & Migration</span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onExportData}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Backup (.json)</span>
            </button>

            <label className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restore Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="text-[11px] text-cyan-300 text-center font-medium">
              {importStatus}
            </p>
          )}
        </div>

        {/* Reset All Data Section */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          {showConfirmReset ? (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-rose-300 font-semibold">Permanently erase all local data?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1 bg-slate-800 text-xs text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllData();
                    setShowConfirmReset(false);
                    onClose();
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold rounded-lg"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Saved Data</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Understood
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
