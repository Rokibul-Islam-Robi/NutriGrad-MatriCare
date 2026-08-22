import React, { useState } from 'react';
import { 
  Baby, 
  Sparkles, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  Info, 
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function PregnancyTracker() {
  const [currentWeek, setCurrentWeek] = useState(16);

  const weekMilestones = {
    4: { fruit: 'Poppy Seed (1 mm)', weight: '< 1 g', highlight: 'Blastocyst implants into the uterine lining. The neural tube begins forming.', momTip: 'Start prenatal folic acid daily.' },
    8: { fruit: 'Raspberry (1.6 cm)', weight: '1 g', highlight: 'Tiny webbed fingers and toes develop. The heart beats at ~150-170 bpm.', momTip: 'Stay hydrated to ease morning sickness.' },
    12: { fruit: 'Plum / Lime (5.4 cm)', weight: '14 g', highlight: 'All vital organs, kidneys, and reflexes are formed. Baby can open and close fingers!', momTip: 'End of 1st trimester. Energy usually begins returning.' },
    16: { fruit: 'Avocado (11.6 cm)', weight: '100 g', highlight: 'Baby can perceive light, suck their thumb, and facial muscles are flexing expressions.', momTip: 'You might start feeling tiny fluttering movements (quickening).' },
    20: { fruit: 'Banana (25.6 cm)', weight: '300 g', highlight: 'Midway milestone! Anomaly ultrasound scans reveal anatomy in full detail. Baby hears mother\'s voice.', momTip: 'Talk and play gentle music to your baby.' },
    24: { fruit: 'Ear of Corn (30 cm)', weight: '600 g', highlight: 'Taste buds are forming and lungs develop bronchial branches. Baby has a regular sleep/wake cycle.', momTip: 'Screening for Gestational Diabetes is typically conducted now.' },
    28: { fruit: 'Eggplant (37 cm)', weight: '1,000 g', highlight: 'Start of 3rd trimester. Baby can blink eyes with developed eyelashes and dreams in REM sleep.', momTip: 'Monitor daily baby kick counts (aim for 10 kicks in 2 hours).' },
    32: { fruit: 'Jicama / Squash (42 cm)', weight: '1,700 g', highlight: 'Bones are hardening (except skull which remains pliable for birth). Rapid brain neuron growth.', momTip: 'Elevate feet when resting to reduce pedal edema.' },
    36: { fruit: 'Papaya (47 cm)', weight: '2,600 g', highlight: 'Lungs are almost fully mature with surfactant. Baby is likely turning into head-down cephalic position.', momTip: 'Pack hospital bag and finalize birth plan.' },
    40: { fruit: 'Small Watermelon (51 cm)', weight: '3,400 g', highlight: 'Full term! Baby is ready to meet the world with full antibody protection from mother.', momTip: 'Watch for regular contractions and water breaking.' },
  };

  const milestonesKeys = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
  const nearestWeek = milestonesKeys.reduce((prev, curr) => 
    Math.abs(curr - currentWeek) < Math.abs(prev - currentWeek) ? curr : prev
  );
  const data = weekMilestones[nearestWeek];

  const getTrimester = (w) => {
    if (w <= 12) return '1st Trimester';
    if (w <= 27) return '2nd Trimester';
    return '3rd Trimester';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner with Walking Pregnant Mother Illustration */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#f43f5e] via-[#8b5cf6] to-[#6366f1] text-white p-6 sm:p-8 shadow-xl shadow-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
            <Baby className="h-3.5 w-3.5 text-yellow-300" />
            <span>Fetal Growth Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Week-by-Week Maternal & Fetal Development Tracker
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
            Monitor fetal growth measurements, organ maturation, and essential maternal wellbeing tips across all 40 weeks.
          </p>
        </div>

        {/* Uploaded Walking Art Embed */}
        <div className="shrink-0 z-10">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
            <img
              src="/pregnancy_walking_milestone.jpg"
              alt="Pregnancy Walking Milestone"
              className="relative h-44 w-auto object-cover rounded-2xl drop-shadow-2xl border-2 border-white/40 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Week Selector Slider Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Gestational Stage</span>
            <h2 className="text-3xl font-black text-slate-900 mt-0.5">Week {currentWeek}</h2>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              {getTrimester(currentWeek)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block">Baby is the size of a:</span>
            <span className="text-base sm:text-lg font-black text-slate-800">{data.fruit}</span>
          </div>
        </div>

        <div>
          <input
            type="range"
            min="4"
            max="40"
            step="1"
            value={currentWeek}
            onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2">
            <span>Week 4 (Conception)</span>
            <span>Week 20 (Midpoint)</span>
            <span>Week 40 (Due Date)</span>
          </div>
        </div>
      </div>

      {/* Fetal Highlights & Mom's Wellbeing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl border border-purple-100 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Fetal Developmental Milestones</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {data.highlight}
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-bold text-purple-900 border-t border-purple-200/60">
            <span>Estimated Weight: ~{data.weight}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 via-white to-pink-50 rounded-3xl border border-rose-100 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-800">
            <Heart className="h-5 w-5 text-rose-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Maternal Care & Wellbeing Tip</h3>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {data.momTip}
          </p>
          <div className="pt-2 text-xs text-rose-700 font-bold border-t border-rose-200/60">
            Stay nourished with frequent small meals, fresh fruits, and hydration.
          </div>
        </div>
      </div>

      {/* Red Flag Warning Box */}
      <div className="rounded-3xl bg-rose-50 border border-rose-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-800">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Emergency Red Flag Warnings</h3>
        </div>
        <p className="text-xs text-slate-700 font-medium">Contact your obstetrician or emergency antenatal clinic immediately if you experience:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-900 font-bold pt-1">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>Sudden severe swelling of face, hands, or feet</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>Severe persistent headache with blurred vision</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>Any vaginal bleeding or fluid leaking</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>Sharp severe upper abdominal pain (under ribs)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
