import React, { useState } from "react";
import { motion } from "motion/react";
import { Target, Plus, Trash2, CheckCircle2, Flag, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { trackGoalCompletion, trackAction } from "@/src/services/gamificationService";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category: 'personal' | 'professional' | 'spiritual';
}

export default function Vision() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', text: 'Start a daily meditation practice', completed: false, category: 'spiritual' },
    { id: '2', text: 'Apply for the Senior Designer role', completed: true, category: 'professional' },
    { id: '3', text: 'Read 2 books on emotional intelligence', completed: false, category: 'personal' },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [category, setCategory] = useState<Goal['category']>('personal');
  const [savingVision, setSavingVision] = useState(false);

  const addGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    const goal: Goal = {
      id: Date.now().toString(),
      text: newGoal,
      completed: false,
      category,
    };
    setGoals([goal, ...goals]);
    setNewGoal("");
  };

  const toggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newCompleted = !goal.completed;
    setGoals(goals.map(g => g.id === id ? { ...g, completed: newCompleted } : g));

    if (newCompleted) {
      try {
        await trackGoalCompletion();
        alert("Goal completed! +100 Points earned 🏆");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSaveVision = async () => {
    setSavingVision(true);
    try {
      await trackAction("first-vision", 200);
      alert("Vision saved! +200 Points & 'First Vision Blueprint' Badge earned 🗺️");
    } catch (e) {
      console.error(e);
    } finally {
      setSavingVision(false);
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold text-brand-dark">Life Vision Blueprint</h1>
          <p className="text-slate-500">Clarify your values and map out your intentional future.</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-soft-purple px-4 py-2 rounded-2xl text-brand-purple font-bold text-sm">
          <Flag size={16} />
          <span>{goals.filter(g => g.completed).length}/{goals.length} Milestones</span>
        </div>
      </div>

      {/* Goal Input */}
      <form onSubmit={addGoal} className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="What is your next big goal?"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
          />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
          >
            <option value="personal">Personal</option>
            <option value="professional">Professional</option>
            <option value="spiritual">Spiritual</option>
          </select>
          <button type="submit" className="btn-primary flex items-center justify-center gap-2">
            <Plus size={20} />
            <span>Add Goal</span>
          </button>
        </div>
      </form>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={goal.id}
            className={cn(
              "flex items-center gap-4 p-5 bg-white rounded-3xl border transition-all",
              goal.completed ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100"
            )}
          >
            <button 
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                goal.completed 
                  ? "bg-emerald-500 text-white" 
                  : "border-2 border-slate-200 text-transparent hover:border-brand-purple"
              )}
            >
              <CheckCircle2 size={20} />
            </button>
            
            <div className="flex-1">
              <span className={cn(
                "font-medium transition-all",
                goal.completed ? "text-slate-400 line-through" : "text-slate-700"
              )}>
                {goal.text}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full",
                  goal.category === 'personal' ? "bg-blue-50 text-blue-600" :
                  goal.category === 'professional' ? "bg-purple-50 text-purple-600" :
                  "bg-amber-50 text-amber-600"
                )}>
                  {goal.category}
                </span>
              </div>
            </div>

            <button 
              onClick={() => deleteGoal(goal.id)}
              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Vision Exercise */}
      <section className="card bg-brand-dark text-white p-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-display font-bold">Vision Exercise: The 5-Year You</h2>
          <p className="text-brand-soft-purple/80 max-w-xl">
            Close your eyes and imagine your life 5 years from now. What are you doing? Who are you with? How do you feel? Write down one sentence that captures this vision.
          </p>
          <textarea 
            placeholder="My vision is..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 min-h-[100px]"
          />
          <button 
            onClick={handleSaveVision}
            disabled={savingVision}
            className="bg-brand-gold text-brand-dark px-6 py-3 rounded-2xl font-bold hover:bg-brand-gold/90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {savingVision ? <Loader2 className="animate-spin" size={20} /> : null}
            <span>Save Vision</span>
          </button>
        </div>
      </section>
    </div>
  );
}
