import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User as UserIcon, Camera, Save, 
  MapPin, Phone, Mail, Award, 
  Settings, ShieldCheck, CreditCard,
  Plus, Edit2, Trash2, Key, Bell,
  LogOut, Trash, ChevronRight, X,
  Car, Shield, Smartphone
} from "lucide-react";
import type { User } from "../../types";

interface Vehicle {
  id: string;
  type: string;
  brand: string;
}

interface ProfileProps {
  user: User;
  setUser: (user: User) => void;
  handleLogout: () => void;
}

export default function Profile({ user, setUser, handleLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', type: 'Berline', brand: 'Toyota Corolla' },
    { id: 'v2', type: 'SUV', brand: 'Dacia Duster' }
  ]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Partial<Vehicle>>({ type: 'Berline', brand: '' });

  const handleSave = () => {
    setUser(formData);
    localStorage.setItem("wqaft_user", JSON.stringify(formData));
    setIsEditing(false);
    alert("Profil mis à jour avec succès !");
  };

  const handlePasswordChange = () => {
    const newPass = prompt("Entrez votre nouveau mot de passe :");
    if (newPass) alert("Mot de passe modifié avec succès !");
  };

  const handleDeleteAccount = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      handleLogout();
    }
  };

  const handleUpdateAvatar = () => {
    alert("Fonctionnalité de téléchargement d'image sera disponible bientôt !");
  };

  const handleAddVehicle = () => {
    if (!currentVehicle.brand) return;
    const newVehicle = {
      id: Math.random().toString(36).substr(2, 9),
      type: currentVehicle.type || 'Autre',
      brand: currentVehicle.brand
    };
    setVehicles([...vehicles, newVehicle]);
    setShowVehicleModal(false);
    setCurrentVehicle({ type: 'Berline', brand: '' });
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-10 overflow-y-auto pb-24 bg-surface max-w-5xl mx-auto w-full">
      
      {/* Header Overlay Style */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-black">
             <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-black leading-none">Mon Profil</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gérez votre identité et vos véhicules</p>
          </div>
        </div>
        <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center gap-2 font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all border shadow-sm ${isEditing ? 'bg-green-500 border-green-600 text-white shadow-green-200' : 'bg-white border-black/5 text-gray-400 hover:text-black'}`}
        >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            <span className="text-[10px]">{isEditing ? "Enregistrer" : "Modifier"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-5 space-y-8">
           {/* Profile Picture & General */}
           <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 rounded-[2rem] bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    <UserIcon className="w-14 h-14 text-gray-200" />
                </div>
                <button 
                  onClick={handleUpdateAvatar}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-black shadow-lg border-4 border-white hover:bg-brand-dark transition-colors"
                >
                    <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-black text-black uppercase italic tracking-tighter">{user.name}</h2>
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-brand/10 border border-brand/20 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-brand-dark" />
                  <span className="text-[10px] font-black text-brand-dark uppercase tracking-widest">Compte Vérifié</span>
              </div>
           </div>

           {/* Coordonnées */}
           <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/30 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> Informations Personnelles
              </h3>
              
              <div className="space-y-6">
                  <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-black/5 flex items-center justify-center text-gray-400">
                          <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                          <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Email Principal</div>
                          {isEditing ? (
                              <input className="w-full bg-transparent border-b-2 border-brand/20 py-1 outline-none text-sm font-bold text-black" 
                                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                          ) : (
                              <div className="font-black text-sm text-black truncate">{user.email}</div>
                          )}
                      </div>
                  </div>

                  <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-black/5 flex items-center justify-center text-gray-400">
                          <Phone className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                          <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Téléphone</div>
                          {isEditing ? (
                              <input className="w-full bg-transparent border-b-2 border-brand/20 py-1 outline-none text-sm font-bold text-black" 
                                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                          ) : (
                              <div className="font-black text-sm text-black">{user.phone}</div>
                          )}
                      </div>
                  </div>
              </div>
           </div>

           {/* Sécurité */}
           <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/30 flex items-center gap-2">
                <Key className="w-4 h-4" /> Sécurité
              </h3>
              <button 
                onClick={handlePasswordChange}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-gray-100 border border-black/5"
              >
                 <div className="flex items-center gap-3">
                   <Shield className="w-5 h-5 text-gray-400 group-hover:text-black" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Changer de mot de passe</span>
                 </div>
                 <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
           </div>
        </div>

        {/* Right Column: Vehicles & Account */}
        <div className="lg:col-span-7 space-y-8">
           {/* Vehicles Management */}
           <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-xs font-black uppercase tracking-widest text-black/30 flex items-center gap-2">
                   <Car className="w-4 h-4" /> Mes Véhicules
                 </h3>
                 <button 
                  onClick={() => setShowVehicleModal(true)}
                  className="flex items-center gap-2 bg-brand text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest border-b-4 border-black/20 active:scale-95 transition-all shadow-lg"
                 >
                   <Plus className="w-4 h-4" /> Ajouter
                 </button>
              </div>

              <div className="space-y-4">
                 {vehicles.map(v => (
                   <div key={v.id} className="flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-black/5 hover:border-brand transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-brand border border-black/5 shadow-inner">
                         <Car className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                         <div className="text-[10px] font-black text-brand-dark uppercase tracking-widest mb-0.5">{v.type}</div>
                         <div className="text-sm font-black text-black uppercase italic tracking-tight">{v.brand}</div>
                      </div>
                      <div className="flex gap-1">
                         <button 
                            onClick={() => alert("Edition du véhicule bientôt disponible !")}
                            className="p-2 text-gray-300 hover:text-black transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                         <button onClick={() => deleteVehicle(v.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                 ))}
                 {vehicles.length === 0 && (
                   <div className="py-12 text-center opacity-30">
                      <Car className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Aucun véhicule enregistré</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Account Actions */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 p-6 bg-gray-100 rounded-[2rem] border border-black/5 hover:bg-gray-200 transition-all group"
              >
                 <LogOut className="w-6 h-6 text-gray-400 group-hover:text-black" />
                 <span className="text-xs font-black uppercase italic tracking-widest text-gray-500 group-hover:text-black">Se déconnecter</span>
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex items-center justify-center gap-3 p-6 bg-red-50 rounded-[2rem] border border-red-100 hover:bg-red-100 transition-all group"
              >
                 <Trash className="w-6 h-6 text-red-300 group-hover:text-red-500" />
                 <span className="text-xs font-black uppercase italic tracking-widest text-red-400 group-hover:text-red-600">Supprimer le compte</span>
              </button>
           </div>
        </div>
      </div>

      {/* Vehicle Modal */}
      <AnimatePresence>
         {showVehicleModal && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowVehicleModal(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1100]"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[3rem] p-10 z-[1101] shadow-2xl border-b-[8px] border-black/10"
             >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black">Nouveau Véhicule</h3>
                   <button onClick={() => setShowVehicleModal(false)} className="p-3 bg-gray-50 rounded-2xl text-black hover:bg-gray-100"><X /></button>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3 pl-2">Type de véhicule</label>
                      <div className="grid grid-cols-2 gap-3">
                         {['Berline', 'SUV', 'Utilitaire', 'Moto'].map(t => (
                           <button 
                            key={t}
                            onClick={() => setCurrentVehicle({...currentVehicle, type: t})}
                            className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${currentVehicle.type === t ? 'bg-brand border-brand text-black shadow-lg' : 'bg-gray-50 border-black/5 text-gray-400'}`}
                           >
                             {t}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3 pl-2">Marque & Modèle</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Toyota Camry 2022"
                        className="w-full bg-gray-50 border-2 border-black/5 p-5 rounded-2xl text-sm font-bold outline-none focus:border-brand shadow-inner"
                        value={currentVehicle.brand}
                        onChange={e => setCurrentVehicle({...currentVehicle, brand: e.target.value})}
                      />
                   </div>

                   <button 
                    onClick={handleAddVehicle}
                    className="w-full py-5 bg-black text-brand rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-xl active:scale-95 transition-all mt-4 border-b-4 border-white/20"
                   >
                     Enregistrer le véhicule
                   </button>
                </div>
             </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
}

