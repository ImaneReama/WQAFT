import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Phone, Shield, Info, MoreVertical, 
  CheckCheck, Clock, User as UserIcon,
  ChevronLeft, AlertCircle, Handshake,
  Search, Pin, Trash2, CheckCircle2,
  Image as ImageIcon, Video as VideoIcon,
  PlusCircle, X, Star, XCircle, ChevronRight,
  UserCheck, Flag, Ban, Search as SearchIcon,
  MessageSquare
} from "lucide-react";
import type { User } from "../../types";

interface Message {
  id: string;
  from: 'me' | 'other' | 'system';
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'video';
  url?: string;
  status: 'read' | 'unread';
}

interface Conversation {
  id: string;
  contactName: string;
  contactImage?: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  messages: Message[];
}

interface ChatProps {
  user: User;
  activeChatId?: string | null;
  setActiveChatId?: (id: string | null) => void;
  setView: (v: string) => void;
}

export default function Chat({ user, activeChatId, setActiveChatId, setView }: ChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      contactName: 'Mécanique Ahmed',
      isOnline: true,
      lastMessage: 'Je propose 250 DH pour le déplacement...',
      time: '14:20',
      unreadCount: 1,
      isPinned: true,
      messages: [
        { id: '1', from: 'system', text: 'Chat sécurisé par Wqaft. Négociez le prix avant l\'intervention.', timestamp: '14:00', type: 'text', status: 'read' },
        { id: '2', from: 'other', text: 'Bonjour, je suis le mécanicien Ahmed. J\'ai vu votre SOS.', timestamp: '14:05', type: 'text', status: 'read' },
        { id: '3', from: 'other', text: 'Je propose 250 DH pour le déplacement et la réparation.', timestamp: '14:10', type: 'text', status: 'unread' },
      ]
    },
    {
      id: '2',
      contactName: 'Jaouad D.',
      isOnline: false,
      lastMessage: 'D\'accord, j\'arrive dans 10 minutes.',
      time: 'Hier',
      unreadCount: 0,
      isPinned: false,
      messages: []
    }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [interventionState, setInterventionState] = useState<'negotiating' | 'accepted' | 'rejected' | 'completed'>('negotiating');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeChatId) {
      setSelectedId(activeChatId);
    }
  }, [activeChatId]);

  const handleMenuAction = (action: string) => {
    if (action === 'Bloquer') {
        setIsBlocked(!isBlocked);
        alert(isBlocked ? "Contact débloqué." : "Contact bloqué.");
    } else if (action === 'Voir Profil') {
        setView('profile');
    } else if (action === 'Signaler') {
        const reason = prompt("Raison du signalement :");
        if (reason) alert("Signalement envoyé aux administrateurs. Merci.");
    } else {
        alert(`Action "${action}" effectuée avec succès.`);
    }
    setShowMenu(false);
  };

  const handleProposePrice = () => {
    const price = prompt("Entrez votre nouveau prix (DH) :");
    if (price) {
      const msg: Message = {
        id: 'prop-' + Date.now(),
        from: 'me',
        text: `Nouveau prix proposé: ${price} DH`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'read'
      };
      setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, msg] } : c));
      alert("Votre proposition a été envoyée.");
    }
  };

  const handleNegotiation = (accept: boolean) => {
    if (accept) {
      setInterventionState('accepted');
      const systemMsg: Message = {
        id: 'sys-' + Date.now(),
        from: 'system',
        text: 'Offre acceptée ! Le mécanicien se met en route.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'read'
      };
      setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, systemMsg] } : c));
      
      // Simulate completion after some time
      setTimeout(() => {
        setInterventionState('completed');
        setShowRatingModal(true);
      }, 5000);

    } else {
      setInterventionState('rejected');
    }
  };

  const handleCancel = () => {
    if (confirm("Annuler l'intervention en cours ?")) {
      setInterventionState('rejected');
      alert("Intervention annulée.");
    }
  };

  const handleFileUpload = (type: 'image' | 'video') => {
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      from: 'me',
      text: type === 'image' ? 'Image envoyée' : 'Vidéo envoyée',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: type,
      url: type === 'image' ? 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400' : undefined,
      status: 'unread'
    };
    setConversations(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, msg] } : c));
  };

  const handleCall = () => {
    if (activeChat) alert(`Appel sortant vers ${activeChat.contactName}...`);
  };

  const submitReview = () => {
    alert(`Merci ! Note de ${rating}/5 envoyée avec le commentaire: ${comment}`);
    setShowRatingModal(false);
  };

  const activeChat = conversations.find(c => c.id === selectedId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedId, activeChat?.messages]);

  const handleSend = () => {
    if (!newMessage || !selectedId) return;
    const msg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      from: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'unread'
    };
    
    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) {
        return {
          ...c,
          lastMessage: newMessage,
          messages: [...c.messages, msg]
        };
      }
      return c;
    }));
    setNewMessage("");
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const togglePin = (id: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    ));
  };

  return (
    <div className="flex-1 flex bg-surface h-full overflow-hidden relative">
      
      {/* 1. Sidebar: Conversation List */}
      <div className={`w-full sm:w-80 border-r border-black/5 bg-white flex flex-col shrink-0 z-20 ${selectedId ? 'hidden sm:flex' : 'flex'}`}>
          {/* Sidebar Search */}
          <div className="p-6 pb-4">
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-black mb-4">Messages</h1>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher une conversation..."
                className="w-full bg-gray-50 border border-black/5 p-3 pl-10 rounded-xl text-xs font-bold outline-none focus:border-brand"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.filter(c => c.contactName.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
            <div 
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`p-4 border-b border-black/5 flex gap-4 cursor-pointer transition-all hover:bg-gray-50 group relative ${selectedId === c.id ? 'bg-brand/5 border-l-4 border-l-brand' : ''}`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-black/5 text-xl font-black italic text-gray-400">
                  {c.contactName.charAt(0)}
                </div>
                {c.isOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-xs font-black text-black uppercase truncate italic">{c.contactName}</h3>
                  <span className="text-[9px] font-bold text-gray-300">{c.time}</span>
                </div>
                <p className="text-[10px] text-gray-400 truncate font-semibold leading-tight">{c.lastMessage}</p>
              </div>
              {c.unreadCount > 0 && (
                <div className="bg-brand text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                  {c.unreadCount}
                </div>
              )}
              {c.isPinned && <Pin className="absolute top-2 right-2 w-2 h-2 text-brand-dark rotate-45" />}
              
              {/* Context Actions Hover */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={(e) => { e.stopPropagation(); togglePin(c.id); }} className="p-1.5 bg-white shadow-md rounded-lg text-gray-400 hover:text-brand-dark"><Pin className="w-3 h-3" /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }} className="p-1.5 bg-white shadow-md rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      {selectedId && activeChat ? (
        <div className="flex-1 flex flex-col h-full bg-white relative z-10">
          {/* Header */}
          <div className="h-20 border-b border-black/5 bg-white/80 backdrop-blur-md flex items-center px-4 sm:px-8 justify-between shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedId(null)}
                className="sm:hidden p-2 bg-gray-50 rounded-xl text-black"
                id="back-to-list"
              >
                <ChevronLeft />
              </button>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center border-2 border-brand/20 text-brand font-black text-xl italic">
                  {activeChat.contactName.charAt(0)}
                </div>
                {activeChat.isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-white" />}
              </div>
              <div>
                <div className="font-black text-sm text-black uppercase italic tracking-tighter">{activeChat.contactName}</div>
                <div className={`text-[9px] font-black uppercase tracking-widest ${activeChat.isOnline ? 'text-green-500' : 'text-gray-300'}`}>
                  {activeChat.isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleCall} className="p-3 bg-gray-50 rounded-xl text-brand-dark hover:bg-brand/10 transition-all border border-black/5 shadow-sm">
                    <Phone className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button onClick={() => setShowMenu(!showMenu)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {showMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white border border-black/5 rounded-2xl shadow-xl z-50 p-2 border-b-4 border-black/10 overflow-hidden"
                        >
                          <button onClick={() => handleMenuAction('Voir Profil')} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 rounded-xl">
                             <UserCheck className="w-4 h-4" /> Voir Profil
                          </button>
                          <button onClick={() => { setIsSearchingMessages(!isSearchingMessages); setShowMenu(false); }} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 rounded-xl">
                             <SearchIcon className="w-4 h-4" /> Rechercher dans la conversation
                          </button>
                          <hr className="my-2 border-black/5" />
                          <button onClick={() => handleMenuAction('Bloquer')} className={`w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 rounded-xl ${isBlocked ? 'text-green-500' : 'text-red-500'}`}>
                             <Ban className="w-4 h-4" /> {isBlocked ? 'Débloquer' : 'Bloquer'}
                          </button>
                          <button onClick={() => handleMenuAction('Signaler')} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl">
                             <Flag className="w-4 h-4" /> Signaler
                          </button>
                          <button onClick={() => deleteConversation(activeChat.id)} className="w-full flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl">
                             <Trash2 className="w-4 h-4" /> Supprimer la conversation
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
            </div>
          </div>

          {/* Message Search Bar */}
          <AnimatePresence>
            {isSearchingMessages && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 py-3 bg-gray-50 border-b border-black/5 flex items-center gap-3"
              >
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher un message..."
                  className="bg-transparent border-none outline-none text-xs font-bold w-full"
                  value={messageSearchTerm}
                  onChange={e => setMessageSearchTerm(e.target.value)}
                  autoFocus
                />
                <button onClick={() => { setIsSearchingMessages(false); setMessageSearchTerm(""); }} className="p-1 bg-white rounded-md text-gray-400 hover:text-black transition-colors"><X className="w-4 h-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Special Bar: Négociation / Intervention */}
          {interventionState === 'negotiating' && (
            <div className="px-6 py-3 bg-orange-50 border-b border-orange-100 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                   <Handshake className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-orange-800 uppercase italic tracking-tighter">Intervention en négociation</p>
                  <p className="text-[12px] font-black text-orange-600 uppercase italic">Prix proposé: 250 DH</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={handleProposePrice} className="px-4 py-2 bg-white border border-orange-200 text-orange-800 text-[9px] font-black uppercase rounded-lg hover:bg-orange-100 transition-colors">PROPOSER UN PRIX</button>
                 <button onClick={() => handleNegotiation(true)} className="px-4 py-2 bg-orange-500 text-white text-[9px] font-black uppercase rounded-lg hover:bg-orange-600 transition-colors">ACCEPTER</button>
                 <button onClick={() => handleNegotiation(false)} className="p-2 bg-red-50 text-red-500 rounded-lg"><XCircle className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {interventionState === 'accepted' && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-100 flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                   <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-[10px] font-black text-green-800 uppercase italic tracking-tighter">Intervention validée - Expert en route</p>
              </div>
              <button 
                onClick={handleCancel}
                className="px-4 py-2 bg-white border border-red-200 text-red-500 text-[9px] font-black uppercase rounded-lg hover:bg-red-50 transition-colors"
              >
                ANNULER
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none bg-slate-50/30"
          >
            {activeChat.messages
              .filter(m => m.text.toLowerCase().includes(messageSearchTerm.toLowerCase()))
              .map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.from === 'me' ? 'justify-end' : (msg.from === 'other' ? 'justify-start' : 'justify-center')}`}
              >
                {msg.from === 'system' ? (
                  <div className="bg-white/90 backdrop-blur border border-black/5 px-5 py-2.5 rounded-full text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-3 shadow-sm border-b-2">
                    <Shield className="w-4 h-4 text-brand-dark" /> {msg.text}
                  </div>
                ) : (
                  <div className={`p-4 rounded-[2rem] max-w-[80%] shadow-sm relative group overflow-hidden border ${msg.from === 'me' ? 'bg-black text-white border-white/10 rounded-tr-none' : 'bg-white text-black border-black/5 rounded-tl-none'}`}>
                     {msg.type === 'text' ? (
                       <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                     ) : (
                       <div className="space-y-2">
                          <img src={msg.url} alt="Envoyé" className="rounded-2xl w-full max-h-60 object-cover border border-black/10" />
                          <p className="text-[10px] font-bold opacity-60 italic">{msg.type === 'image' ? 'Image' : 'Vidéo'}</p>
                       </div>
                     )}
                     <div className={`flex items-center gap-1 mt-2 text-[8px] font-black uppercase tracking-widest ${msg.from === 'me' ? 'text-white/40 justify-end' : 'text-black/30'}`}>
                        {msg.timestamp}
                        {msg.from === 'me' && <CheckCheck className={`w-3 h-3 ${msg.status === 'read' ? 'text-brand' : ''}`} />}
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-black/5 relative shrink-0">
            {isBlocked && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-30 flex items-center justify-center">
                 <p className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                    <Ban className="w-4 h-4" /> Vous avez bloqué ce contact
                 </p>
              </div>
            )}
            <div className="bg-gray-50 rounded-[2.5rem] p-2 flex items-center gap-2 border border-black/5 shadow-inner">
               <div className="flex items-center gap-1 pl-2">
                  <button onClick={() => handleFileUpload('image')} className="p-3 text-gray-400 hover:text-black transition-colors rounded-2xl hover:bg-white active:scale-90"><ImageIcon className="w-5 h-5" /></button>
                  <button onClick={() => handleFileUpload('video')} className="p-3 text-gray-400 hover:text-black transition-colors rounded-2xl hover:bg-white active:scale-90"><VideoIcon className="w-5 h-5" /></button>
               </div>
               <input 
                 type="text" 
                 placeholder="Écrivez votre message..."
                 className="flex-1 bg-transparent border-none outline-none py-4 px-2 text-xs font-bold text-black"
                 value={newMessage}
                 onChange={e => setNewMessage(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSend()}
               />
               <button 
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="w-12 h-12 bg-black text-brand rounded-[1.5rem] flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-20 flex-shrink-0"
               >
                 <Send className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="hidden sm:flex flex-1 items-center justify-center bg-gray-50 flex-col text-center p-12">
            <div className="w-24 h-24 bg-white border-4 border-black/5 rounded-[2.5rem] flex items-center justify-center shadow-xl mb-6 text-brand-dark">
                <MessageSquare className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-black mb-2">Vos Messages</h2>
            <p className="text-sm font-bold text-gray-400 max-w-xs uppercase leading-tight">Sélectionnez une conversation pour négocier ou suivre votre intervention.</p>
        </div>
      )}

      {/* Rating Modal */}
      <AnimatePresence>
         {showRatingModal && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[2000]"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-[3rem] p-10 z-[2001] shadow-2xl text-center"
             >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black mb-2">Intervention terminée</h3>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-8">Partagez votre expérience</p>

                <div className="flex justify-center gap-2 mb-8">
                   {[1, 2, 3, 4, 5].map(s => (
                     <button 
                      key={s} 
                      onClick={() => setRating(s)}
                      className={`p-1.5 transition-all ${rating >= s ? 'text-yellow-400 scale-110' : 'text-gray-200 hover:text-yellow-200'}`}
                     >
                       <Star className={`w-8 h-8 ${rating >= s ? 'fill-yellow-400' : ''}`} />
                     </button>
                   ))}
                </div>

                <textarea 
                  placeholder="Laissez un commentaire..."
                  className="w-full bg-gray-50 border-2 border-black/5 rounded-2xl p-4 text-xs font-bold min-h-[100px] mb-6 focus:border-brand outline-none shadow-inner"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />

                <button 
                  onClick={submitReview}
                  className="w-full py-5 bg-black text-brand rounded-2xl font-black uppercase italic tracking-widest text-sm shadow-xl active:scale-95 transition-all"
                >
                  Envoyer mon avis
                </button>
             </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
}

