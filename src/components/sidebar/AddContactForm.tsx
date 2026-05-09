import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddContactFormProps {
  onAddContact: (code: string) => Promise<boolean>;
}

export const AddContactForm: React.FC<AddContactFormProps> = ({ onAddContact }) => {
  const [newContactCode, setNewContactCode] = useState('');
  const [addContactError, setAddContactError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddContactError('');
    setIsSuccess(false);
    setIsLoading(true);

    try {
      await onAddContact(newContactCode);
      setIsSuccess(true);
      setNewContactCode('');
      // Esconder mensagem de sucesso após alguns segundos
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      setAddContactError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border-b border-zinc-900">
      <form onSubmit={handleAddContactSubmit} className="space-y-3">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Adicionar ID de contato" 
            value={newContactCode}
            inputMode="numeric"
            disabled={isLoading}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, '');
              setNewContactCode(onlyDigits.slice(0, 11));
            }}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-4 pr-12 py-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-mono placeholder:font-sans placeholder:text-zinc-600 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isLoading || !newContactCode}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-emerald-900/20"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {addContactError && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-xs px-1 font-medium"
            >
              {addContactError}
            </motion.p>
          )}
          {isSuccess && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-emerald-400 text-xs px-1 font-medium"
            >
              Pedido de amizade enviado com sucesso!
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
