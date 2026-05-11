import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Ban, Eye, Trash2 } from 'lucide-react';
import { UserData } from '../AdminDashboard';

interface AdminUserTableProps {
  users: UserData[];
  onSelect: (user: UserData) => void;
  onBan: (uid: string, isBanned: boolean) => void;
  onDelete: (uid: string) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({ users, onSelect, onBan, onDelete }) => {
  return (
    <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            <th className="px-6 py-4">Usuário</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Papel</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-xs shrink-0 overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {user.isBanned ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                    <Ban className="w-3 h-3" /> Banido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                    Ativo
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold text-zinc-400 border border-white/10 px-2 py-1 rounded text-center min-w-[50px] inline-block uppercase tracking-wider">
                  {user.role || 'USER'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onSelect(user)}
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-all"
                    title="Detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onBan(user.uid, !!user.isBanned)}
                    className={`p-2 hover:bg-white/5 rounded-lg transition-all ${user.isBanned ? 'text-emerald-500' : 'text-amber-500'}`}
                    title={user.isBanned ? "Restaurar" : "Banir"}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(user.uid)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-all"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="p-12 text-center text-zinc-500 text-sm">
          Nenhum usuário encontrado na database.
        </div>
      )}
    </div>
  );
};
