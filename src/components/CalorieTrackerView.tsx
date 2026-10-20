import React, { useState } from 'react';
import { FoodItem } from '../types/health';
import { Flame, Plus, Trash2, Droplets, Utensils, Apple, Coffee, Search, Check } from 'lucide-react';

interface CalorieTrackerViewProps {
  budgetKcal: number;
  activeBurnedKcal: number;
  meals: FoodItem[];
  waterIntakeMl: number;
  waterGoalMl: number;
  onAddMeal: (meal: Omit<FoodItem, 'id' | 'timeLogged'>) => void;
  onDeleteMeal: (mealId: string) => void;
  onAddWater: (ml: number) => void;
}

const PRESET_FOODS = [
  { name: 'Oatmeal with Blueberries & Chia', calories: 290, proteinG: 11, carbsG: 48, fatG: 6, mealType: 'breakfast' as const },
  { name: 'Double Espresso with Oat Milk', calories: 45, proteinG: 1, carbsG: 7, fatG: 1, mealType: 'breakfast' as const },
  { name: 'Grilled Chicken Breast with Brown Rice', calories: 480, proteinG: 46, carbsG: 42, fatG: 9, mealType: 'lunch' as const },
  { name: 'Avocado Toast with 2 Poached Eggs', calories: 390, proteinG: 16, carbsG: 28, fatG: 22, mealType: 'breakfast' as const },
  { name: 'Atlantic Salmon Fillet with Steamed Asparagus', calories: 460, proteinG: 38, carbsG: 8, fatG: 28, mealType: 'dinner' as const },
  { name: 'Grass-Fed Ribeye Steak with Roasted Sweet Potato', calories: 680, proteinG: 52, carbsG: 36, fatG: 32, mealType: 'dinner' as const },
  { name: 'Greek Yogurt with Raw Honey & Walnuts', calories: 260, proteinG: 18, carbsG: 22, fatG: 12, mealType: 'snack' as const },
  { name: 'Whey Protein Isolate Shake', calories: 140, proteinG: 28, carbsG: 3, fatG: 1, mealType: 'snack' as const },
];

