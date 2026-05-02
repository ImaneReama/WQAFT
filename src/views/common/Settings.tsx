import React, { useState } from "react";
import { 
  Settings as SettingsIcon, Globe, MapPin, 
  Moon, Sun, Phone, ChevronRight, Check
} from "lucide-react";

export default function Settings() {
  const [appearance, setAppearance] = useState('Light');
  const [language, setLanguage] = useState('Français');
  const [unit, setUnit] = useState('Kilomètres (km)');
  const [inAppCalls, setInAppCalls] = useState(true);

  return (
    <div className="flex-1 p-4 sm:p-8 space-y-10 overflow-y-auto pb-24 bg-surface max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-black">
           <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-black leading-none">Paramètres</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Personnalisez votre expérience Wqaft</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
             <Sun className="w-4 h-4" /> Apparence & Thème
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Light', 'Dark'].map(t => (
                <button 
                  key={t}
                  onClick={() => setAppearance(t)}
                  className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${appearance === t ? 'border-brand bg-brand/5 shadow-lg' : 'border-black/5 bg-gray-50 opacity-60'}`}
                >
                   <div className="flex items-center gap-4">
                      {t === 'Light' ? <Sun className="w-6 h-6 text-orange-500" /> : <Moon className="w-6 h-6 text-blue-500" />}
                      <span className="text-sm font-black uppercase italic tracking-tight text-black">{t} Mode</span>
                   </div>
                   {appearance === t && <div className="w-6 h-6 bg-brand rounded-full flex items-center justify-center shadow-md"><Check className="w-4 h-4" /></div>}
                </button>
              ))}
           </div>
        </div>

        {/* Language & Local */}
        <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm space-y-8">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-black/5">
                   <Globe className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Langue de l'application</p>
                   <p className="text-sm font-black text-black uppercase italic">{language}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 {['Français', 'العربية', 'English'].map(l => (
                   <button 
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${language === l ? 'bg-black text-brand border-black' : 'bg-white border-black/5 text-gray-400'}`}
                   >
                     {l}
                   </button>
                 ))}
              </div>
           </div>

           <hr className="border-black/5" />

           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-black/5">
                   <MapPin className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unité de distance</p>
                   <p className="text-sm font-black text-black uppercase italic">{unit}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 {['Kilomètres (km)', 'Miles (mi)'].map(u => (
                   <button 
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${unit === u ? 'bg-black text-brand border-black' : 'bg-white border-black/5 text-gray-400'}`}
                   >
                     {u.split(' ')[0]}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Communication */}
        <div className="bg-white border border-black/5 rounded-[2.5rem] p-8 shadow-sm">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand-dark border border-brand/20">
                   <Phone className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Appels par internet</p>
                   <p className="text-sm font-black text-black uppercase italic">Appels directs dans l'app</p>
                </div>
              </div>
              <button 
                onClick={() => setInAppCalls(!inAppCalls)}
                className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${inAppCalls ? 'bg-brand' : 'bg-gray-200'}`}
              >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${inAppCalls ? 'left-7' : 'left-1'}`} />
              </button>
           </div>
        </div>

        <div className="pt-10 text-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Wqaft v1.0.4 - Made with ❤️ in Morocco</p>
        </div>
      </div>
    </div>
  );
}
