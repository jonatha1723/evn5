import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Ban, Calendar, AlertTriangle } from 'lucide-react';

interface AdminBanModalProps {
  isOpen: boolean;
  targetName: string;
  targetType: 'user' | 'group';
  reason: string;
  setReason: (val: string) => void;
  duration: number;
  setDuration: (val: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export const AdminBanModal: React.FC<AdminBanModalProps> = ({
  isOpen, targetName, targetType, reason, setReason, duration, setDuration, onConfirm, onCancel, loading
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-[#0a0a0a] border border-red-500/10 rounded-[32px] p-10 overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/30" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/80">Restrição de Acesso</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {targetType === 'user' ? 'Banir Usuário' : 'Restringir Grupo'}
                </h3>
              </div>
              <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-1">Motivo da Infração</label>
                <input 
                  type="text" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Descreva o motivo..."
                  className="w-full bg-white/5 border border-white/5 hover:border-red-500/30 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider ml-1">Duração do Bloqueio</label>
                <div className="relative">
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/5 hover:border-red-500/30 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-red-500/50 appearance-none cursor-pointer transition-all pr-10"
                  >
                    <option value={0} className="bg-zinc-950">PERMANENTE</option>
                    <option value={1} className="bg-zinc-950">24 HORAS</option>
                    <option value={3} className="bg-zinc-950">72 HORAS</option>
                    <option value={7} className="bg-zinc-950">1 SEMANA</option>
                    <option value={30} className="bg-zinc-950">1 MÊS</option>
                  </select>
                  <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2">
              <button
                onClick={onConfirm}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Confirmar Restrição'}
              </button>
              <button
                onClick={onCancel}
                className="w-full py-3 rounded-2xl font-bold text-[11px] text-zinc-500 hover:text-white transition-all"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
