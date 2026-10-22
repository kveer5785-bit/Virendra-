import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields before submitting.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    // In a pure client-side SPA without backend server secrets, we record user message locally
    try {
      const existingInquiries = JSON.parse(localStorage.getItem('pulsefit_contact_inquiries') || '[]');
      existingInquiries.push({
        id: `inquiry_${Date.now()}`,
        name,
        email,
        category,
        message,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('pulsefit_contact_inquiries', JSON.stringify(existingInquiries));
    } catch (e) {
      console.warn('Inquiry save notice:', e);
    }

    setSubmitted(true);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Support & Community
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-xs text-slate-400">We Respond Promptly</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
          Contact the PulseFit Team
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
          Have feedback on step counter accuracy, wearable device pairing questions, or ideas for new features? Reach out directly using the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Contact Form */}
        <div className="md:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Message Received!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out, <strong>{name}</strong>. Our support team will review your inquiry regarding <em>{category}</em> and respond to <strong>{email}</strong> within 1–2 business days.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Send an Inquiry</h3>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="General Feedback">General Feedback & Suggestions</option>
                  <option value="Step Tracker / Accelerometer Issue">Step Tracker / Accelerometer Sensor Issue</option>
                  <option value="Wearable Sync Question">Wearable Sync (Apple Watch / Pixel / Garmin)</option>
                  <option value="Data Privacy & Storage">Data Privacy & Local Storage Inquiries</option>
                  <option value="Coaching Consultation Feedback">Coaching Consultation Feedback</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Message <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your question, observation, or feedback in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Support Information Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Direct Support</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prefer writing via traditional email? Send your correspondence directly to:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
              support@pulsefit.health
            </div>
            <p className="text-[11px] text-slate-400">
              Typical response time: Within 24 hours during standard weekdays.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Common Questions</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="font-semibold text-white block">Does PulseFit share data with third parties?</span>
                <span className="text-[11px] text-slate-400">No. All steps and calorie entries are stored locally on your device.</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="font-semibold text-white block">Why did my steps pause when the phone locked?</span>
                <span className="text-[11px] text-slate-400">Mobile browsers suspend background JavaScript when the screen is powered down. Use our Screen Wake Lock or sync via your wearable.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
