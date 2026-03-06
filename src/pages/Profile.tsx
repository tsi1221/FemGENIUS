import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { User, Award, TrendingUp, Calendar, Settings as SettingsIcon, LogOut, Loader2 } from "lucide-react";
import { getUserProfile, UserProfile } from "@/src/services/gamificationService";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-brand-purple" size={40} />
        <p className="text-slate-500 font-medium">Loading your journey...</p>
      </div>
    );
  }

  const stats = [
    { label: "Growth Points", value: profile?.points.toLocaleString(), icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Daily Streak", value: `${profile?.streak} Days`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Goals Met", value: profile?.goalsCompleted.toString(), icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-brand-soft-purple border-4 border-white shadow-xl flex items-center justify-center text-brand-purple overflow-hidden">
            <User size={64} />
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-purple text-white rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <SettingsIcon size={18} />
          </button>
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-brand-dark">Sarah Genius</h1>
          <p className="text-slate-500 font-medium">Aspiring Leader & Growth Enthusiast</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card flex flex-col items-center text-center p-6 space-y-2"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <p className="text-2xl font-bold text-brand-dark">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-bold px-2">My Badges</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
          {profile?.badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-2xl shadow-sm hover:scale-110 transition-transform cursor-help">
                {badge.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase text-center">{badge.label}</span>
            </div>
          ))}
          {/* Locked Badges */}
          {Array.from({ length: Math.max(0, 6 - (profile?.badges.length || 0)) }).map((_, i) => (
            <div key={`locked-${i}`} className="flex flex-col items-center gap-2 opacity-20 grayscale">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-2xl">
                🔒
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Locked</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold">Account Settings</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="font-medium">Privacy Settings</span>
            <TrendingUp size={16} className="text-slate-300 rotate-90" />
          </button>
          <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="font-medium">Notification Preferences</span>
            <TrendingUp size={16} className="text-slate-300 rotate-90" />
          </button>
          <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors text-red-500">
            <span className="font-medium">Sign Out</span>
            <LogOut size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
