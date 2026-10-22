import React from 'react';
import { AlertTriangle, ShieldAlert, HeartPulse, Activity } from 'lucide-react';

export const DisclaimerView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Mandatory Advisory
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-400">Non-Medical Disclaimer</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Health & Fitness Disclaimer</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Please read this disclaimer carefully before using PulseFit. The information provided across this application is intended exclusively for general educational, recreational, and lifestyle-tracking purposes.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-xl text-xs text-slate-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>1. Not Medical Advice or Clinical Diagnosis</span>
          </h3>
          <p>
            PulseFit, its content, tools, calculators, and vitality scores are <strong>not designed, intended, or certified as medical devices</strong>, nor do they constitute medical, clinical, or dietary advice. The application is not a substitute for professional medical examination, diagnosis, prognosis, or treatment by a licensed physician, registered dietitian, or cardiologist.
          </p>
          <p>
            Never disregard professional medical guidance, delay seeking clinical advice, or alter prescribed medication regimens based on information, step targets, or calorie calculations displayed in this application.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>2. Approximation of Sensor & Metabolic Calculations</span>
          </h3>
          <p>
            All physical measurements displayed within PulseFit—including daily step counts, walking distances, active caloric burn, cadence (steps per minute), resting heart rate, and the composite Vitality Score—are <strong>mathematical estimations</strong>.
          </p>
          <p>
            Actual metabolic expenditure varies significantly based on individual genetics, muscle fiber composition, ambient temperature, footwear, and metabolic efficiency. Pedometer sensor readings captured via smartphone accelerometers or consumer smartwatches can be influenced by arm movements, vehicle vibration, or sensor drift and must not be interpreted as laboratory-grade medical telemetry.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>3. Physical Activity & Dietary Risk Notice</span>
          </h3>
          <p>
            Participating in walking programs, aerobic endurance workouts, or hypocaloric dietary pacing carries inherent physical risks, particularly for individuals with pre-existing cardiovascular, metabolic, or musculoskeletal conditions.
          </p>
          <p>
            If at any point during physical movement you experience chest tightness, acute dizziness, shortness of breath, palpitations, nausea, or sharp joint pain, <strong>cease physical activity immediately and consult emergency medical services</strong>.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white">
            4. Personal Responsibility & Consultation Verification
          </h3>
          <p>
            By utilizing PulseFit, you acknowledge and agree that your physical activity and nutritional choices are undertaken voluntarily at your own discretion. Consultations booked through the specialist directory represent professional fitness, strength, or dietary coaching and do not establish a patient-physician relationship.
          </p>
        </section>
      </div>
    </div>
  );
};
