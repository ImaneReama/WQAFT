import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, Users, Star, DollarSign, 
  Map as MapIcon, Power, RefreshCcw, Bell,
  ChevronRight, Calendar
} from "lucide-react";
import type { User } from "../../types";

interface MecaDashboardProps {
  user: User;
  setView: (v: string) => void;
}

export default function MecaDashboard({ user, setView }: MecaDashboardProps) {
  const [isAvailable, setIsAvailable] = useState(true);
  const [stats, setStats] = useState({
    ca: 4500,
    rating: 4.8,
    interventions: 24,
    clients: 18
  });

  const cards = [
    { label: "Chiffre d'Affaires", value: `${stats.ca} DH`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Note Moyenne", value: `${stats.rating}/5`, icon: Star, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Interventions", value: stats.interventions, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Clients Fidèles", value: stats.clients, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-display uppercase tracking-widest">Dashboard</h1>
           <p className="text-neutral-500 text-sm font-semibold">Bienvenue dans votre atelier digital, {user.name}.</p>
        </div>
        <button 
          onClick={() => setIsAvailable(!isAvailable)}
          className={`px-6 py-2 rounded-full border-2 flex items-center gap-2 transition-all ${
            isAvailable 
              ? "border-green-500 text-green-500 bg-green-500/5 shadow-lg shadow-green-500/10" 
              : "border-neutral-800 text-neutral-500"
          }`}
        >
          <Power className="w-4 h-4" />
          <span className="font-bold text-sm uppercase tracking-wider">{isAvailable ? "Disponible" : "Hors Ligne"}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.label} 
            className="bg-white border border-black/5 p-4 rounded-xl shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold mb-0.5 text-black">{card.value}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Requests Card */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between">
             <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight text-gray-400">
                <Bell className="w-4 h-4 text-brand" /> Demandes SOS Proches
             </h2>
             <button onClick={() => setView('requests')} className="text-brand text-xs font-bold hover:underline">Voir tout</button>
           </div>
           
           <div className="space-y-2">
              {[1, 2].map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setView('requests')}
                  className="bg-white border border-black/5 p-4 rounded-xl flex items-center gap-4 hover:border-brand transition-all cursor-pointer group shadow-sm"
                >
                   <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shadow-inner">
                      {i === 0 ? "🛞" : "🔋"}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-sm text-black">{i === 0 ? "Pneu Crevé" : "Batterie Faible"}</span>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">À 2.4 KM</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">Boulevard de la Corniche, Casa. Besoin d'un compresseur...</p>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand transition-colors" />
                </div>
              ))}
           </div>

           <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-64 flex flex-col items-center justify-center text-center">
              <MapIcon className="w-12 h-12 text-neutral-700 mb-4" />
              <p className="text-neutral-500 text-sm font-medium">Chargez la carte des pannes<br/>pour voir les opportunités en temps réel.</p>
              <button 
                onClick={() => setView('requests')}
                className="mt-4 text-brand text-xs font-bold uppercase tracking-widest border border-brand/30 px-4 py-2 rounded-lg hover:bg-brand/5 transition-colors"
              >
                ACTIVER LA CARTE
              </button>
           </div>
        </div>

        {/* Side Panel: Schedule/History */}
        <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" /> Agenda
            </h2>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl divide-y divide-neutral-800">
                <div className="p-4 flex items-center gap-3">
                    <div className="text-center bg-blue-500/10 p-2 rounded-lg min-w-[50px]">
                        <div className="text-xs text-blue-500 font-bold uppercase">MAI</div>
                        <div className="text-lg font-bold text-white leading-none">05</div>
                    </div>
                    <div>
                        <div className="text-sm font-bold">Révision SUV</div>
                        <div className="text-[10px] text-neutral-500 uppercase">10:30 • Mr El Mansouri</div>
                    </div>
                </div>
                <div className="p-4 flex items-center gap-3 opacity-50">
                    <div className="text-center bg-neutral-800 p-2 rounded-lg min-w-[50px]">
                        <div className="text-xs text-neutral-500 font-bold uppercase">MAI</div>
                        <div className="text-lg font-bold text-neutral-500 leading-none">02</div>
                    </div>
                    <div>
                        <div className="text-sm font-bold">Vidange Express</div>
                        <div className="text-[10px] text-neutral-500 uppercase">09:00 • Madame Bennis</div>
                    </div>
                </div>
            </div>

            <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl flex items-center gap-3">
                <RefreshCcw className="w-5 h-5 text-brand animate-spin-slow" />
                <div className="text-xs">
                    <p className="font-bold text-brand italic">SANTÉ DU COMPTE</p>
                    <p className="text-neutral-400">Excellent (98% de succès)</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
