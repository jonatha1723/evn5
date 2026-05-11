import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, MessageSquare, Activity, Search, RefreshCw, AlertCircle, Terminal } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserData, Group } from '../../types';

// Modular Components
import { AdminConfirmModal } from './admin/AdminConfirmModal';
import { AdminUserTable } from './admin/AdminUserTable';
import { AdminGroupTable } from './admin/AdminGroupTable';
import { AdminBanModal } from './admin/AdminBanModal';
import { AdminUserDetailModal } from './admin/AdminUserDetailModal';

export { type UserData };

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGroup: (group: Group) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onSelectGroup }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'groups' | 'logs'>('overview');
  const [users, setUsers] = useState<UserData[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'success';
  } | null>(null);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<{ groupsJoined: number, ownedGroups: number, lastActive: string } | null>(null);

  const [banTarget, setBanTarget] = useState<{ id: string, type: 'user' | 'group', currentStatus: boolean } | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDurationDays, setBanDurationDays] = useState<number>(0);

  useEffect(() => {
    if (selectedUser) {
      const joined = allGroups.filter(g => g.members?.includes(selectedUser.uid) || Object.keys(g.memberJoinedAt || {}).includes(selectedUser.uid)).length;
      const owned = allGroups.filter(g => g.adminUid === selectedUser.uid).length;
      const lastActiveD = selectedUser.lastActive ? new Date(selectedUser.lastActive.seconds * 1000) : null;
      setUserStats({
        groupsJoined: joined,
        ownedGroups: owned,
        lastActive: lastActiveD ? lastActiveD.toLocaleString() : 'Desconhecido'
      });
    } else {
      setUserStats(null);
    }
  }, [selectedUser, allGroups]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(d => {
        const data = d.data();
        return { ...data, uid: data.uid || d.id } as UserData;
      });
      setUsers(usersData);

      const groupsSnap = await getDocs(collection(db, 'groups'));
      const groupsData = groupsSnap.docs.map(d => {
        const data = d.data();
        return { ...data, id: d.id } as Group;
      });
      setAllGroups(groupsData);
      
    } catch (err: any) {
      console.error("Admin data error:", err);
      setError("Erro ao sincronizar database. Verifique suas permissões.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    if (activeTab !== 'logs') return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      if (!res.ok) throw new Error('Falha ao buscar logs');
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : data.logs || []);
    } catch (err: any) {
      setLogs([
        { type: "SYSTEM", message: "Conexão com serviço de logs indisponível.", timestamp: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  const handleBanUser = (userId: string, currentStatus: boolean) => {
    if (currentStatus) {
      setConfirmModalData({
        title: 'Restaurar Acesso',
        message: 'Deseja restaurar as permissões de acesso deste usuário?',
        type: 'success',
        onConfirm: async () => {
          setConfirmModalData(null);
          setLoading(true);
          try {
            const userRef = doc(db, 'users', userId);
            const updatedFields = { isBanned: false, bannedUntil: null, banReason: '' };
            await updateDoc(userRef, updatedFields);
            setUsers(prev => prev.map(u => u.uid === userId ? { ...u, ...updatedFields } as UserData : u));
            if (selectedUser?.uid === userId) setSelectedUser(prev => prev ? { ...prev, ...updatedFields } as UserData : null);
          } catch (err: any) {
            setError(`Erro ao restaurar: ${err.message}`);
          } finally {
            setLoading(false);
          }
        }
      });
    } else {
      setBanTarget({ id: userId, type: 'user', currentStatus: false });
    }
  };

  const handleBanGroup = (groupId: string, currentStatus: boolean) => {
    if (currentStatus) {
      setConfirmModalData({
        title: 'Ativar Grupo',
        message: 'Deseja remover as restrições deste grupo?',
        type: 'success',
        onConfirm: async () => {
          setConfirmModalData(null);
          setLoading(true);
          try {
            const groupRef = doc(db, 'groups', groupId);
            const updatedFields = { isBanned: false, bannedUntil: null, banReason: '' };
            await updateDoc(groupRef, updatedFields);
            setAllGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updatedFields } as Group : g));
          } catch (err: any) {
            setError(`Erro ao reativar: ${err.message}`);
          } finally {
            setLoading(false);
          }
        }
      });
    } else {
      setBanTarget({ id: groupId, type: 'group', currentStatus: false });
    }
  };

  const executeBan = async () => {
    if (!banTarget) return;
    setLoading(true);
    try {
      const banData = {
        isBanned: true,
        bannedUntil: banDurationDays > 0 ? Date.now() + (banDurationDays * 24 * 60 * 60 * 1000) : null,
        banReason: banReason || 'Violação dos Termos'
      };

      if (banTarget.type === 'user') {
        await updateDoc(doc(db, 'users', banTarget.id), banData);
        setUsers(prev => prev.map(u => u.uid === banTarget.id ? { ...u, ...banData } as UserData : u));
        if (selectedUser?.uid === banTarget.id) setSelectedUser(prev => prev ? { ...prev, ...banData } as UserData : null);
      } else {
        await updateDoc(doc(db, 'groups', banTarget.id), banData);
        setAllGroups(prev => prev.map(g => g.id === banTarget.id ? { ...g, ...banData } as Group : g));
      }

      setBanTarget(null);
      setBanReason('');
      setBanDurationDays(0);
    } catch (err: any) {
      setError("Erro ao aplicar restrição.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmModalData({
      title: 'Excluir Conta',
      message: 'Esta ação removerá permanentemente o usuário da base de dados. Deseja continuar?',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModalData(null);
        try {
          await deleteDoc(doc(db, 'users', userId));
          setUsers(users.filter(u => u.uid !== userId));
        } catch (err) {
          setError("Erro ao excluir registro.");
        }
      }
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    setConfirmModalData({
      title: 'Excluir Grupo',
      message: 'Deseja excluir este grupo permanentemente?',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModalData(null);
        try {
          await deleteDoc(doc(db, 'groups', groupId));
          setAllGroups(allGroups.filter(g => g.id !== groupId));
        } catch (err) {
          setError("Erro ao excluir grupo.");
        }
      }
    });
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = allGroups.filter(g => 
    g.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#080808] border-l border-white/5 h-full flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-zinc-900/10 shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Administração</h2>
                    <p className="text-xs text-zinc-500 mt-1">Gestão de acessos e infraestrutura</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
                  {[
                    { id: 'overview', label: 'Geral' },
                    { id: 'users', label: 'Usuários' },
                    { id: 'groups', label: 'Grupos' },
                    { id: 'logs', label: 'Logs' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div layoutId="tabBg" className="absolute inset-0 bg-white/5 rounded-lg" />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] font-bold uppercase tracking-wide">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </motion.div>
                )}

                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Usuários', value: users.length, color: 'text-emerald-500' },
                        { label: 'Grupos', value: allGroups.length, color: 'text-blue-500' },
                        { label: 'Sessões', value: users.length + 3, color: 'text-amber-500' },
                      ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[28px] hover:border-white/10 transition-colors">
                          <p className={`text-3xl font-bold ${stat.color} leading-none tracking-tight`}>{stat.value}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em] mt-3">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[32px]">
                      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Operações Disponíveis</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button onClick={fetchAdminData} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 rounded-[24px] transition-all text-left">
                          <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Sincronizar Database</p>
                            <p className="text-[9px] text-zinc-500 font-medium">Atualizar servidores</p>
                          </div>
                        </button>
                        <button onClick={() => setActiveTab('logs')} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 rounded-[24px] transition-all text-left">
                          <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                            <Terminal className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Auditoria de Logs</p>
                            <p className="text-[9px] text-zinc-500 font-medium">Investigar tráfego</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-600 absolute left-6 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Pesquisar por nome ou email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-[20px] py-4.5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-medium"
                      />
                    </div>
                    <AdminUserTable 
                      users={filteredUsers} 
                      onSelect={setSelectedUser} 
                      onBan={handleBanUser} 
                      onDelete={handleDeleteUser} 
                    />
                  </div>
                )}

                {activeTab === 'groups' && (
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-600 absolute left-6 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Pesquisar grupos de conversas..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-[20px] py-4.5 pl-14 pr-6 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-medium"
                      />
                    </div>
                    <AdminGroupTable 
                      groups={filteredGroups} 
                      onJoin={onSelectGroup}
                      onBan={handleBanGroup} 
                      onDelete={handleDeleteGroup} 
                    />
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Logs de Processamento</p>
                      <button onClick={fetchLogs} className="text-[10px] text-zinc-400 hover:text-white uppercase font-bold tracking-widest flex gap-2 items-center">
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Atualizar
                      </button>
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-[28px] p-6 font-mono text-[10px] h-[500px] overflow-y-auto custom-scrollbar leading-relaxed">
                      {logs.map((log, i) => (
                        <div key={i} className="flex gap-5 py-2 border-b border-white/[0.03]">
                          <span className="text-zinc-600 shrink-0 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className={`shrink-0 font-bold ${log.type === 'ERROR' ? 'text-red-500' : 'text-blue-500'}`}>[{log.type || 'INFO'}]</span>
                          <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">{log.message}</span>
                        </div>
                      ))}
                      {logs.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-40 uppercase tracking-[0.2em] font-bold">
                           Nenhum log capturado
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminConfirmModal
        isOpen={!!confirmModalData}
        title={confirmModalData?.title || ''}
        message={confirmModalData?.message || ''}
        type={confirmModalData?.type || 'warning'}
        onConfirm={confirmModalData?.onConfirm || (() => {})}
        onCancel={() => setConfirmModalData(null)}
      />

      <AdminBanModal
        isOpen={!!banTarget}
        targetName={banTarget?.id || ''}
        targetType={banTarget?.type || 'user'}
        reason={banReason}
        setReason={setBanReason}
        duration={banDurationDays}
        setDuration={setBanDurationDays}
        onConfirm={executeBan}
        onCancel={() => setBanTarget(null)}
        loading={loading}
      />

      <AdminUserDetailModal
        user={selectedUser}
        stats={userStats}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
};
