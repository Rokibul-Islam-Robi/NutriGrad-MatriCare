import React, { useState } from 'react';
import { Pill, Plus, CheckCircle2, Clock, AlertCircle, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MedicationTracker() {
  const [supplements, setSupplements] = useState([
    { id: 1, name: 'Folic Acid', dosage: '400 mcg', timing: 'Morning (After Breakfast)', purpose: 'Neural tube & spinal development', taken: true },
    { id: 2, name: 'Ferrous Sulfate (Iron)', dosage: '60 mg', timing: 'Mid-Morning (with Orange Juice)', purpose: 'Hemoglobin synthesis & anemia prevention', taken: false },
    { id: 3, name: 'Calcium Carbonate + D3', dosage: '500 mg', timing: 'Evening (After Dinner)', purpose: 'Fetal skeletal bone & tooth density', taken: true },
    { id: 4, name: 'Prenatal Omega-3 (DHA)', dosage: '200 mg', timing: 'Lunchtime', purpose: 'Fetal brain & visual retina development', taken: false },
  ]);

  const [newMed, setNewMed] = useState({ name: '', dosage: '', timing: '', purpose: '' });
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleTaken = (id) => {
    setSupplements(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.taken;
        toast.success(`${s.name} marked as ${nextState ? 'taken' : 'pending'}`);
        return { ...s, taken: nextState };
      }
      return s;
    }));
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMed.name) return;
    const item = {
      id: Date.now(),
      name: newMed.name,
      dosage: newMed.dosage || 'As prescribed',
      timing: newMed.timing || 'Daily',
      purpose: newMed.purpose || 'Doctor recommendation',
      taken: false,
    };
    setSupplements(prev => [...prev, item]);
    setNewMed({ name: '', dosage: '', timing: '', purpose: '' });
    setShowAddModal(false);
    toast.success('Medication added to your daily schedule!');
  };

  const completedCount = supplements.filter(s => s.taken).length;
  const progressPercent = Math.round((completedCount / supplements.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 text-white shadow-md shadow-rose-200">
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Prenatal Medications & Supplement Schedule</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Track daily micronutrients, doctor prescriptions, and prenatal vitamins.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-200 hover:opacity-95 transition-all hover:scale-105 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Supplement</span>
        </button>
      </div>

      {/* Progress Bar Banner with Cuddle Mother Art Embed */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white p-6 sm:p-8 shadow-xl shadow-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-200">Today's Supplement Adherence</span>
          <h2 className="text-2xl sm:text-3xl font-black">
            {completedCount} of {supplements.length} Supplements Completed
          </h2>
          <p className="text-xs text-purple-100 font-medium max-w-sm">Consistent daily micronutrient intake ensures healthy maternal plasma volume and fetal brain growth.</p>
          
          <div className="w-full sm:w-64 pt-2">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-emerald-400 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Uploaded Mother & Baby Cuddle Art Embed */}
        <div className="shrink-0 z-10">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
            <img
              src="/mother_baby_cuddle.jpg"
              alt="Mother with Newborn Baby"
              className="relative h-36 w-auto object-cover rounded-2xl drop-shadow-2xl border-2 border-white/40 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Supplement Checklist */}
      <div className="space-y-3">
        {supplements.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleTaken(item.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${
              item.taken
                ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                : 'bg-white border-slate-200/80 hover:border-rose-300 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                item.taken ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 text-transparent hover:border-rose-500'
              }`}>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-bold ${item.taken ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {item.name}
                  </h3>
                  <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                    {item.dosage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>{item.timing}</span>
                </p>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Purpose: {item.purpose}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                item.taken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {item.taken ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Guidance Tip */}
      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-3.5">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1 font-medium">
          <p className="font-bold">Crucial Iron & Calcium Absorption Rule:</p>
          <p>
            Never take <strong>Iron</strong> and <strong>Calcium</strong> tablets at the same time, as calcium blocks iron absorption. Take Iron in the morning with Vitamin C (citrus juice) and Calcium after dinner.
          </p>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Add New Prescription / Supplement</h2>
            <form onSubmit={handleAddMedication} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Medication / Supplement Name</label>
                <input
                  type="text"
                  required
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  placeholder="e.g. Magnesium Glycinate"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Dosage</label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  placeholder="e.g. 200 mg"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Timing</label>
                <input
                  type="text"
                  value={newMed.timing}
                  onChange={(e) => setNewMed({ ...newMed, timing: e.target.value })}
                  placeholder="e.g. Night before sleep"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Doctor Note / Purpose</label>
                <input
                  type="text"
                  value={newMed.purpose}
                  onChange={(e) => setNewMed({ ...newMed, purpose: e.target.value })}
                  placeholder="e.g. For leg cramps and better sleep"
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95 cursor-pointer"
                >
                  Save Supplement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
