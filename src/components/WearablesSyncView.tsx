import React, { useState } from 'react';
import { WearableDevice } from '../types/health';
import { Watch, Smartphone, Bluetooth, RefreshCw, CheckCircle, Battery, BatteryCharging, Zap, ShieldCheck, AlertCircle, Wifi } from 'lucide-react';

interface WearablesSyncViewProps {
  wearables: WearableDevice[];
  activeWearableId: string;
  onSelectActiveWearable: (id: string) => void;
  onSyncAll: () => Promise<void>;
  onTriggerDeviceSync: (deviceId: string) => void;
}

export const WearablesSyncView: React.FC<WearablesSyncViewProps> = ({
  wearables,
  activeWearableId,
  onSelectActiveWearable,
  onSyncAll,
  onTriggerDeviceSync,
}) => {
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [bleStatus, setBleStatus] = useState<string | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const handleSyncAllClick = async () => {
    setIsSyncingAll(true);
    await onSyncAll();
    setTimeout(() => {
      setIsSyncingAll(false);
    }, 1200);
  };

  const handleConnectBluetooth = async () => {
    if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      try {
        setBleStatus('Scanning for Bluetooth Low Energy fitness devices...');
        const nav = navigator as unknown as {
          bluetooth: {
            requestDevice: (options: object) => Promise<{ name?: string; id: string }>;
          };
        };
        const device = await nav.bluetooth.requestDevice({
          filters: [{ services: ['heart_rate'] }],
          optionalServices: ['battery_service'],
        });
        setBleStatus(`Paired with ${device.name || 'BLE Heart Rate Sensor'}! Direct telemetry streaming.`);
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name === 'NotFoundError') {
          setBleStatus('Bluetooth scan cancelled. No device selected.');
        } else {
          setBleStatus(`Bluetooth notice: ${error.message || 'Web Bluetooth requires user interaction and supported hardware.'}`);
        }
      }
    } else {
      setBleStatus('Web Bluetooth is supported in Chrome, Edge, and Android Chrome. Cloud sync is active for Apple Health & Google Health Connect.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Sync Center Hero */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Wearable Cloud & Sensor Gateway
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">iOS HealthKit & Android Health Connect</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Wearable Device Sync Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Continuous background telemetry syncing for daily steps, active calorie expenditure, resting heart rate, and sleep metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAllClick}
              disabled={isSyncingAll}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Syncing Vitals...' : 'Sync All Devices'}</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>All 4 Connected Gateways Operational</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Latency: &lt;1.2s</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={autoSyncEnabled}
              onChange={(e) => setAutoSyncEnabled(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <span className="text-[11px]">Real-time Auto Sync</span>
          </label>
        </div>
      </div>

      {/* Web Bluetooth Hardware Pairing */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Bluetooth className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Direct Web Bluetooth Pairing</h3>
            <p className="text-xs text-slate-400">
              Connect directly to BLE chest straps, Polar H10, Garmin HRM, or smart cadence pods.
            </p>
          </div>
        </div>

        <button
          onClick={handleConnectBluetooth}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Scan BLE Devices</span>
        </button>
      </div>

      {bleStatus && (
        <div className="p-3 bg-slate-900 border border-indigo-500/30 rounded-2xl text-xs text-indigo-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>{bleStatus}</span>
        </div>
      )}

      {/* Paired Devices Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Configured Wearables & Accounts</h3>
          <span className="text-xs text-slate-400">{wearables.length} devices available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wearables.map((device) => {
            const isActive = device.id === activeWearableId;

            return (
              <div
                key={device.id}
                className={`rounded-3xl p-5 border transition-all ${
                  isActive
                    ? 'bg-slate-900/95 border-cyan-500/50 shadow-xl shadow-cyan-500/5'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      device.type === 'apple_watch'
                        ? 'bg-slate-800 text-white'
                        : device.type === 'pixel_watch'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      <Watch className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{device.name}</h4>
                        {isActive && (
                          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{device.model}</p>
                    </div>
                  </div>

                  {/* Battery */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                    <Battery className={`w-4 h-4 ${device.batteryLevel > 20 ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span>{device.batteryLevel}%</span>
                  </div>
                </div>

                {/* Specs & Platform */}
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80 mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Gateway:</span>
                    <span className="text-slate-200 font-medium">
                      {device.platform === 'ios' ? 'Apple HealthKit (iOS)' : device.platform === 'android' ? 'Health Connect (Android)' : 'Cross-Platform API'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Last Telemetry Sync:</span>
                    <span className="text-emerald-400 font-mono">{device.lastSync}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Firmware:</span>
                    <span className="text-slate-300 font-mono text-[11px]">{device.firmwareVersion}</span>
                  </div>
                </div>

                {/* Synced Data Streams Chips */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block mb-1.5">
                    Synced Health Streams
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {device.syncedMetrics.map((metric, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  {!isActive && (
                    <button
                      onClick={() => onSelectActiveWearable(device.id)}
                      className="flex-1 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      Set as Primary
                    </button>
                  )}

                  <button
                    onClick={() => onTriggerDeviceSync(device.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
