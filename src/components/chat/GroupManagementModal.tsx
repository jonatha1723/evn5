import React, { useState } from 'react';
import { X, Users, Link, UserPlus, Ban, VolumeX, LogOut, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Group, UserData } from '../../types';

interface GroupManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  userData: UserData | null;
  contacts: UserData[];
}

export const GroupManagementModal: React.FC<GroupManagementModalProps> = ({ isOpen, onClose, group, userData, contacts }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'members' | 'admin'>('members');
  const isAdmin = userData?.uid === group.adminUid;

  const memberName = (uid: string) => {
    if (uid === userData?.uid) return `${userData.displayName} (voce)`;
    return contacts.find(c => c.uid === uid)?.displayName || uid.slice(0, 8);
  };

  const inviteById = async () => {
    if (!userData || !isAdmin || !inviteCode.trim()) return;
    setStatus('');
    const normalized = inviteCode.trim().toUpperCase();
    const snap = await getDocs(query(collection(db, 'users'), where('uniqueCode', '==', normalized)));
    if (snap.empty) {
      setStatus('ID nao encontrado.');
      return;
    }

    const target = snap.docs[0].data() as UserData;
    if (group.banned?.includes(target.uid)) {
      setStatus('Este usuario esta banido do grupo.');
      return;
    }

    const requestId = `${group.id}_${target.uid}`;
    await setDoc(doc(db, 'requests', requestId), {
      id: requestId,
      type: 'group',
      fromUid: userData.uid,
      fromName: userData.displayName,
      fromCode: userData.uniqueCode,
      toUid: target.uid,
      targetCode: normalized,
      groupId: group.id,
      groupName: group.name,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setInviteCode('');
    setStatus('Convite enviado para o sininho.');
  };

  const createGroupLink = async () => {
    if (!userData || !isAdmin) return;
    const tokenId = crypto.randomUUID();
    const now = Date.now();
    await setDoc(doc(db, 'groupInviteTokens', tokenId), {
      groupId: group.id,
      groupName: group.name,
      creatorUid: userData.uid,
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
      revoked: false,
    });
    await navigator.clipboard.writeText(`${window.location.origin}/?groupInvite=${tokenId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setStatus('Link copiado. Ele expira em 24h.');
  };

  const expel = async (uid: string) => {
    if (!isAdmin || uid === group.adminUid) return;
    await updateDoc(doc(db, 'groups', group.id), {
      members: arrayRemove(uid),
      [`memberJoinedAt.${uid}`]: null,
    });
  };

  const ban = async (uid: string) => {
    if (!isAdmin || uid === group.adminUid) return;
    await updateDoc(doc(db, 'groups', group.id), {
      members: arrayRemove(uid),
      banned: arrayUnion(uid),
      [`memberJoinedAt.${uid}`]: null,
    });
  };

  const unban = async (uid: string) => {
    if (!isAdmin) return;
    await updateDoc(doc(db, 'groups', group.id), {
      banned: arrayRemove(uid),
    });
  };

  const toggleMute = async (uid: string) => {
    if (!isAdmin || uid === group.adminUid) return;
    const isMuted = group.mutedUntil?.[uid] && group.mutedUntil[uid] > Date.now();
    await updateDoc(doc(db, 'groups', group.id), {
      [`mutedUntil.${uid}`]: isMuted ? null : Date.now() + 100 * 365 * 24 * 60 * 60 * 1000, // 100 anos (permanente)
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{group.name}</h2>
                  <p className="text-xs text-zinc-500">{group.members.length} membros</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {isAdmin && (
              <div className="flex border-b border-zinc-900 bg-zinc-950/50">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'members' 
                      ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-2 border-transparent'
                  }`}
                >
                  Membros
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'admin' 
                      ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-500/5' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border-b-2 border-transparent'
                  }`}
                >
                  Administração
                </button>
              </div>
            )}

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-zinc-950">
              
              {activeTab === 'admin' && isAdmin && (
                <div className="space-y-6">
                  <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-inner">
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">Convites e Adição</h3>
                      <p className="text-xs text-zinc-500 mt-1">Convide usuários diretamente ou gere um link público de acesso.</p>
                    </div>

                    {status && (
                      <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 leading-relaxed">
                        {status}
                      </p>
                    )}

                    <div className="grid md:grid-cols-2 gap-3 pt-2">
                      <button onClick={createGroupLink} className="flex items-center justify-center gap-2 py-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-widest border border-zinc-700/50 transition-all">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link className="w-4 h-4" />}
                        {copied ? 'Link Copiado!' : 'Gerar Link (24h)'}
                      </button>
                      <div className="flex gap-2">
                        <input 
                          value={inviteCode} 
                          onChange={(e) => setInviteCode(e.target.value.toUpperCase())} 
                          placeholder="ID ex: ABCD123" 
                          className="min-w-0 flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 uppercase placeholder:normal-case font-mono" 
                        />
                        <button onClick={inviteById} className="px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center disabled:opacity-50" disabled={!inviteCode.trim()}>
                          <UserPlus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </section>

                  {group.banned && group.banned.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <Ban className="w-4 h-4 text-red-500" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-red-500">Usuários Banidos</h3>
                      </div>
                      <div className="space-y-2">
                        {group.banned.map(uid => (
                          <div key={uid} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-3 group">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate">{memberName(uid)}</p>
                              <p className="text-[10px] text-zinc-600 font-mono truncate">{uid}</p>
                            </div>
                            <button onClick={() => unban(uid)} className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-bold transition-all uppercase tracking-widest opacity-80 md:opacity-0 md:group-hover:opacity-100">
                              Desbanir
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {(!isAdmin || activeTab === 'members') && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Membros Atuais
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {group.members.map(uid => (
                      <div key={uid} className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white truncate">{memberName(uid)}</p>
                            {uid === group.adminUid && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase tracking-widest border border-emerald-500/20">Admin</span>
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-600 font-mono truncate mt-0.5">{uid}</p>
                          {group.mutedUntil?.[uid] && group.mutedUntil[uid] > Date.now() && (
                            <div className="flex items-center gap-1.5 mt-2 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-md w-fit border border-yellow-500/20">
                              <VolumeX className="w-3 h-3" />
                              <p className="text-[10px] font-bold uppercase tracking-wider">Mutado</p>
                            </div>
                          )}
                        </div>
                        
                        {isAdmin && uid !== group.adminUid && (
                          <div className="flex flex-wrap gap-2 items-center md:opacity-40 md:hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toggleMute(uid)}
                              className={`h-9 px-4 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2 uppercase tracking-wide
                                ${group.mutedUntil?.[uid] && group.mutedUntil[uid] > Date.now() 
                                  ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/20' 
                                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'}`}
                            >
                              <VolumeX className="w-3.5 h-3.5" />
                              {group.mutedUntil?.[uid] && group.mutedUntil[uid] > Date.now() ? 'Desmutar' : 'Mutar'}
                            </button>
                            
                            <div className="flex gap-0.5 h-9 bg-zinc-800/80 rounded-xl border border-zinc-700/50 overflow-hidden">
                              <button onClick={() => expel(uid)} className="px-3 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all flex items-center justify-center" title="Remover">
                                <LogOut className="w-4 h-4" />
                              </button>
                              <div className="w-px bg-zinc-700/50 my-1" />
                              <button onClick={() => ban(uid)} className="px-3 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-all flex items-center justify-center" title="Banir">
                                <Ban className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
