import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Shield, Users, Database, Ban, Globe, MapPin, Cpu, Activity } from 'lucide-react';
import { UserData } from '../AdminDashboard';

interface AdminUserDetailModalProps {
  user: UserData | null;
  stats: { groupsJoined: number, ownedGroups: number, lastActive: string } | null;
  onClose: () => void;
}

export const AdminUserDetailModal: React.FC<AdminUserDetailModalProps> = ({ user, stats, onClose }) => {
  if (!user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/5 rounded-[32px] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/5" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-2xl ring-2 ring-white/5">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 ${user.isBanned ? 'bg-red-500' : 'bg-emerald-500'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{user.displayName}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5 opacity-60">Perfil do Sistema</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="col-span-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 opacity-60">Endereço de Login</p>
                <p className="text-sm text-zinc-300 truncate">{user.email}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 opacity-60">Código Único</p>
                <p className="font-mono text-emerald-500 text-[11px] font-bold tracking-tight">{user.uniqueCode}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 opacity-60">Permissão</p>
                <p className="text-[11px] font-bold text-white uppercase tracking-widest">{user.role || 'USER'}</p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 opacity-60">Grupos Participantes</p>
                <p className="text-xl font-bold text-white">{stats?.groupsJoined ?? '0'}</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 opacity-60">Grupos Criados</p>
                <p className="text-xl font-bold text-white">{stats?.ownedGroups ?? '0'}</p>
              </div>
            </div>

            {user.networkInfo && (
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                  <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Rastreamento de Terminal</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="group relative flex items-center gap-3 p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all">
                    <Globe className="w-4 h-4 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div className="min-w-0">
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight">IP Address</p>
                      <p className="text-[11px] text-zinc-300 font-mono font-bold leading-none mt-1">{user.networkInfo.ip}</p>
                    </div>
                  </div>

                  <div className="group relative flex items-center gap-3 p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all">
                    <MapPin className="w-4 h-4 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div className="min-w-0">
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight">Location</p>
                      <p className="text-[11px] text-zinc-300 font-bold leading-none mt-1 truncate">
                        {user.networkInfo.city}, {user.networkInfo.country}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 group relative flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-emerald-500/50" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight">Provider / ISP Infrastructure</p>
                      <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">{user.networkInfo.isp || 'Undefined Infrastructure'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight">Timezone</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{user.networkInfo.timezone}</p>
                    </div>
                  </div>
                </div>

                {user.networkInfo.lastSeen && (
                  <div className="flex items-center gap-2 px-2 text-[9px] text-zinc-600 font-medium italic">
                    <Activity className="w-3 h-3" />
                    Última sincronização de rede: {new Date(user.networkInfo.lastSeen).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {user.isBanned && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-red-500/5 rounded-2xl border border-red-500/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-5">
                  <Ban className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest mb-2">Registro de Restrição</p>
                <div className="space-y-1">
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight opacity-50">Motivo:</p>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">{user.banReason || 'Violação de protocolo'}</p>
                </div>
              </motion.div>
            )}

            <div className="mt-8 flex justify-end">
              <p className="text-[10px] text-zinc-600 font-medium">Última atividade: {stats?.lastActive}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
