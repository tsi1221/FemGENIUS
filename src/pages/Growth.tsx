import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Heart, Shield, Zap, RefreshCw, Plus, Check } from "lucide-react";
import { getPersonalizedCoaching } from "@/src/services/geminiService";
import { cn } from "@/src/lib/utils";
import { trackAction } from "@/src/services/gamificationService";

export default function Growth() {
  const [goal, setGoal] = useState("");
  const [challenge, setChallenge] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const getAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !challenge) return;
    setLoading(true);
    try {
      const text = await getPersonalizedCoaching(goal, challenge);
      setAdvice(text || "Keep pushing forward, you've got this!");
    } catch (e) {
      setAdvice("Focus on your strengths and take one small step today.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async (title: string, points: number) => {
    if (completedChallenges.includes(title)) return;
    
    try {
      await trackAction(`challenge-${title}`, points);
      setCompletedChallenges([...completedChallenges, title]);
      alert(`Challenge completed! +${points} Points earned ✨`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-brand-dark">Confidence & Growth</h1>
        <p className="text-slate-500">Nurture your self-love and build resilience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-pink-50 border-pink-100 flex flex-col items-center text-center p-8 space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-pink-500 shadow-sm">
            <Heart size={32} />
          </div>
          <h3 className="text-lg font-bold">Self-Love</h3>
          <p className="text-sm text-slate-500">Practice kindness towards yourself today.</p>
        </div>
        <div className="card bg-indigo-50 border-indigo-100 flex flex-col items-center text-center p-8 space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
            <Shield size={32} />
          </div>
          <h3 className="text-lg font-bold">Resilience</h3>
          <p className="text-sm text-slate-500">Turn challenges into stepping stones.</p>
        </div>
        <div className="card bg-amber-50 border-amber-100 flex flex-col items-center text-center p-8 space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
            <Zap size={32} />
          </div>
          <h3 className="text-lg font-bold">Confidence</h3>
          <p className="text-sm text-slate-500">Step out of your comfort zone.</p>
        </div>
      </div>

      {/* AI Coaching Section */}
      <section className="card space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <h2 className="text-2xl font-display font-bold text-brand-dark">AI Personalized Coaching</h2>
        </div>

        {!advice ? (
          <form onSubmit={getAdvice} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">What is your current growth goal?</label>
              <input 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Speaking up in meetings"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600">What is holding you back?</label>
              <textarea 
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="e.g., Fear of being judged or sounding silly"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 min-h-[100px]"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !goal || !challenge}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span>Get Personalized Guidance</span>
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 bg-brand-soft-purple rounded-[2rem] border border-brand-purple/10">
              <p className="text-brand-dark leading-relaxed italic">
                "{advice}"
              </p>
            </div>
            <button onClick={() => setAdvice(null)} className="btn-secondary w-full">
              Ask Another Question
            </button>
          </motion.div>
        )}
      </section>

      {/* Mini Challenges */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold px-2">Daily Mini-Challenges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Compliment a Stranger", points: 50, color: "bg-pink-500" },
            { title: "5-Min Power Pose", points: 30, color: "bg-brand-purple" },
            { title: "Write 3 Gratitudes", points: 20, color: "bg-emerald-500" },
            { title: "Digital Detox (1hr)", points: 40, color: "bg-blue-500" },
          ].map((challenge, i) => {
            const isCompleted = completedChallenges.includes(challenge.title);
            return (
              <button 
                key={i} 
                onClick={() => handleCompleteChallenge(challenge.title, challenge.points)}
                disabled={isCompleted}
                className={cn(
                  "card flex items-center justify-between p-4 hover:shadow-md transition-all group text-left",
                  isCompleted ? "bg-emerald-50 border-emerald-100" : "cursor-pointer"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-10 rounded-full transition-colors", 
                    isCompleted ? "bg-emerald-500" : challenge.color
                  )} />
                  <div>
                    <h4 className={cn(
                      "font-bold text-sm transition-colors",
                      isCompleted ? "text-emerald-700" : "group-hover:text-brand-purple"
                    )}>
                      {challenge.title}
                    </h4>
                    <p className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      isCompleted ? "text-emerald-600/50" : "text-slate-400"
                    )}>
                      {isCompleted ? "Completed" : `+${challenge.points} Points`}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isCompleted ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-brand-soft-purple group-hover:text-brand-purple"
                )}>
                  {isCompleted ? <Check size={18} /> : <Plus size={18} />}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
