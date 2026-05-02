import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, X, Car, Wrench, MapPin, MessageSquare, 
  Settings as SettingsIcon, LogOut, LayoutDashboard, History, 
  User as UserIcon, Bell, ChevronRight, AlertCircle,
  Phone, Star, ShieldCheck
} from "lucide-react";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AutoHome from "./views/automobiliste/Home";
import Contacts from "./views/automobiliste/Contacts";
import MecaDashboard from "./views/mecanicien/Dashboard";
import MecaRequests from "./views/mecanicien/Requests";
import Profile from "./views/common/Profile";
import Chat from "./views/common/Chat";
import Settings from "./views/common/Settings";

import type { Role, User } from "./types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>("home");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthView, setIsAuthView] = useState<"login" | "signup">("login");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wqaft_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("wqaft_user", JSON.stringify(userData));
    setView("home");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("wqaft_user");
    setView("home");
    setIsMenuOpen(false);
  };

  if (!user) {
    return isAuthView === "login" ? (
      <Login onLogin={handleLogin} onSwitch={() => setIsAuthView("signup")} />
    ) : (
      <Signup onSignup={handleLogin} onSwitch={() => setIsAuthView("login")} />
    );
  }

  const renderView = () => {
    switch (view) {
      case "home":
        return user.role === "automobiliste" ? <AutoHome user={user} setView={setView} /> : <MecaDashboard user={user} setView={setView} />;
      case "requests":
        return user.role === "mecanicien" ? <MecaRequests user={user} setView={setView} /> : <AutoHome user={user} setView={setView} />;
      case "contacts":
        return <Contacts user={user} setView={setView} setActiveChatId={setActiveChatId} />;
      case "profile":
        return <Profile user={user} setUser={setUser} handleLogout={handleLogout} />;
      case "messages":
        return <Chat user={user} activeChatId={activeChatId} setActiveChatId={setActiveChatId} setView={setView} />;
      case "settings":
        return <Settings />;
      default:
        return user.role === "automobiliste" ? <AutoHome user={user} setView={setView} /> : <MecaDashboard user={user} setView={setView} />;
    }
  };

  const menuItems = user.role === "automobiliste" 
    ? [
        { id: "home", label: "Accueil", icon: MapPin },
        { id: "contacts", label: "Mes Contacts", icon: Phone },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "profile", label: "Mon Profil", icon: UserIcon },
        { id: "settings", label: "Paramètres", icon: SettingsIcon },
      ]
    : [
        { id: "home", label: "Tableau de Bord", icon: LayoutDashboard },
        { id: "requests", label: "Demandes SOS", icon: Bell },
        { id: "messages", label: "Messages", icon: MessageSquare },
        { id: "profile", label: "Profil Atelier", icon: ShieldCheck },
        { id: "settings", label: "Paramètres", icon: SettingsIcon },
      ];

  return (
    <div className="h-screen w-full flex bg-surface font-sans overflow-hidden">
      {/* Header (Top Navigation for Mobile/Small Screens) */}
      <header className="h-16 border-b border-black/10 bg-white sm:hidden flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-tight text-brand-dark uppercase">
            Wqaft
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold uppercase italic">
          {user.name.charAt(0)}
        </div>
      </header>

      {/* Sidebar Menu (Desktop/Permanent) */}
      <aside className={`fixed sm:static inset-y-0 left-0 w-64 bg-sidebar text-white flex flex-col border-r border-black/10 shadow-xl z-[70] transition-all duration-300 sm:translate-x-0 ${isMenuOpen ? 'translate-x-0 translate-y-0' : '-translate-x-full sm:ml-0'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 bg-brand flex items-center justify-center rounded-lg shadow-lg">
            <span className="text-black font-black text-xl italic font-display">W</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-brand">Wqaft</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Assistance Routière</p>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="sm:hidden ml-auto p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <div className="px-6 mb-4 text-[10px] uppercase font-black text-white/20 tracking-[0.2em]">Navigation</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => { setView(item.id); setIsMenuOpen(false); }}
              className={`flex items-center gap-4 px-6 py-4 w-full transition-all group ${view === item.id ? "bg-brand/10 border-r-4 border-brand text-brand" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              <item.icon className={`w-5 h-5 ${view === item.id ? "text-brand" : "text-white/30 group-hover:text-white"}`} />
              <span className="text-xs font-black uppercase tracking-widest italic">{item.label}</span>
              {view === item.id && <div className="ml-auto w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_rgba(255,215,0,0.8)]" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs text-blue-400 font-black italic">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[11px] font-black uppercase italic tracking-tight text-white truncate">{user.name}</p>
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{user.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        {renderView()}
      </main>
    </div>
  );
}
