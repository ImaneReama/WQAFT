import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Filter, Star, MapPin, 
  Phone, MessageSquare, Clock, ShieldCheck, 
  X, ChevronRight,
  Award, Box, Image as ImageIcon, MessageCircle
} from "lucide-react";
import type { User } from "../../types";

interface Contact extends User {
  rating: number;
  reviewsCount: number;
  distance: string;
  diplomas: string[];
  materials: string[];
  photos: string[];
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

interface ContactsProps {
  user: User;
  setView: (v: string) => void;
  setActiveChatId: (id: string | null) => void;
}

export default function Contacts({ user, setView, setActiveChatId }: ContactsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Simulated Contacts Data
    const mockContacts: Contact[] = [
      {
        id: "m1",
        name: "Jaouad D.",
        firstName: "Jaouad",
        lastName: "D.",
        email: "jaouad@example.com",
        phone: "0612345678",
        role: "mecanicien",
        mecaType: "Garage",
        specialty: "Moteur & Électricité",
        status: "available",
        rating: 4.8,
        reviewsCount: 156,
        distance: "1.2 km",
        diplomas: ["Master en Mécanique Auto", "Certification Bosch"],
        materials: ["Scanner Diagnostic Pro", "Pont Élévateur", "Outils de précision"],
        photos: [
          "https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400"
        ],
        reviews: [
          { id: "r1", userName: "Amine K.", rating: 5, comment: "Excellent service, rapide et efficace.", date: "2 jours ago" },
          { id: "r2", userName: "Sara L.", rating: 4, comment: "Très pro, m'a sauvé d'une panne moteur.", date: "1 semaine ago" }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: "m2",
        name: "Samir Auto",
        firstName: "Samir",
        lastName: "Auto",
        email: "samir@example.com",
        phone: "0622334455",
        role: "mecanicien",
        mecaType: "Dépanneur",
        specialty: "Remorquage 24/7",
        status: "occupied",
        rating: 4.5,
        reviewsCount: 89,
        distance: "3.5 km",
        diplomas: ["Brevet de Secourisme Routier"],
        materials: ["Camion Plateau", "Treuil 5T"],
        photos: [],
        reviews: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "m3",
        name: "Yassine Méca",
        firstName: "Yassine",
        lastName: "Méca",
        email: "yassine@example.com",
        phone: "0655667788",
        role: "mecanicien",
        mecaType: "Particulier",
        specialty: "Pneus & Freins",
        status: "available",
        rating: 4.2,
        reviewsCount: 45,
        distance: "0.8 km",
        diplomas: ["CAP Mécanique"],
        materials: ["Cric hydraulique", "Clé à choc"],
        photos: [],
        reviews: [],
        createdAt: new Date().toISOString()
      }
    ];
    setContacts(mockContacts);
  }, []);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || c.mecaType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="p-6 pt-20 sm:pt-6 bg-white border-b border-black/5">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-4">Annuaire des Experts</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher par nom ou spécialité..."
              className="w-full bg-gray-50 border border-black/5 p-4 pl-12 rounded-2xl text-sm font-semibold outline-none focus:border-brand shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {["All", "Mécanicien", "Garage", "Dépanneur"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === f ? 'bg-brand border-brand text-black shadow-lg' : 'bg-white border-black/5 text-gray-400 hover:border-black/10'}`}
              >
                {f === "All" ? "Tous" : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="bg-white border border-black/5 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col sm:flex-row gap-5 items-start sm:items-center"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-brand/10 border-2 border-brand/20 flex items-center justify-center text-brand font-black text-2xl italic shadow-inner">
                  {contact.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${contact.status === 'available' ? 'bg-green-500' : 'bg-orange-500'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-black uppercase tracking-tight italic truncate">{contact.name}</h3>
                  <div className="px-2 py-0.5 bg-gray-50 border border-black/5 rounded flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black">{contact.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1 text-brand-dark">
                    <Award className="w-3 h-3" /> {contact.mecaType}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {contact.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {contact.status === 'available' ? 'Disponible' : 'Occupé'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                 <button 
                  onClick={(e) => { e.stopPropagation(); alert(`Appel sortant vers ${contact.phone}...`); }}
                  className="flex-1 sm:flex-none p-4 rounded-2xl bg-gray-50 text-black border border-black/5 hover:bg-gray-100 transition-colors"
                 >
                   <Phone className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setActiveChatId(contact.id);
                    setView('messages'); 
                  }}
                  className="flex-1 sm:flex-none p-4 rounded-2xl bg-brand text-black border-b-4 border-black/20 hover:bg-brand-dark transition-all"
                 >
                   <MessageSquare className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <Search className="w-12 h-12 mb-4" />
            <p className="font-black uppercase tracking-widest text-xs italic">Aucun expert ne correspond à votre recherche</p>
          </div>
        )}
      </div>

      {/* Details Side Drawer */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[1002] overflow-y-auto"
            >
              <div className="p-8 pb-12">
                <button 
                  onClick={() => setSelectedContact(null)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors mb-8"
                >
                  <X className="w-6 h-6 text-black" />
                </button>

                <div className="flex flex-col items-center text-center mb-10">
                   <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-3xl bg-brand/10 border-4 border-brand/20 flex items-center justify-center text-brand font-black text-4xl italic shadow-inner">
                        {selectedContact.name.charAt(0)}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white ${selectedContact.status === 'available' ? 'bg-green-500' : 'bg-orange-500'}`} />
                   </div>
                   
                   <p className="text-[10px] font-black text-brand-dark tracking-[0.2em] uppercase mb-1">{selectedContact.mecaType}</p>
                   <h2 className="text-3xl font-black text-black italic uppercase tracking-tighter mb-2">{selectedContact.name}</h2>
                   
                   <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-black">{selectedContact.rating}</span>
                        <span className="text-gray-300">({selectedContact.reviewsCount} avis)</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-200" />
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedContact.distance}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-10">
                   {/* Spécialité */}
                   <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Spécialité Principale</h4>
                      <div className="bg-brand/5 border border-brand/10 p-5 rounded-2xl flex items-center gap-4">
                         <ShieldCheck className="w-8 h-8 text-brand-dark" />
                         <div>
                            <p className="text-base font-black text-black uppercase italic tracking-tight">{selectedContact.specialty}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Expert Certifié Wqaft</p>
                         </div>
                      </div>
                   </div>

                   {/* Diplômes & Matériaux */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                           <Award className="w-4 h-4" /> Diplômes & Certifs
                        </h4>
                        <div className="space-y-2">
                           {selectedContact.diplomas.map((d, i) => (
                             <div key={i} className="text-xs font-bold text-black flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                                {d}
                             </div>
                           ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                           <Box className="w-4 h-4" /> Matériaux & Équipements
                        </h4>
                        <div className="space-y-2">
                           {selectedContact.materials.map((m, i) => (
                             <div key={i} className="text-xs font-bold text-gray-400 flex items-center gap-2">
                                <CheckCircle2 className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                {m}
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>

                   {/* Photos */}
                   {selectedContact.photos.length > 0 && (
                     <div>
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                           <ImageIcon className="w-4 h-4" /> Galerie Photos
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                           {selectedContact.photos.map((p, i) => (
                             <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-black/5 bg-gray-100">
                                <img src={p} alt="Workshop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {/* Avis */}
                   <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                         <MessageCircle className="w-4 h-4" /> Avis Clients
                      </h4>
                      {selectedContact.reviews.length > 0 ? (
                        <div className="space-y-4">
                           {selectedContact.reviews.map(r => (
                             <div key={r.id} className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                                <div className="flex justify-between items-center mb-2">
                                   <p className="text-xs font-black text-black uppercase tracking-tight italic">{r.userName}</p>
                                   <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                      <span className="text-[10px] font-black">{r.rating}</span>
                                   </div>
                                </div>
                                <p className="text-sm font-medium text-gray-500 mb-2 italic">"{r.comment}"</p>
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{r.date}</p>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Aucun avis pour le moment</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="sticky bottom-0 pt-8 mt-10 bg-white border-t border-black/5 flex gap-4">
                    <button 
                      onClick={() => alert(`Appel sortant vers ${selectedContact.phone}...`)}
                      className="flex-1 py-4 bg-gray-50 rounded-2xl text-[11px] font-black uppercase italic tracking-widest border border-black/5 transition-all hover:bg-gray-100 flex items-center justify-center gap-2"
                    >
                       <Phone className="w-4 h-4 text-brand-dark" /> Appeler
                    </button>
                    <button 
                      onClick={() => {
                        setActiveChatId(selectedContact.id);
                        setSelectedContact(null);
                        setView('messages');
                      }}
                      className="flex-[2] py-4 bg-brand rounded-2xl text-[11px] font-black uppercase italic tracking-widest border-b-4 border-black/20 transition-all hover:bg-brand-dark flex items-center justify-center gap-2"
                    >
                       <MessageSquare className="w-4 h-4" /> Envoyer un Message
                    </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <div className={`rounded-full ${className}`} />
  );
}
