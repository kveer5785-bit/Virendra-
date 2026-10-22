import React, { useState } from 'react';
import { X, Search, BarChart3, ShieldCheck, Copy, Check, ExternalLink, Globe, FileCode } from 'lucide-react';

interface AnalyticsAndSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMeasurementId?: string;
  onSaveMeasurementId: (id: string) => void;
}

export const AnalyticsAndSeoModal: React.FC<AnalyticsAndSeoModalProps> = ({
  isOpen,
  onClose,
  currentMeasurementId = '',
  onSaveMeasurementId,
}) => {
  const [activeTab, setActiveTab] = useState<'gsc' | 'ga4' | 'sitemap'>('gsc');
  const [inputGaId, setInputGaId] = useState(currentMeasurementId);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMeasurementId(inputGaId.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative my-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Google Search Console & Analytics Integration</h3>
            <p className="text-xs text-slate-400">Step-by-step setup without exposing private secrets or PII</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('gsc')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'gsc'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Google Search Console</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ga4')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'ga4'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Analytics 4</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sitemap')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'sitemap'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Sitemap & Robots</span>
          </button>
        </div>

        {/* TAB 1: GOOGLE SEARCH CONSOLE */}
        {activeTab === 'gsc' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-white block">Why GSC Requires Zero Secrets</span>
              <p className="text-slate-400 text-[11px]">
                Search Console only verifies that you have administrative ownership of your domain or web property. You do not need to supply any API keys or passwords.
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs">Step-by-Step GSC Verification Options:</h4>

              {/* Method A: HTML Tag */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300">Method A: HTML Verification Tag (Easiest)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('<meta name="google-site-verification" content="YOUR_TOKEN" />', 'meta')}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"
                  >
                    {copiedKey === 'meta' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'meta' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  1. Open Google Search Console and add your production URL as a <strong>URL Prefix</strong> property.<br />
                  2. Choose <strong>HTML tag</strong> verification.<br />
                  3. Copy your verification code token into <code>index.html</code> inside the <code>&lt;head&gt;</code> tag:<br />
                </p>
                <pre className="p-2 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto">
                  &lt;meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" /&gt;
                </pre>
                <p className="text-[11px] text-slate-400">
                  4. Click <strong>Verify</strong> in Google Search Console.
                </p>
              </div>

              {/* Method B: DNS TXT Record */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-300 block">Method B: DNS TXT Record (Recommended for Custom Domains)</span>
                <p className="text-[11px] text-slate-400">
                  If using a custom domain (e.g. pulsefit.health), select the <strong>Domain</strong> property type in Search Console and add the provided TXT record at your DNS registrar (Cloudflare, Namecheap, Google Domains). This requires zero code changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GOOGLE ANALYTICS 4 */}
        {activeTab === 'ga4' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero PII & Privacy-Preserving Configuration</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                A Google Analytics Measurement ID (starting with <code>G-</code>) is an open public telemetry ID, not an API secret. PulseFit ensures no meal names, body weight, or personal medical entries are ever transmitted to GA4.
              </p>
            </div>

            <form onSubmit={handleSaveGa} className="space-y-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Configure GA4 Measurement ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={inputGaId}
                    onChange={(e) => setInputGaId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow"
                  >
                    Save ID
                  </button>
                </div>
              </div>

              {saveSuccess && (
                <p className="text-[11px] text-emerald-400 font-medium">
                  Measurement ID updated! Privacy-mode analytics initialized.
                </p>
              )}

              <p className="text-[11px] text-slate-400">
                You can also configure this permanently in your hosting environment as <code>VITE_GA_MEASUREMENT_ID</code>.
              </p>
            </form>

            <div className="space-y-1.5">
              <span className="font-bold text-white text-xs block">Privacy Parameters Automatically Applied:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                <li><code>anonymize_ip: true</code> — Masking user IP addresses before storage.</li>
                <li><code>allow_ad_personalization_signals: false</code> — Restricting behavioral ad targeting.</li>
                <li>Zero custom user dimensions containing dietary or physical logs.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: SITEMAP & ROBOTS */}
        {activeTab === 'sitemap' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-white block">Sitemap & Crawler Directives</span>
              <p className="text-slate-400 text-[11px]">
                PulseFit includes pre-configured <code>/sitemap.xml</code> and <code>/robots.txt</code> files ready for search crawlers like Googlebot and Bingbot.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-white block">Sitemap Location:</span>
                <div className="p-2 bg-slate-900 rounded font-mono text-cyan-300 text-[11px] flex justify-between items-center">
                  <span>https://pulsefit.health/sitemap.xml</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('https://pulsefit.health/sitemap.xml', 'sitemap')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'sitemap' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  In Google Search Console, navigate to <strong>Sitemaps</strong> in the left sidebar and paste <code>sitemap.xml</code> to index all guides and pages.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-white block">Robots.txt Location:</span>
                <div className="p-2 bg-slate-900 rounded font-mono text-slate-300 text-[11px]">
                  https://pulsefit.health/robots.txt
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Allows search engine indexing across all public views while securing privacy.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
