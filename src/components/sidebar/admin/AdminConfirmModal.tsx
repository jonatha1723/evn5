import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/5 rounded-3xl shadow-2xl p-8 overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-full h-[2px] ${
              type === 'danger' ? 'bg-red-500' : 
              type === 'warning' ? 'bg-amber-500' : 
              'bg-emerald-500'
            }`} />

            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                type === 'danger' ? 'bg-red-500/10 text-red-500' : 
                type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                'bg-emerald-500/10 text-emerald-500'
              }`}>
                <Shield className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-tight">{title}</h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed px-4">{message}</p>

              <div className="flex flex-col w-full gap-2">
                <button
                  onClick={onConfirm}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
                    type === 'danger' ? 'bg-red-500 text-white hover:bg-red-600' : 
                    type === 'warning' ? 'bg-amber-500 text-black hover:bg-amber-400' : 
                    'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  Confirmar
                </button>
                <button
                  onClick={onCancel}
                  className="w-full py-3.5 rounded-2xl font-bold text-xs text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
