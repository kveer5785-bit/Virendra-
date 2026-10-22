import React from 'react';
import { Lock, ShieldCheck, Database, EyeOff, RefreshCw } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Legal & Trust
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-400">Effective Date: October 2026</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
          PulseFit Privacy Policy
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          At PulseFit, our primary architectural principle is data minimization. Your personal health logs, dietary records, and step motion telemetry remain under your exclusive control.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>1. Client-Side Local Storage Architecture</span>
          </h3>
          <p>
            PulseFit operates primarily as a client-side web application. All step records, calorie entries, macro computations, hydration logs, and user physical profiles (weight, height, age) are saved directly in your web browser's <code>localStorage</code> database under your origin domain.
          </p>
          <p>
            We do not transmit your sensitive dietary logs or physical vitals to remote ad-tech brokers or marketing databases. If you clear your browser cache or browse in private/incognito mode, your local data will be reset.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2. Hardware Sensors & Device Permissions</span>
          </h3>
          <p>
            To provide real-time step counting, PulseFit requests access to the <code>DeviceMotionEvent</code> API (accelerometer). This motion data is processed strictly in volatile memory on your device to detect cadence peaks and is never broadcast or recorded on remote servers.
          </p>
          <p>
            When initiating a walking session, the app may request the <code>navigator.wakeLock</code> API to keep your mobile screen illuminated, preventing browser suspension. When pairing Bluetooth fitness accessories, communication occurs strictly over local peer-to-peer Web Bluetooth channels.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-400" />
            <span>3. Analytics & Telemetry Transparency</span>
          </h3>
          <p>
            If Google Analytics 4 is enabled by the site administrator, it is configured in strict privacy-preserving mode:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>IP Anonymization is permanently enforced.</li>
            <li>Ad-personalization signals and Google Signals are disabled by default.</li>
            <li>Zero Personally Identifiable Information (PII), such as meal logs, user names, or health entries, is passed to telemetry endpoints.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>4. Google AdSense & Third-Party Advertising Cookies</span>
          </h3>
          <p>
            To keep PulseFit accessible as a free health and fitness tracking web portal, we display advertisements served by Google AdSense and its certified advertising network partners.
          </p>
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
            <p className="font-semibold text-white">Google AdSense Policy Compliance Disclosures:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                <strong>Third-Party Vendor Cookies:</strong> Third-party vendors, including Google, use cookies and web beacons to serve advertisements based on your prior visits to our website or other internet websites.
              </li>
              <li>
                <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve targeted ads to users based on their navigation history across PulseFit and other sites on the World Wide Web.
              </li>
              <li>
                <strong>Opt-Out Mechanisms:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Ads Settings</a>. Alternatively, users may opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">www.aboutads.info/choices</a>.
              </li>
              <li>
                <strong>Zero Health Data Sharing:</strong> PulseFit maintains a strict firewall between your client-side fitness logs (steps, calories, biometric estimates) and advertising scripts. No personal health records, weight metrics, or food logs are ever passed to advertising brokers.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>5. GDPR (EEA/UK) & CCPA/CPRA Privacy Rights</span>
          </h3>
          <p>
            Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA/CPRA), visitors possess rights regarding cookie consent and automated data profiling:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Right to Restrict Processing:</strong> You can choose to reject personalized advertising cookies via our on-site Cookie Consent banner. In this case, only contextual, non-personalized ads will be requested.</li>
            <li><strong>Do Not Sell My Personal Information:</strong> We do not sell user personal data. Advertising partners receive standard browser network requests necessary to render ad inventory.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>6. Your Rights: Full Data Export & Permanent Deletion</span>
          </h3>
          <p>
            You retain absolute ownership of your data. You can inspect, back up to JSON, or permanently purge all stored activity records at any time using the Data & Storage controls in PulseFit settings or by clearing your browser cache.
          </p>
          <p className="text-slate-400">
            For privacy inquiries or technical questions regarding data management, contact: <strong className="text-cyan-300">privacy@pulsefit.health</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
