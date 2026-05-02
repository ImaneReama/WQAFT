import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, MapPin, Clock, MessageSquare, 
  ChevronRight, AlertCircle, X, Check,
  Send, DollarSign, Info, User as UserIcon
} from "lucide-react";
import type { User } from "../../types";

interface MecaRequestsProps {
  user: User;
  setView: (v: string) => void;
}

export default function MecaRequests({ user, setView }: MecaRequestsProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would use the /api/requests endpoint or socket
    // We'll mock some data for now that looks fresh
    setRequests([
      {
        id: "101",
        userId: "auto-1",
        userName: "Ahmed Z.",
        category: "engine",
        description: "Fumée blanche sortant du capot sur l'autoroute.",
        location: { lat: 33.5731, lng: -7.5898 },
        dist: "1.2 km",
        createdAt: new Date().toISOString(),
      },
      {
        id: "102",
        userId: "auto-2",
        userName: "Sara L.",
        category: "tire",
        description: "Pneu arrière droit crevé. Pas de roue de secours.",
        location: { lat: 33.5831, lng: -7.5998 },
        dist: "3.5 km",
        createdAt: new Date().toISOString(),
      }
    ]);
  }, []);

  const handleBid = async () => {
    if (!bidAmount) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        alert(`Offre de ${bidAmount} DH envoyée !`);
        setSelectedRequest(null);
        setBidAmount("");
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-950">
      <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display uppercase italic text-white flex items-center gap-3">
             <Bell className="text-brand w-6 h-6" /> Alertes SOS
          </h1>
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Demandes d'assistance en temps réel</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-neutral-400">ACTIVÉ</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {requests.map((req) => (
          <motion.div 
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedRequest(req)}
            className="group bg-neutral-900 border border-neutral-800 p-5 rounded-2xl flex items-center gap-6 cursor-pointer hover:border-brand/50 transition-all hover:bg-neutral-900/50"
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
               {req.category === 'engine' ? '⚙️' : '🛞'}
            </div>
            
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white uppercase tracking-tight">{req.userName}</span>
                    <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded italic">À {req.dist}</span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-1 mb-2">{req.description}</p>
                <div className="flex items-center gap-3 text-neutral-600">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold">IL Y A 2 MIN</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">CASABLANCA</span>
                    </div>
                </div>
            </div>

            <ChevronRight className="w-6 h-6 text-neutral-800 group-hover:text-brand transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/90 backdrop-blur-md"
               onClick={() => setSelectedRequest(null)}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="h-24 bg-brand/10 border-b border-brand/20 p-6 flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-display uppercase tracking-widest text-brand">Détail SOS</h2>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase italic">ID: #{selectedRequest.id}</p>
                 </div>
                 <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-neutral-800 rounded-full">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                        <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white">{selectedRequest.userName}</div>
                        <div className="text-xs text-neutral-500 font-medium">Membre depuis 2024</div>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase">Distance</div>
                        <div className="text-lg font-display text-white">{selectedRequest.dist}</div>
                    </div>
                </div>

                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Description Client</div>
                    <p className="text-sm text-neutral-300 italic">"{selectedRequest.description}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                        <div className="text-[10px] text-neutral-500 uppercase font-bold">Catégorie</div>
                        <div className="text-sm font-bold text-white uppercase">{selectedRequest.category}</div>
                    </div>
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
                        <div className="text-[10px] text-neutral-500 uppercase font-bold">Urgence</div>
                        <div className="text-sm font-bold text-red-500 uppercase">Élevée</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest">Votre offre (DH)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <input 
                            type="number"
                            value={bidAmount}
                            onChange={e => setBidAmount(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 p-4 pl-12 rounded-xl outline-none focus:border-brand text-xl font-display text-brand"
                            placeholder="Proposez un prix..."
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleBid}
                        disabled={loading}
                        className="flex-1 btn-primary py-4"
                    >
                        {loading ? "ENVOI..." : "ENVOYER L'OFFRE"}
                        <Send className="w-4 h-4 ml-2" />
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
