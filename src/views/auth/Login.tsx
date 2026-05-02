import React, { useState } from "react";
import { motion } from "motion/react";
import { LogIn, Car, Wrench, Shield, ArrowRight } from "lucide-react";
import type { User } from "../../types";

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitch: () => void;
}

export default function Login({ onLogin, onSwitch }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row font-sans">
      {/* Partie Gauche (Desktop) */}
      <div className="flex-1 bg-sidebar hidden lg:flex flex-col p-12 justify-center border-r border-white/5">
        <div className="max-w-xl mx-auto w-full">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-4 mb-12"
            >
                <div className="w-16 h-16 bg-brand flex items-center justify-center rounded-2xl shadow-[0_10px_30px_rgba(255,215,0,0.2)] border-b-4 border-black/20">
                    <span className="text-black font-black text-4xl font-display italic">W</span>
                </div>
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">WQAFT</h1>
                    <p className="text-brand text-xs font-black uppercase tracking-[0.3em] mt-1">Assistance Routière</p>
                </div>
            </motion.div>

            <div className="space-y-8 mb-12">
               <h2 className="text-2xl font-black text-white/90 uppercase tracking-tight italic leading-tight max-w-sm">
                   LA SOLUTION ULTIME POUR VOS PANNES SUR LA ROUTE.
               </h2>
               <p className="text-white/40 text-sm font-medium leading-relaxed max-w-md">
                   Notre réseau d'experts intervient en un temps record pour vous garantir une sécurité totale et une expérience sans stress lors de vos déplacements partout au Maroc.
               </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                    <div className="text-brand text-2xl font-black mb-1">1,200+</div>
                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">Techniciens</div>
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                    <div className="text-brand text-2xl font-black mb-1">25k+</div>
                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">Interventions</div>
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                    <div className="text-brand text-2xl font-black mb-1">99%</div>
                    <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">Satisfaction</div>
                </div>
            </div>
        </div>
      </div>

      {/* Partie Droite (Login / Switch) */}
      <div className="flex-1 p-8 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="lg:hidden flex justify-center mb-12">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand flex items-center justify-center rounded-lg shadow-md">
                    <span className="text-black font-black text-xl italic">W</span>
                </div>
                <span className="text-2xl font-black text-black">WQAFT</span>
             </div>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-black text-black tracking-tighter uppercase italic">CONNEXION</h2>
                <div className="h-1 w-12 bg-brand mt-2 rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Email</label>
                <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-black/10 p-4 rounded-2xl focus:border-brand outline-none transition-all shadow-inner pl-12" 
                      placeholder="votre@email.com"
                    />
                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Mot de passe</label>
                <div className="relative">
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-black/10 p-4 rounded-2xl focus:border-brand outline-none transition-all shadow-inner pl-12" 
                      placeholder="••••••••"
                    />
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 mt-4"
              >
                {loading ? "CONNEXION..." : "SE CONNECTER"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-black/5 flex flex-col items-center gap-4">
              <p className="text-gray-400 text-xs font-semibold tracking-tight">Pas encore de compte ?</p>
              <button 
                onClick={onSwitch}
                className="text-brand-dark font-black uppercase text-xs tracking-widest hover:underline flex items-center gap-2 border border-brand/20 px-6 py-2.5 rounded-xl hover:bg-brand/5 transition-all w-full justify-center"
              >
                CRÉER MON COMPTE WQAFT
              </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
