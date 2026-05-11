import React from 'react';
import { Users, Shield, Ban, Trash2, Globe, LogIn } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  description?: string;
  isBanned?: boolean;
}

interface AdminGroupTableProps {
  groups: Group[];
  onJoin: (group: Group) => void;
  onBan: (id: string, isBanned: boolean) => void;
  onDelete: (id: string) => void;
}

export const AdminGroupTable: React.FC<AdminGroupTableProps> = ({ groups, onJoin, onBan, onDelete }) => {
  return (
    <div className="bg-black/20 border border-white/5 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            <th className="px-6 py-4">Grupo</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {groups.map((group) => (
            <tr key={group.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{group.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{group.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                {group.isBanned ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                    Restrito
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                    Público
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onJoin(group)}
                    className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition-all"
                    title="Acessar Cluster"
                  >
                    <LogIn className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onBan(group.id, !!group.isBanned)}
                    className={`p-2 hover:bg-white/5 rounded-lg transition-all ${group.isBanned ? 'text-emerald-500' : 'text-amber-500'}`}
                    title={group.isBanned ? "Restaurar" : "Restringir"}
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(group.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-500 transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {groups.length === 0 && (
        <div className="p-12 text-center text-zinc-500 text-sm">
          Nenhum grupo encontrado na plataforma.
        </div>
      )}
    </div>
  );
};
