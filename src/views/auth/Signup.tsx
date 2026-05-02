import React, { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, Car, Wrench, ArrowLeft } from "lucide-react";
import type { User, Role } from "../../types";

interface SignupProps {
  onSignup: (user: User) => void;
  onSwitch: () => void;
}

export default function Signup({ onSignup, onSwitch }: SignupProps) {
  const [role, setRole] = useState<Role>("automobiliste");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    vehicleType: "Voiture" as "Voiture" | "Moto",
    vehicleBrand: "",
    mecaType: "Particulier" as "Particulier" | "Garage" | "Dépannage",
    hasTowingService: false,
    specialty: "Véhicule" as "Moto" | "Véhicule",
    brandsHandled: "Toutes",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
          name: `${formData.firstName} ${formData.lastName}`
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onSignup(data);
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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 font-sans py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white border border-black/10 p-8 rounded-2xl shadow-xl"
      >
        <button onClick={onSwitch} className="flex items-center gap-2 text-gray-400 hover:text-black mb-6 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-black tracking-tighter uppercase italic">CRÉER VOTRE COMPTE</h1>
          <p className="text-brand-dark font-display font-black text-sm tracking-widest mt-1">MAKANOKA NAJDATOKA</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            type="button"
            onClick={() => setRole("automobiliste")}
            className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${
              role === "automobiliste" ? "border-brand bg-brand/5 shadow-inner" : "border-black/5 text-gray-400 bg-gray-50/50"
            }`}
          >
            <Car className={`w-8 h-8 ${role === 'automobiliste' ? 'text-brand-dark' : ''}`} />
            <span className="font-black uppercase tracking-widest text-[10px]">Client</span>
          </button>
          <button 
           type="button"
            onClick={() => setRole("mecanicien")}
            className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all ${
              role === "mecanicien" ? "border-brand bg-brand/5 shadow-inner" : "border-black/5 text-gray-400 bg-gray-50/50"
            }`}
          >
            <Wrench className={`w-8 h-8 ${role === 'mecanicien' ? 'text-brand-dark' : ''}`} />
            <span className="font-black uppercase tracking-widest text-[10px]">Technicien</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nom</label>
              <input 
                required
                className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Prénom</label>
              <input 
                required
                className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Numéro de téléphone</label>
              <input 
                required
                className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
              <input 
                required
                type="email"
                className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {role === "automobiliste" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Type de véhicule</label>
                <select 
                  className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                  value={formData.vehicleType}
                  onChange={e => setFormData({...formData, vehicleType: e.target.value as any})}
                >
                  <option value="Voiture">Voiture</option>
                  <option value="Moto">Moto</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Marque du véhicule</label>
                <input 
                  required
                  className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                  value={formData.vehicleBrand}
                  onChange={e => setFormData({...formData, vehicleBrand: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Type</label>
                  <select 
                    className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                    value={formData.mecaType}
                    onChange={e => setFormData({...formData, mecaType: e.target.value as any})}
                  >
                    <option value="Particulier">Particulier</option>
                    <option value="Garage">Garage</option>
                    <option value="Dépannage">Dépannage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Spécialité</label>
                  <select 
                    className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                    value={formData.specialty}
                    onChange={e => setFormData({...formData, specialty: e.target.value as any})}
                  >
                    <option value="Véhicule">Véhicule</option>
                    <option value="Moto">Moto</option>
                  </select>
                </div>
                <div className="flex items-end pb-3 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      className="w-4 h-4 accent-brand"
                      checked={formData.hasTowingService}
                      onChange={e => setFormData({...formData, hasTowingService: e.target.checked})}
                    />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Service Dépannage ?</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Marque(s) gérée(s)</label>
                <input 
                  placeholder="Toutes ou liste (Renault, Dacia...)"
                  className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                  value={formData.brandsHandled}
                  onChange={e => setFormData({...formData, brandsHandled: e.target.value})}
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Mot de passe</label>
              <input 
                required
                type="password"
                className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Confirmer</label>
              <input 
                required
                type="password"
                className="w-full bg-white border border-black/10 p-3 rounded-xl outline-none focus:border-brand shadow-sm"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              className="btn-primary w-full py-4 text-sm font-black"
            >
              {loading ? "CRÉATION EN COURS..." : "CRÉER MON COMPTE"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
