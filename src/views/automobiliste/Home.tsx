import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, Search, MapPin, Navigation, Info, X, 
  Camera, Send, CheckCircle2, AlertTriangle, 
  ChevronRight, Wrench, Truck, Plus, Minus,
  MessageSquare, User as UserIcon, Bell,
  Clock, XCircle
} from "lucide-react";
import type { User, AssistanceRequest, Offer } from "../../types";

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const mechanicIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface AutoHomeProps {
  user: User;
  setView: (v: string) => void;
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
}

export default function AutoHome({ user, setView }: AutoHomeProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [position] = useState<[number, number]>([33.5731, -7.5898]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<AssistanceRequest | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  
  // Form State
  const [panneType, setPanneType] = useState("Moteur");
  const [description, setDescription] = useState("");
  const [locationInfo, setLocationInfo] = useState("");
  const [serviceType, setServiceType] = useState<AssistanceRequest["serviceType"]>("Mécanicien sur place");
  const [proposedPrice, setProposedPrice] = useState(200);
  const [vehicleBrand, setVehicleBrand] = useState(user.vehicleBrand || "");
  const [isDiagnosticLoading, setIsDiagnosticLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<{suggestion: string, status: string} | null>(null);

  const runDiagnostic = async () => {
    if (!description) {
      alert("Veuillez d'abord décrire votre problème.");
      return;
    }
    setIsDiagnosticLoading(true);
    setDiagnosticResult(null);
    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      setDiagnosticResult(data);
    } catch (error) {
      console.error("Diagnostic error:", error);
      alert("Erreur lors du diagnostic automatique.");
    } finally {
      setIsDiagnosticLoading(false);
    }
  };

  useEffect(() => {
    // Simulated nearby mechanics
    setMechanics([
      { id: '1', name: 'Auto-Expert Jaouad', mecaType: 'Garage', location: { lat: 33.5781, lng: -7.5848 }, specialties: ['Moteur', 'Pneus'] },
      { id: '2', name: 'Techno-Moto Samir', mecaType: 'Particulier', location: { lat: 33.5681, lng: -7.5948 }, specialties: ['Moto', 'Électricité'] },
    ]);
  }, []);

  const handleCreateRequest = () => {
    const newReq: AssistanceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: user.id,
      status: "pending",
      typePanne: panneType,
      description,
      address: "Boulevard d'Anfa, Casablanca",
      locationInfo,
      serviceType,
      vehicleInfo: { type: user.vehicleType || "Voiture", brand: vehicleBrand },
      proposedPrice,
      location: { lat: position[0], lng: position[1] },
      createdAt: new Date().toISOString()
    };
    setActiveRequest(newReq);
    setIsFormOpen(false);
    
    // Simulate finding an offer after few seconds
    setTimeout(() => {
      const mockOffer: Offer = {
        id: 'off-1',
        requestId: newReq.id,
        mecanicienId: '1',
        mecanicienName: 'Jaouad D.',
        price: proposedPrice + 50,
        estimatedTime: '15 min',
        status: 'pending'
      };
      setOffers([mockOffer]);
      setActiveRequest(prev => prev ? { ...prev, status: 'negotiating' } : null);
    }, 4000);
  };

  const handleCancelRequest = () => {
    setActiveRequest(null);
    setOffers([]);
  };

  return (
    <div className="relative w-full h-full bg-surface overflow-hidden">
      {/* Search Header Overlay */}
      <div className="absolute top-20 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-lg z-[1000] flex gap-2 pointer-events-auto">
        <div className="flex-1 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl border border-black/5 flex items-center px-4 h-12">
           <Search className="w-5 h-5 text-gray-400 mr-3" />
           <input 
              type="text" 
              placeholder="Rechercher un lieu ou un mécanicien..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
           />
        </div>
      </div>

      {/* Map Content - Full Screen */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <MapContainer 
          center={position} 
          zoom={14} 
          zoomControl={false}
          className="h-full w-full"
          style={{ height: '100%', width: '100%', background: '#f8f9fa' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <RecenterMap position={position} />
          
          {/* User Location */}
          <Marker position={position}>
            <Popup>Ma Position</Popup>
          </Marker>

          {/* Mechanics */}
          {mechanics.map((m) => (
            <Marker key={m.id} position={[m.location.lat, m.location.lng]} icon={mechanicIcon}>
              <Popup>
                <div className="p-2">
                  <p className="font-bold">{m.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{m.mecaType}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Recenter Button */}
      <div className="absolute bottom-40 right-6 z-[1000]">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => alert("Recentrage GPS sur votre position actuelle...")}
          className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-black/5 flex items-center justify-center text-black pointer-events-auto hover:bg-gray-50 transition-colors"
        >
          <Navigation className="w-5 h-5" />
        </motion.button>
      </div>

      {/* SOS Floating Button */}
      {!activeRequest && !isFormOpen && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 z-[1000]">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-brand hover:bg-brand-dark text-black font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(255,215,0,0.4)] flex items-center justify-center gap-3 transition-all uppercase tracking-tighter text-xl border-b-4 border-black/20 pointer-events-auto"
          >
            <AlertTriangle className="w-8 h-8" />
            JE SUIS EN PANNE !!
          </motion.button>
        </div>
      )}

      {/* Panne Form Bottom Sheet */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1001]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] shadow-2xl z-[1002] max-h-[92%] overflow-y-auto"
            >
              <div className="p-8 pb-12 h-full flex flex-col max-w-2xl mx-auto">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-black">Signaler une Panne</h2>
                    <p className="text-[10px] font-black text-brand-dark tracking-[0.2em] uppercase mt-1">MAKANOKA NAJDATOKA</p>
                  </div>
                  <button onClick={() => setIsFormOpen(false)} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <X className="w-6 h-6 text-black" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Type de Panne */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Nature du Problème</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                       {["Fuite d'Huile", "Pneu Crevé", "Moteur", "Batterie", "Accident", "Je ne sais pas"].map(type => (
                         <button 
                           key={type}
                           onClick={() => setPanneType(type)}
                           className={`p-4 rounded-xl border text-[11px] font-black transition-all uppercase ${panneType === type ? 'border-brand bg-brand/5 shadow-inner text-black' : 'border-black/5 text-gray-400 bg-gray-50/50'}`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Descriptions et Localisation */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Lieu (Automatique via GPS)</label>
                      <div className="flex items-center gap-3 bg-gray-50 border border-black/5 p-4 rounded-2xl text-xs font-bold text-gray-800">
                         <MapPin className="w-5 h-5 text-brand-dark" />
                         Boulevard d'Anfa, Casablanca
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Infos Complémentaires Localisation</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Face à l'hôtel, parking sous-sol..."
                        className="w-full bg-white border border-black/10 p-4 rounded-2xl text-sm font-semibold focus:border-brand outline-none shadow-sm"
                        value={locationInfo}
                        onChange={e => setLocationInfo(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Description détaillée</label>
                      <textarea 
                        rows={2}
                        placeholder="Racontez-nous ce qui se passe précisément..."
                        className="w-full bg-white border border-black/10 p-4 rounded-2xl text-sm font-semibold focus:border-brand outline-none shadow-sm"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                      />
                      <button 
                        onClick={runDiagnostic}
                        disabled={isDiagnosticLoading}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-black text-brand text-[10px] font-black uppercase italic tracking-widest rounded-xl hover:bg-neutral-800 transition-all disabled:opacity-50"
                      >
                         {isDiagnosticLoading ? (
                           <div className="animate-spin rounded-full h-3 w-3 border-2 border-brand border-t-transparent" />
                         ) : (
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                             ANALYSE INTELLIGENTE (PYTHON)
                           </div>
                         )}
                      </button>

                      <AnimatePresence>
                        {diagnosticResult && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 overflow-hidden"
                          >
                            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 shadow-sm ${diagnosticResult.status === 'detected' ? 'bg-orange-50 border-orange-100 text-orange-900' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                               <div className={`p-2 rounded-lg mt-1 ${diagnosticResult.status === 'detected' ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-400'}`}>
                                  <Info className="w-4 h-4" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">Résultat du diagnostic</p>
                                  <p className="text-xs font-bold leading-relaxed">{diagnosticResult.suggestion}</p>
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Type de Service */}
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-black/5">
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 ml-1">Type de Service souhaité</label>
                    <div className="space-y-3">
                       {[
                         { id: "Mécanicien sur place", icon: Wrench, label: "Remise en état sur place", desc: "Le mécanicien vient à vous" },
                         { id: "Dépannage (remorquage)", icon: Truck, label: "Remorquage - L'moussaâda", desc: "Transport vers un garage" },
                         { id: "Les deux", icon: CheckCircle2, label: "Premier Disponible", desc: "La solution la plus rapide" }
                       ].map(s => (
                         <label key={s.id} className={`flex items-center gap-4 bg-white p-4 rounded-2xl border transition-all cursor-pointer ${serviceType === s.id ? 'border-brand shadow-md' : 'border-black/5'}`}>
                            <input 
                               type="radio" 
                               name="serviceType" 
                               checked={serviceType === s.id}
                               onChange={() => setServiceType(s.id as any)}
                               className="accent-brand w-5 h-5"
                            />
                            <div className={`p-3 rounded-xl ${serviceType === s.id ? 'bg-brand/10 text-brand-dark' : 'bg-gray-50 text-gray-300'}`}>
                               <s.icon className="w-5 h-5" />
                            </div>
                            <div>
                               <div className="text-xs font-black uppercase">{s.label}</div>
                               <div className="text-[10px] font-bold text-gray-400">{s.desc}</div>
                            </div>
                         </label>
                       ))}
                    </div>
                  </div>

                  {/* Véhicule */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Type Véhicule</label>
                        <div className="p-4 bg-gray-50 border border-black/5 rounded-2xl text-xs font-black uppercase flex items-center gap-2">
                          <Truck className="w-5 h-5 text-gray-400" /> {user.vehicleType || "Voiture"}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Marque du véhicule</label>
                        <input 
                          className="w-full bg-white border border-black/10 p-4 rounded-2xl text-xs font-black uppercase focus:border-brand outline-none shadow-sm"
                          value={vehicleBrand}
                          onChange={e => setVehicleBrand(e.target.value)}
                          placeholder="Ex: Dacia, BMW..."
                        />
                    </div>
                  </div>

                  {/* Prix proposedPrice */}
                  <div className="py-4 border-y border-black/5">
                    <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-6 text-center">Votre Budget proposé (DH)</label>
                    <div className="flex items-center justify-center gap-10">
                       <button 
                        onClick={() => setProposedPrice(Math.max(50, proposedPrice - 10))}
                        className="w-14 h-14 bg-white border-2 border-black/5 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                       >
                          <Minus className="w-6 h-6 text-brand-dark" />
                       </button>
                       <div className="text-5xl font-black italic tracking-tighter text-black">{proposedPrice} <span className="text-sm uppercase text-gray-400 not-italic">DH</span></div>
                       <button 
                         onClick={() => setProposedPrice(proposedPrice + 10)}
                         className="w-14 h-14 bg-brand text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border-b-4 border-black/20"
                       >
                          <Plus className="w-6 h-6" />
                       </button>
                    </div>
                    <p className="text-[9px] text-gray-400 text-center mt-6 font-black uppercase tracking-[0.2em] italic">Système d'enchères inversées activé</p>
                  </div>

                  <button 
                    onClick={handleCreateRequest}
                    className="btn-primary w-full py-5 text-xl font-black italic uppercase tracking-tighter"
                  >
                     <Navigation className="w-6 h-6" />
                     LANCER L'APPEL SOS
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Real-time Status Bars */}
      <AnimatePresence>
        {activeRequest && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 z-[1001]"
          >
            {activeRequest.status === 'pending' || activeRequest.status === 'negotiating' ? (
              /* INTERVENTION EN NÉGOCIATION */
              <div className="bg-white border-2 border-brand rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
                       </span>
                       <span className="text-[11px] font-black uppercase text-brand-dark tracking-widest italic">Intervention en négociation</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-300 font-bold bg-gray-50 px-2 py-0.5 rounded">#{activeRequest.id.slice(0,6).toUpperCase()}</span>
                 </div>
                 
                 <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-black/5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
                       <MessageSquare className="w-6 h-6 text-brand-dark" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-baseline mb-0.5">
                          <p className="text-sm font-black text-black">{offers.length > 0 ? offers[0].mecanicienName : "Recherche de partenaires..."}</p>
                          {offers.length > 0 && <p className="text-xl font-black italic text-black">{offers[0].price} <span className="text-[10px] not-italic text-gray-400">DH</span></p>}
                       </div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                         {offers.length > 0 ? "Offre reçue - État: En attente d'acceptation" : "Votre SOS est visible par 12 techniciens"}
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-3">
                    <button 
                       onClick={handleCancelRequest}
                       className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-500 text-[11px] font-black uppercase active:scale-95 transition-all flex items-center justify-center gap-2 border border-black/5"
                    >
                       <XCircle className="w-4 h-4" /> ANNULER
                    </button>
                    {offers.length > 0 && (
                      <button 
                        onClick={() => setActiveRequest({...activeRequest, status: 'active', mecanicienId: offers[0].mecanicienId})}
                        className="flex-[2] py-3.5 rounded-xl bg-brand text-black text-[11px] font-black uppercase active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-black/20"
                      >
                         <CheckCircle2 className="w-4 h-4" /> ACCEPTER L'OFFRE
                      </button>
                    )}
                 </div>
              </div>
            ) : (
              /* INTERVENTION EN COURS */
              <div className="bg-white border-2 border-green-500 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-white" />
                       <span className="text-[11px] font-black uppercase text-green-700 tracking-widest italic">Intervention en cours</span>
                    </div>
                    <div className="text-[10px] font-black text-white px-3 py-1 bg-green-600 rounded-full italic tracking-tighter">
                       PRIX FIXÉ: {offers[0]?.price} DH
                    </div>
                 </div>

                 <div className="flex items-center gap-4 bg-green-50/30 p-3 rounded-2xl border border-green-100">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl italic">
                       {offers[0]?.mecanicienName.charAt(0)}
                    </div>
                    <div className="flex-1">
                       <p className="text-base font-black text-black uppercase tracking-tight italic">{offers[0]?.mecanicienName}</p>
                       <div className="flex items-center gap-2 mt-1 px-2 py-0.5 bg-white border border-black/5 rounded-lg w-fit">
                          <Clock className="w-3 h-3 text-brand-dark" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter tracking-widest">Temps estimé: 12 min</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => alert("Ouverture du guidage GPS vers l'expert...")}
                      className="p-3 bg-white border border-black/5 rounded-xl shadow-sm hover:bg-brand/10 transition-colors"
                    >
                       <Navigation className="w-5 h-5 text-brand-dark shadow-sm" />
                    </button>
                 </div>

                 <button 
                   onClick={handleCancelRequest}
                   className="w-full py-4 rounded-xl bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-widest hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center gap-2 border border-red-100 italic"
                 >
                    <XCircle className="w-5 h-5" /> ANNULER L'INTERVENTION
                 </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
