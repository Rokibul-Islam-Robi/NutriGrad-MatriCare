import React, { useState } from 'react';
import { 
  Apple, 
  Utensils, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Flame, 
  Droplets, 
  Sparkles,
  Heart,
  BookOpen
} from 'lucide-react';

export default function NutritionPlan() {
  const [selectedTrimester, setSelectedTrimester] = useState('2');

  const mealPlans = {
    '1': {
      title: 'First Trimester (Weeks 1 - 12)',
      focus: 'Folate, Vitamin B6, Hydration & Gentle Digestion',
      calories: '1,800 - 2,000 kcal/day',
      meals: [
        { time: '08:00 AM', meal: 'Breakfast', menu: 'Fortified Oatmeal with sliced bananas, chia seeds, and warm almond milk.', nutrient: 'Folic acid & Fiber' },
        { time: '10:30 AM', meal: 'Mid-Morning Snack', menu: 'Fresh citrus fruit (orange or kiwi) with a handful of soaked walnuts.', nutrient: 'Vitamin C & Omega-3' },
        { time: '01:30 PM', meal: 'Lunch', menu: 'Lentil soup (daal), steamed brown rice, sautéed spinach, and fresh cucumber salad.', nutrient: 'Plant Iron & Folate' },
        { time: '05:00 PM', meal: 'Evening Snack', menu: 'Whole wheat toast with avocado spread or low-fat yogurt with berries.', nutrient: 'Healthy Fats & Probiotics' },
        { time: '08:00 PM', meal: 'Dinner', menu: 'Grilled chicken or tofu stir-fry with broccoli, carrots, and sweet potato.', nutrient: 'Protein & Beta-Carotene' },
        { time: '09:30 PM', meal: 'Bedtime', menu: 'Warm chamomile tea or a glass of calcium-fortified warm milk.', nutrient: 'Calcium & Relaxation' }
      ]
    },
    '2': {
      title: 'Second Trimester (Weeks 13 - 27)',
      focus: 'Iron Bioavailability, Calcium & Rapid Fetal Bone Growth',
      calories: '2,200 - 2,400 kcal/day',
      meals: [
        { time: '08:00 AM', meal: 'Breakfast', menu: '2 Boiled eggs (or scrambled tofu), 2 whole wheat rotis/toast, and a glass of pomegranate juice.', nutrient: 'High Protein & Natural Iron' },
        { time: '10:30 AM', meal: 'Mid-Morning Snack', menu: 'Greek yogurt cup topped with pumpkin seeds, flaxseeds, and mixed berries.', nutrient: 'Calcium & Zinc' },
        { time: '01:30 PM', meal: 'Lunch', menu: 'Chickpea & quinoa salad bowl with dark leafy greens, lemon vinaigrette, and grilled paneer/fish.', nutrient: 'Iron & Complex Carbs' },
        { time: '05:00 PM', meal: 'Evening Snack', menu: 'Sprouted moong salad with diced tomatoes and roasted almonds.', nutrient: 'Folate & Protein' },
        { time: '08:00 PM', meal: 'Dinner', menu: 'Baked salmon or lentil curry with vegetable stew and brown rice.', nutrient: 'DHA Omega-3 & B-Vitamins' },
        { time: '09:30 PM', meal: 'Bedtime', menu: 'Warm milk with a pinch of turmeric and saffron.', nutrient: 'Calcium & Muscle Recovery' }
      ]
    },
    '3': {
      title: 'Third Trimester (Weeks 28 - 40+)',
      focus: 'Energy Density, Healthy Fats for Brain Development & Digestion',
      calories: '2,400 - 2,600 kcal/day',
      meals: [
        { time: '08:00 AM', meal: 'Breakfast', menu: 'Vegetable omelet with spinach and mushrooms, whole grain toast, and fresh papaya/apple.', nutrient: 'Choline & Iron' },
        { time: '10:30 AM', meal: 'Mid-Morning Snack', menu: 'Smoothie with spinach, banana, peanut butter, and Greek yogurt.', nutrient: 'Energy & Potassium' },
        { time: '01:30 PM', meal: 'Lunch', menu: 'Grilled salmon or bean burritos with guacamole, brown rice, and steamed green beans.', nutrient: 'DHA & Fiber' },
        { time: '05:00 PM', meal: 'Evening Snack', menu: 'Mixed nuts, dates, and coconut water for electrolyte replenishment.', nutrient: 'Magnesium & Electrolytes' },
        { time: '08:00 PM', meal: 'Dinner', menu: 'Hearty vegetable & lentil stew with baked sweet potatoes (smaller portions to avoid heartburn).', nutrient: 'Nutrient-Dense Recovery' },
        { time: '09:30 PM', meal: 'Bedtime', menu: 'Warm milk with 2-3 dried figs/dates.', nutrient: 'Calcium & Digestion' }
      ]
    }
  };

  const currentPlan = mealPlans[selectedTrimester];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner with Kitchen Illustration Graphic */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white p-6 sm:p-8 shadow-xl shadow-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
            <Apple className="h-3.5 w-3.5 text-yellow-300" />
            <span>Maternal Dietary Excellence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Personalized Maternal Nutrition & Meal Planner
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
            Evidence-based nutritional protocols customized for maternal vitality, healthy weight gain, and fetal development.
          </p>
        </div>

        {/* Uploaded Kitchen Art Embed */}
        <div className="shrink-0 z-10">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
            <img
              src="/pregnancy_diet_kitchen.jpg"
              alt="Pregnancy Diet & Kitchen"
              className="relative h-44 w-auto object-cover rounded-2xl drop-shadow-2xl border-2 border-white/40 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* 4 Key Pillars Infographic Section (Using Uploaded Nutrition Infographic) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rose-500" />
              <h2 className="text-lg font-black text-slate-900">4 Essential Pregnancy Nutrition Pillars</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Core food groups vital for maternal hemoglobin, bones, energy, and neural development.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Embedded Infographic Image */}
          <div className="lg:col-span-5 flex items-center justify-center p-2 rounded-2xl bg-purple-50/50 border border-purple-100">
            <img
              src="/nutrition_infographic.jpg"
              alt="Pregnancy Nutrition Infographic Elements"
              className="w-full h-auto object-contain rounded-xl drop-shadow-md hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Right: 4 Detailed Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-rose-800 uppercase tracking-wider">🥩 Protein Pillar</span>
                <span className="text-[10px] font-bold bg-rose-200/70 text-rose-900 px-2 py-0.5 rounded-full">70g/day</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Eggs, lean poultry, lentils, chickpeas, and Greek yogurt for tissue and fetal cell building.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-800 uppercase tracking-wider">🥛 Calcium Pillar</span>
                <span className="text-[10px] font-bold bg-blue-200/70 text-blue-900 px-2 py-0.5 rounded-full">1,000mg/day</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Pasteurized milk, cheese, fortified plant milk, and almonds for baby's bone and teeth density.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">🥬 Folate Pillar</span>
                <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full">600mcg/day</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Spinach, kale, broccoli, avocado, and citrus fruits for neural tube and DNA formation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider">🩸 Iron Pillar</span>
                <span className="text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full">27mg/day</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Beetroots, pomegranate, beans, and whole grains for red blood cell & oxygen transfer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trimester Selector Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {['1', '2', '3'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTrimester(t)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              selectedTrimester === t
                ? 'bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-200 font-bold scale-[1.02]'
                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 font-medium'
            }`}
          >
            <span className="text-xs uppercase tracking-wider block opacity-80">Trimester {t}</span>
            <span className="text-sm font-black mt-0.5 block">
              {t === '1' ? 'Weeks 1 - 12' : t === '2' ? 'Weeks 13 - 27' : 'Weeks 28 - 40+'}
            </span>
          </button>
        ))}
      </div>

      {/* Daily Meal Schedule Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {currentPlan.title} • 6-Meal Schedule
            </h3>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {currentPlan.calories}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {currentPlan.meals.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-rose-50/40 hover:border-rose-200 transition-colors gap-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-100 to-rose-100 text-rose-700 font-bold text-xs">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-purple-700 uppercase tracking-wider">{item.meal}</span>
                    <span className="text-xs text-slate-400">• {item.time}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.menu}</p>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  {item.nutrient}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Foods to Embrace vs Foods to Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Superfoods to Embrace</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✔</span>
              <span><strong>Dark Leafy Greens:</strong> Spinach, kale, broccoli for bioavailable iron & folic acid.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✔</span>
              <span><strong>Legumes & Lentils:</strong> Chickpeas, kidney beans, and dal for maternal protein & fiber.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✔</span>
              <span><strong>Pasteurized Dairy & Yogurt:</strong> Crucial for baby's skeletal bone development.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✔</span>
              <span><strong>Nuts & Seeds:</strong> Walnuts, chia, and flaxseeds for fetal cognitive brain growth.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertOctagon className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Foods to Strictly Avoid</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✖</span>
              <span><strong>Unpasteurized Milk & Soft Cheeses:</strong> Risk of Listeria bacterial infection.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✖</span>
              <span><strong>Raw / Undercooked Eggs & Meat:</strong> Risk of Salmonella and Toxoplasmosis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✖</span>
              <span><strong>High Mercury Fish (Shark, Swordfish):</strong> May harm fetal nervous system.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✖</span>
              <span><strong>Excessive Caffeine & Energy Drinks:</strong> Restrict caffeine to &lt; 200mg/day.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
