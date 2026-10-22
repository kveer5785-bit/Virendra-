import React, { useState } from 'react';
import { Specialist, HealthAppointment, HealthMeterMetrics, DailyActivity } from '../types/health';
import { Calendar, Clock, Video, UserCheck, Star, ShieldCheck, CheckCircle2, ChevronRight, X, Sparkles, MapPin, ExternalLink, CalendarPlus } from 'lucide-react';

interface AppointmentsViewProps {
  specialists: Specialist[];
  appointments: HealthAppointment[];
  metrics: HealthMeterMetrics;
  activity: DailyActivity;
  onBookAppointment: (appointment: Omit<HealthAppointment, 'id' | 'createdAt'>) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  specialists,
  appointments,
  metrics,
  activity,
  onBookAppointment,
  onCancelAppointment,
}) => {
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'specialists'>('upcoming');

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState('2026-10-22');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [consultationType, setConsultationType] = useState<HealthAppointment['consultationType']>('video');
  const [focusArea, setFocusArea] = useState<HealthAppointment['focusArea']>('Step & Cardio Optimization');
  const [patientNotes, setPatientNotes] = useState('');
  const [includeHealthVitals, setIncludeHealthVitals] = useState(true);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<HealthAppointment | null>(null);
  const [videoCallSession, setVideoCallSession] = useState<HealthAppointment | null>(null);

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed');
  const pastAppointments = appointments.filter(a => a.status !== 'confirmed');

  const handleStartBooking = (spec: Specialist) => {
    setSelectedSpecialist(spec);
    setSelectedSlot(spec.slots[0] || '10:00 AM');
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpecialist) return;

    const newAppointment: Omit<HealthAppointment, 'id' | 'createdAt'> = {
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      specialistTitle: selectedSpecialist.title,
      consultationType,
      focusArea,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'confirmed',
      patientNotes: patientNotes || `Reviewing ${focusArea.toLowerCase()} metrics and wearable trends.`,
      includeHealthVitals,
      meetingLink: `https://pulsefit.health/video/call-${Date.now().toString().slice(-5)}`,
    };

    onBookAppointment(newAppointment);

    const fullCreated = {
      ...newAppointment,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setSelectedSpecialist(null);
    setBookingSuccessModal(fullCreated);
    setActiveTab('upcoming');
  };

  const generateICSFile = (apt: HealthAppointment) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PulseFit Health//Appointment Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:PulseFit Health: ${apt.specialistName} (${apt.focusArea})`,
      `DESCRIPTION:Consultation with ${apt.specialistTitle}. Meeting link: ${apt.meetingLink || 'N/A'}\\nNotes: ${apt.patientNotes}`,
      `DTSTART:20261022T100000Z`,
      `DTEND:20261022T103000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PulseFit_${apt.specialistName.replace(/[^a-zA-Z]/g, '')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Controls */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Fitness & Performance Coaching
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">Certified Specialists</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Fitness & Movement Consultations
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Book certified exercise physiologists, strength coaches, and sports dietitians who analyze your step volume, caloric balance, and wearable trends.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Bookings ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('specialists')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'specialists'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Find Specialist
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: MY APPOINTMENTS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
              <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white">No Upcoming Appointments</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Schedule a 1-on-1 session to review your step targets, calorie burns, and wearable trends.
              </p>
              <button
                onClick={() => setActiveTab('specialists')}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow"
              >
                Browse Available Specialists
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-3xl bg-slate-900 border border-cyan-500/30 p-5 shadow-xl relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white font-bold text-base shadow">
                        {apt.specialistName.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-400">Confirmed Booking</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-xs text-slate-400 capitalize">{apt.consultationType} Call</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{apt.specialistName}</h4>
                        <p className="text-xs text-slate-400">{apt.specialistTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => generateICSFile(apt)}
                        className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
                        title="Add to Apple Calendar / Outlook (.ics)"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add to Calendar</span>
                      </button>

                      <button
                        onClick={() => setVideoCallSession(apt)}
                        className="px-4 py-1.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Room</span>
                      </button>
                    </div>
                  </div>

                  {/* Consultation Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                    <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Date & Time</span>
                      </div>
                      <div className="text-xs font-semibold text-white">
                        {apt.date} · {apt.timeSlot}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Focus Protocol</span>
                      </div>
                      <div className="text-xs font-semibold text-white truncate">
                        {apt.focusArea}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Wearable Sync</span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-400">
                        {apt.includeHealthVitals ? 'Live Vitals Attached' : 'Standard Session'}
                      </div>
                    </div>
                  </div>

                  {/* Pre-Appointment Vitals Attached */}
                  {apt.includeHealthVitals && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-300">
                          Pre-consultation packet attached: <strong className="text-white font-mono">{activity.steps.toLocaleString()} steps</strong>, <strong className="text-white font-mono">{metrics.overallScore}/100 Health Meter</strong>, and <strong className="text-white font-mono">{metrics.restingHeartRateBpm} bpm RHR</strong>.
                        </span>
                      </div>
                      <button
                        onClick={() => onCancelAppointment(apt.id)}
                        className="text-slate-400 hover:text-rose-400 text-[11px] transition-colors ml-2 shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Past Consultations */}
          {pastAppointments.length > 0 && (
            <div className="pt-4">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3">
                Completed & Past Sessions
              </h4>
              <div className="space-y-2">
                {pastAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{apt.specialistName}</div>
                      <div className="text-slate-400">{apt.focusArea} · {apt.date}</div>
                    </div>
                    <span className="text-slate-400 font-medium">Completed</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: AVAILABLE SPECIALISTS */}
      {activeTab === 'specialists' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialists.map((spec) => (
              <div
                key={spec.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${spec.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow`}>
                        {spec.name.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{spec.name}</h4>
                        <p className="text-xs font-medium text-cyan-400">{spec.title}</p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-slate-200 font-semibold">{spec.rating}</span>
                          <span>({spec.reviewsCount} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                      {spec.consultationFee}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {spec.bio}
                  </p>

                  <div className="text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 mb-4">
                    <span className="text-slate-300 font-medium">Specialty: </span>
                    {spec.specialty}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400">
                    Next Available: <strong className="text-emerald-400">{spec.availableDays[0]}</strong>
                  </div>

                  <button
                    onClick={() => handleStartBooking(spec)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow"
                  >
                    <span>Book Appointment</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedSpecialist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-400">
                  Step 2 of 2: Confirm Appointment Details
                </span>
                <h3 className="text-lg font-bold text-white">Book with {selectedSpecialist.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSpecialist(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="mt-4 space-y-4">
              {/* Consultation Focus */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Consultation Focus Area
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value as HealthAppointment['focusArea'])}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="Step & Cardio Optimization">Step & Cardio Optimization (Cadence & Heart Rate)</option>
                  <option value="Calorie Deficit & Macros">Calorie Deficit & Macros (Metabolic Nutrition)</option>
                  <option value="Wearable Data Review">Wearable Data Review (Apple Watch / Pixel / Garmin Sync)</option>
                  <option value="Recovery & Sleep">Recovery & Sleep (HRV & Sleep Architecture)</option>
                  <option value="Comprehensive Health Check">Comprehensive Health Check</option>
                </select>
              </div>

              {/* Consultation Format */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Consultation Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationType('video')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      consultationType === 'video'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Video className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold block">HD Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('in_person')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      consultationType === 'in_person'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold block">In-Clinic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType('wearable_review')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      consultationType === 'wearable_review'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold block">Data Audit</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-10-21"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Available Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {selectedSpecialist.slots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vitals Sync Checkbox */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHealthVitals}
                    onChange={(e) => setIncludeHealthVitals(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">
                      Sync today's Wearable Health Meter packet
                    </span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      Sends your {activity.steps.toLocaleString()} daily steps, {metrics.overallScore}/100 Health Meter score, and resting HR to {selectedSpecialist.name} ahead of time.
                    </span>
                  </div>
                </label>
              </div>

              {/* Patient Note */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Notes or Questions for Doctor (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Want to optimize step cadence to lower resting heart rate and verify calorie deficit..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpecialist(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
                >
                  Confirm & Schedule ({selectedSpecialist.consultationFee})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING SUCCESS MODAL */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white">Appointment Confirmed!</h3>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Your consultation with <strong className="text-white">{bookingSuccessModal.specialistName}</strong> has been secured.
            </p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-1.5 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-white">{bookingSuccessModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time:</span>
                <span className="font-semibold text-white">{bookingSuccessModal.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Focus:</span>
                <span className="font-semibold text-cyan-400">{bookingSuccessModal.focusArea}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => generateICSFile(bookingSuccessModal)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <CalendarPlus className="w-4 h-4 text-cyan-400" />
                <span>Save to Calendar</span>
              </button>
              <button
                onClick={() => setBookingSuccessModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE VIDEO CONSULTATION ROOM MODAL */}
      {videoCallSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
            {/* Top Bar */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Live Health Consultation</span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-400">{videoCallSession.specialistName}</span>
              </div>
              <button
                onClick={() => setVideoCallSession(null)}
                className="px-3 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold rounded-lg"
              >
                Leave Room
              </button>
            </div>

            {/* Video Screen Area with Doctor & Wearable HUD */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
              {/* Doctor Avatar Presentation */}
              <div className="text-center z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-2xl ring-4 ring-cyan-500/20">
                  {videoCallSession.specialistName.slice(0, 2)}
                </div>
                <h4 className="text-base font-bold text-white">{videoCallSession.specialistName}</h4>
                <p className="text-xs text-cyan-300">{videoCallSession.specialistTitle}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                  Audio & Video Connected · Encrypted HIPAA-Compliant
                </span>
              </div>

              {/* Live Wearable Telemetry Overlay on the corner */}
              <div className="absolute bottom-4 left-4 p-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl text-[11px] space-y-1 z-20">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real-time Wearable HUD</span>
                </div>
                <div className="text-white font-mono">Steps: {activity.steps.toLocaleString()}</div>
                <div className="text-white font-mono">Health Meter: {metrics.overallScore}/100</div>
                <div className="text-white font-mono">Heart Rate: {metrics.restingHeartRateBpm} bpm</div>
              </div>

              {/* User Camera PIP */}
              <div className="absolute top-4 right-4 w-28 h-20 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex items-center justify-center z-20 shadow-lg">
                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-300">You</div>
                  <span className="text-[10px] text-slate-400">Camera On</span>
                </div>
              </div>
            </div>

            {/* Video Controls Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Session Focus: <strong className="text-slate-200">{videoCallSession.focusArea}</strong>
              </span>

              <button
                onClick={() => setVideoCallSession(null)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
