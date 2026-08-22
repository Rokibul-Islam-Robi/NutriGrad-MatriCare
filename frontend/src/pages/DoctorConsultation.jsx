import React, { useState } from 'react';
import { 
  Stethoscope, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  UserCheck, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Bot,
  Heart,
  Headphones
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorConsultation() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your NutriGrad-MatriCare Maternal Health Assistant. You can ask me questions about your pregnancy diet, medication safety, or symptoms. How are you feeling today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [booking, setBooking] = useState({ doctor: 'Dr. Sarah Connor, MD', date: '', time: '10:00 AM', reason: '' });
  const [booked, setBooked] = useState(false);

  const doctors = [
    {
      name: 'Dr. Sarah Connor, MD',
      role: 'Senior Maternal-Fetal Medicine Specialist',
      hospital: 'Apex Maternity & Fetal Care Hospital',
      experience: '14+ Years Exp',
      availability: 'Mon - Fri (09:00 AM - 04:00 PM)',
      phone: '+1 (800) 450-MOM1'
    },
    {
      name: 'Dr. Elena Rostova, PhD',
      role: 'Lead Clinical Prenatal Nutritionist',
      hospital: 'Women & Child Wellness Center',
      experience: '10+ Years Exp',
      availability: 'Tue - Sat (10:00 AM - 06:00 PM)',
      phone: '+1 (800) 450-NUTR'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    setTimeout(() => {
      let reply = "Thank you for asking. During pregnancy, always keep your obstetrician updated on your symptoms. Ensure you maintain adequate hydration (2.5L water) and follow your prescribed iron & calcium schedule.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('iron') || lower.includes('anemia') || lower.includes('hemoglobin')) {
        reply = "For healthy hemoglobin levels, pair iron-rich foods (spinach, lentils, beets) with Vitamin C (oranges, tomatoes) for optimal absorption. Avoid taking iron together with milk or tea.";
      } else if (lower.includes('blood pressure') || lower.includes('bp') || lower.includes('swelling')) {
        reply = "Elevated blood pressure (≥140/90 mmHg) or sudden swelling warrants a prompt blood pressure check. Reduce sodium intake and consult Dr. Sarah immediately if headaches or blurred vision occur.";
      } else if (lower.includes('sugar') || lower.includes('glucose') || lower.includes('diabetes')) {
        reply = "To stabilize blood sugar, eat complex carbohydrates (oats, brown rice, chia seeds) and avoid refined sweets. Spread your meals across 6 smaller portions throughout the day.";
      } else if (lower.includes('nausea') || lower.includes('vomit') || lower.includes('morning sickness')) {
        reply = "To ease nausea, try dry crackers before getting out of bed, ginger tea, and eating smaller frequent meals. Stay hydrated with small sips of water.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 700);
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    setBooked(true);
    toast.success(`Consultation request confirmed with ${booking.doctor}!`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200">
            <Stethoscope className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Doctor Consultation & Telehealth Support</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Direct access to obstetricians, clinical nutritionists, and 24/7 maternal emergency helpline.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white p-6 sm:p-8 shadow-xl shadow-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md animate-pulse">
            <PhoneCall className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200">24/7 Maternal Emergency Helpline</span>
            <h2 className="text-xl sm:text-2xl font-black">Call +1 (800) 999-MATERNAL or 911</h2>
            <p className="text-xs text-rose-100 font-medium mt-0.5">Immediate triage assistance for acute abdominal pain, vaginal bleeding, or decreased fetal movement.</p>
          </div>
        </div>

        <a
          href="tel:911"
          className="rounded-2xl bg-white text-rose-600 px-6 py-3 text-xs font-black shadow-lg hover:bg-rose-50 transition-all hover:scale-105 shrink-0 z-10"
        >
          Call Emergency SOS
        </a>
      </div>

      {/* Grid: AI Chatbot Assistant (Left) & Book Specialist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Maternal Health AI Assistant (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Maternal AI Clinical Guide</h3>
                <p className="text-[10px] text-emerald-600 font-bold">● Active 24/7 • Instant Pregnancy Q&A</p>
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-tr-none shadow-xs font-medium'
                      : 'bg-purple-50/70 text-slate-800 border border-purple-100 rounded-tl-none font-medium'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 font-semibold">{m.sender === 'user' ? 'You' : 'NutriGrad AI'}</span>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about diet, hemoglobin, blood pressure, fetal growth..."
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-xs font-medium focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:opacity-95 transition-all shadow-sm cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Doctor Consultation Booking (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="h-5 w-5 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Book Specialist Appointment</h3>
          </div>

          {booked ? (
            <div className="py-8 text-center space-y-3 bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <UserCheck className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-950">Appointment Request Sent!</h4>
              <p className="text-xs text-emerald-800 font-medium">
                Clinic staff will contact you at your registered phone number to confirm the consultation timing.
              </p>
              <button
                onClick={() => setBooked(false)}
                className="text-xs font-bold text-emerald-900 underline mt-2 cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700">Select Specialist</label>
                <select
                  value={booking.doctor}
                  onChange={(e) => setBooking({ ...booking, doctor: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                >
                  <option value="Dr. Sarah Connor, MD">Dr. Sarah Connor (Obstetrician)</option>
                  <option value="Dr. Elena Rostova, PhD">Dr. Elena Rostova (Prenatal Dietitian)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Time Slot</label>
                  <select
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                  >
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:30 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Reason for Consultation</label>
                <textarea
                  rows="3"
                  value={booking.reason}
                  onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
                  placeholder="e.g. Review iron supplementation, discuss high blood sugar..."
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-200 hover:opacity-95 transition-all hover:scale-[1.01] cursor-pointer"
              >
                Request Telehealth Consultation
              </button>
            </form>
          )}

          {/* Doctor Info Cards */}
          <div className="pt-2 space-y-2 border-t border-slate-100">
            {doctors.map((d, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-slate-700 space-y-0.5">
                <p className="font-bold text-slate-900">{d.name}</p>
                <p className="text-[11px] text-purple-700 font-bold">{d.role}</p>
                <p className="text-[10px] text-slate-400 font-medium">{d.hospital} • {d.availability}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
