import React from 'react';
import { FileText, ShieldAlert, Scale, Ban, CheckCircle, ExternalLink } from 'lucide-react';

export const TermsOfServiceView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Legal & Terms of Use
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-400">Effective Date: October 2026</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>PulseFit Terms of Service</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Please review these Terms of Service ("Terms") carefully prior to using PulseFit. By accessing or interacting with our web application, you signify agreement to these binding terms.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>1. Acceptance of Terms & Eligibility</span>
          </h3>
          <p>
            By visiting, accessing, or logging physical activity on PulseFit (the "Service"), you confirm that you are at least 13 years of age (or the applicable age of digital consent in your jurisdiction) and possess full legal capacity to enter into these Terms. If you do not accept these Terms in full, you must discontinue use of the Service immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>2. Strict Non-Medical Information Disclaimer</span>
          </h3>
          <p>
            PulseFit is an informational and motivational fitness tracking web utility. All calculations, including daily steps, MET caloric expenditure, metabolic substrate partitioning (lipid vs. glycogen grams), cadence pacing, and vitality scores, are mathematical estimations based on generalized exercise physiology research.
          </p>
          <p className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200">
            <strong>CRITICAL MEDICAL NOTICE:</strong> Content on this website is NOT medical advice, diagnostic opinion, or individualized prescription. Never disregard professional medical advice or delay seeking care because of metrics displayed in this application. Consult a certified physician before starting any intense endurance or weight-loss program.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>3. Third-Party Advertisements & Google AdSense</span>
          </h3>
          <p>
            PulseFit may display advertisements provided by Google AdSense and third-party advertising partners. We do not endorse, guarantee, or assume liability for any products, services, or claims advertised through third-party ad networks.
          </p>
          <p>
            Users agree not to artificially inflate ad impressions, engage in automated click generation (click-fraud), or attempt to reverse-engineer ad tags. All ad interactions must be voluntary and genuine.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-400" />
            <span>4. Prohibited Uses & System Integrity</span>
          </h3>
          <p>When accessing PulseFit, you agree NOT to:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Deploy automated bots, scrapers, or crawlers that disrupt server bandwidth or cloud availability.</li>
            <li>Attempt to bypass client-side security measures or inject malicious scripts into local storage.</li>
            <li>Misrepresent the identity, medical diagnosis, or telemetry of other individuals.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>5. Limitation of Liability & Warranty Disclaimer</span>
          </h3>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, PULSEFIT AND ITS OPERATORS DISCLAIM ALL LIABILITY FOR PERSONAL INJURY, HARDWARE DAMAGE, DATA LOSS, OR INCIDENTAL DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE APPLICATION.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white">6. Inquiries Regarding Terms</h3>
          <p>
            For legal inquiries, copyright notices, or questions concerning these Terms of Service, please contact our legal desk at: <strong className="text-cyan-300">legal@pulsefit.health</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
