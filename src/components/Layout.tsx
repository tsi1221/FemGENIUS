import React from "react";
import { 
  Home, 
  Compass, 
  Target, 
  Users, 
  Calendar, 
  BookOpen, 
  User, 
  Settings as SettingsIcon,
  Sparkles
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/src/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Target, label: "Vision", path: "/vision" },
  { icon: Compass, label: "Discovery", path: "/discovery" },
  { icon: Sparkles, label: "Growth", path: "/growth" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: BookOpen, label: "Resources", path: "/resources" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20 md:pb-0 md:pl-64">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 p-6 z-50">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
          <span className="text-2xl font-display font-bold text-brand-purple">FemGenius</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                isActive 
                  ? "bg-brand-soft-purple text-brand-purple font-semibold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-brand-purple"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all mt-auto",
            isActive 
              ? "bg-brand-soft-purple text-brand-purple font-semibold" 
              : "text-slate-500 hover:bg-slate-50 hover:text-brand-purple"
          )}
        >
          <SettingsIcon size={20} />
          <span>Settings</span>
        </NavLink>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-3 flex justify-around items-center z-50 shadow-lg">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-brand-purple" : "text-slate-400"
            )}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Header (Mobile Only) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          <span className="text-lg font-display font-bold text-brand-purple">FemGenius</span>
        </div>
        <NavLink to="/profile" className="w-8 h-8 rounded-full bg-brand-soft-purple flex items-center justify-center text-brand-purple">
          <User size={18} />
        </NavLink>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
