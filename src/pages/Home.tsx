import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, CheckCircle2, Quote, Target, Loader2 } from "lucide-react";
import { generateDailyAffirmation } from "@/src/services/geminiService";
import { trackAction } from "@/src/services/gamificationService";
import { cn } from "@/src/lib/utils";

export default function Home() {
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflecting, setReflecting] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);

  useEffect(() => {
    async function loadAffirmation() {
      try {
        const text = await generateDailyAffirmation();
        setAffirmation(text || "You are capable of amazing things.");
      } catch (e) {
        setAffirmation("You are strong, capable, and worthy of all your dreams.");
      } finally {
        setLoading(false);
      }
    }
    loadAffirmation();
  }, []);

  const handleReflection = async () => {
    if (completedToday) return;
    setReflecting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await trackAction(`daily-reflection-${today}`, 50);
      setCompletedToday(true);
      alert("Reflection complete! +50 Points earned ✨");
    } catch (e) {
      console.error(e);
    } finally {
      setReflecting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold text-brand-dark"
        >
          Welcome back, <span className="text-brand-purple">Genius</span> ✨
        </motion.h1>
        <p className="text-slate-500">Your journey of growth continues today.</p>
      </section>

      {/* Daily Affirmation Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-brand-purple to-brand-dark p-8 rounded-[2.5rem] text-white shadow-xl shadow-brand-purple/20"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Quote size={120} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-brand-gold font-medium text-sm uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Daily Affirmation</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-medium leading-tight italic">
            {loading ? "Generating your light..." : `"${affirmation}"`}
          </h2>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={handleReflection}
          disabled={reflecting || completedToday}
          className={cn(
            "card group text-left cursor-pointer hover:border-brand-purple/30 transition-all disabled:cursor-default",
            completedToday && "bg-emerald-50 border-emerald-100"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
              completedToday ? "bg-emerald-500 text-white" : "bg-brand-soft-purple text-brand-purple"
            )}>
              {reflecting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
            </div>
            {!completedToday && <ArrowRight className="text-slate-300 group-hover:text-brand-purple transition-colors" />}
          </div>
          <h3 className={cn("text-xl font-bold mb-2", completedToday && "text-emerald-700")}>
            {completedToday ? "Reflection Complete" : "Daily Reflection"}
          </h3>
          <p className={cn("text-sm", completedToday ? "text-emerald-600/70" : "text-slate-500")}>
            {completedToday ? "You've centered yourself for today. Well done!" : "Take 5 minutes to reflect on your progress and set intentions."}
          </p>
        </button>

        <div className="card group cursor-pointer hover:border-brand-purple/30 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Target size={24} />
            </div>
            <ArrowRight className="text-slate-300 group-hover:text-brand-purple transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-2">Life Vision</h3>
          <p className="text-slate-500 text-sm">Review and update your long-term goals and values.</p>
        </div>
      </div>

      {/* Recent Achievements */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold px-2">Recent Achievements</h3>
        <div className="space-y-3">
          {[
            { title: "Completed 7-day Confidence Challenge", date: "Yesterday", icon: "🏆" },
            { title: "Defined Core Values", date: "3 days ago", icon: "💎" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100"
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