export const CalorieTrackerView: React.FC<CalorieTrackerViewProps> = ({
  budgetKcal,
  activeBurnedKcal,
  meals,
  waterIntakeMl,
  waterGoalMl,
  onAddMeal,
  onDeleteMeal,
  onAddWater,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Food Form
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState<number | ''>('');
  const [customProtein, setCustomProtein] = useState<number | ''>('');
  const [customCarbs, setCustomCarbs] = useState<number | ''>('');
  const [customFat, setCustomFat] = useState<number | ''>('');
  const [selectedMealType, setSelectedMealType] = useState<FoodItem['mealType']>('breakfast');

  // Calorie calculations
  const totalConsumed = meals.reduce((sum, m) => sum + m.calories, 0);
  const remaining = budgetKcal - totalConsumed + activeBurnedKcal;
  
  // Macro calculations
  const totalProtein = meals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbsG, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fatG, 0);

  // Targets (e.g. 140g protein, 220g carbs, 65g fat)
  const targetProtein = 140;
  const targetCarbs = 220;
  const targetFat = 65;

  const handleAddPreset = (food: typeof PRESET_FOODS[0]) => {
    onAddMeal({
      mealType: food.mealType,
      name: food.name,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
    });
    setIsAddModalOpen(false);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || customCalories === '') return;

    onAddMeal({
      mealType: selectedMealType,
      name: customName,
      calories: Number(customCalories),
      proteinG: Number(customProtein) || 0,
      carbsG: Number(customCarbs) || 0,
      fatG: Number(customFat) || 0,
    });

    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setIsAddModalOpen(false);
  };

  const filteredPresets = PRESET_FOODS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Caloric Balance Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Metabolic Pacing
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Calorie & Macro Tracker</h2>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-xl transition-colors shadow-lg shadow-rose-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
          </button>
        </div>

        {/* Big Balance Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-800/80 text-center">
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Budget</span>
            <span className="text-xl font-bold text-white tabular-nums">{budgetKcal}</span>
            <span className="text-[10px] text-slate-400 block">kcal</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Consumed</span>
            <span className="text-xl font-bold text-rose-400 tabular-nums">{totalConsumed}</span>
            <span className="text-[10px] text-slate-400 block">kcal</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Active Burn</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">+{activeBurnedKcal}</span>
            <span className="text-[10px] text-slate-400 block">wearable</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Remaining</span>
            <span className={`text-xl font-bold tabular-nums ${remaining >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {remaining}
            </span>
            <span className="text-[10px] text-slate-400 block">net kcal</span>
          </div>
        </div>

        {/* 3 Macro Progress Bars */}
        <div className="mt-5 space-y-3">
          {/* Protein */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Protein</span>
              <span className="text-slate-400 font-mono tabular-nums">
                <span className="text-white font-semibold">{totalProtein}g</span> / {targetProtein}g
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalProtein / targetProtein) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Carbohydrates</span>
              <span className="text-slate-400 font-mono tabular-nums">
                <span className="text-white font-semibold">{totalCarbs}g</span> / {targetCarbs}g
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalCarbs / targetCarbs) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Dietary Fats</span>
              <span className="text-slate-400 font-mono tabular-nums">
                <span className="text-white font-semibold">{totalFat}g</span> / {targetFat}g
              </span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalFat / targetFat) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Daily Hydration Wave</h3>
              <p className="text-xs text-slate-400">
                {waterIntakeMl}ml / {waterGoalMl}ml ({Math.round((waterIntakeMl / waterGoalMl) * 100)}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddWater(250)}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250ml</span>
            </button>
            <button
              onClick={() => onAddWater(500)}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+500ml</span>
            </button>
          </div>
        </div>
      </div>

      {/* Meals Log Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Today's Meals & Logged Nutrition</h3>
          <span className="text-xs text-slate-400">{meals.length} items logged</span>
        </div>

        {meals.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
            <Utensils className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No meals logged yet today.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium"
            >
              Log your first meal
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-2xl bg-slate-900 border border-slate-800/80 p-4 flex items-center justify-between group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    {meal.mealType === 'breakfast' && <Coffee className="w-4 h-4 text-amber-400" />}
                    {meal.mealType === 'lunch' && <Utensils className="w-4 h-4 text-emerald-400" />}
                    {meal.mealType === 'dinner' && <Flame className="w-4 h-4 text-rose-400" />}
                    {meal.mealType === 'snack' && <Apple className="w-4 h-4 text-cyan-400" />}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">{meal.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="capitalize text-slate-300 font-medium">{meal.mealType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{meal.timeLogged}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-cyan-400 font-medium">{meal.proteinG}g P</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-amber-400 font-medium">{meal.carbsG}g C</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-rose-400 font-medium">{meal.fatG}g F</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-white font-mono tabular-nums">{meal.calories}</span>
                    <span className="text-[10px] text-slate-400 block">kcal</span>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="opacity-60 hover:opacity-100 p-2 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Meal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Log Nutrition & Calories</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            {/* Quick Presets Search */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Popular Fitness & Clinical Presets
              </label>
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search meals (salmon, oats, chicken...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="w-full p-2.5 text-left rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-medium text-white">{preset.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {preset.proteinG}g P · {preset.carbsG}g C · {preset.fatG}g F
                      </div>
                    </div>
                    <span className="text-xs font-bold text-cyan-400 font-mono">
                      +{preset.calories} kcal
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Entry Form */}
            <form onSubmit={handleCreateCustom} className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">
                Or Add Custom Food Item
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Meal Type</label>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as FoodItem['mealType'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Food Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Protein Pancake"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Calories</label>
                  <input
                    type="number"
                    required
                    placeholder="kcal"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    placeholder="g"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    placeholder="g"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    placeholder="g"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg"
              >
                Log Meal Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
