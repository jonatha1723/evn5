import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Trash2, Settings, MoreVertical, Edit2, UserX, Ban, UserRound } from 'lucide-react';
import { createPortal } from 'react-dom';
import { UserData } from '../../types';
import { safeToDate, getRelativeTime } from '../../lib/dateUtils';
import { AnimatePresence, motion } from 'motion/react';

interface ChatHeaderProps {
  activeContact: UserData;
  onBack: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
  isTyping: boolean;
  onOpenGroupSettings?: () => void;
  onRemoveContact?: (uid: string) => Promise<void>;
  onBlockContact?: (uid: string) => Promise<void>;
  onSetContactNickname?: (uid: string, nickname: string) => Promise<void>;
  originalUserData?: UserData | null;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  activeContact, 
  onBack, 
  onClearChat,
  hasMessages,
  isTyping,
  onOpenGroupSettings,
  onRemoveContact,
  onBlockContact,
  onSetContactNickname,
  originalUserData
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSetNickname = async () => {
    if (onSetContactNickname && activeContact.uid) {
      setIsSavingNickname(true);
      try {
        await onSetContactNickname(activeContact.uid, nicknameInput);
        setShowNicknameModal(false);
        setNicknameInput('');
      } catch (error) {
        console.error("Erro ao salvar apelido:", error);
      } finally {
        setIsSavingNickname(false);
      }
    }
  };

  const currentCustomName = originalUserData?.settings?.customNames?.[activeContact.uid] || '';

  const presenceStatus = (() => {
    if (activeContact.email === 'Grupo') {
      return <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">Grupo • Criptografado</p>;
    }
    
    if (isTyping) return <p className="text-[10px] text-emerald-400 font-bold tracking-wider animate-pulse">Digitando...</p>;
    
    if (!activeContact.lastActive) return <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">OFF</p>;
    
    const lastSeen = safeToDate(activeContact.lastActive).getTime();
    const isOnline = Date.now() - lastSeen < 150000;

    if (isOnline) return <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-0.5">ON</p>;

    return <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">OFF • {getRelativeTime(activeContact.lastActive)}</p>;
  })();

  return (
    <>
      <div className="h-20 border-b border-[var(--border-color)] flex items-center px-4 md:px-8 bg-[var(--bg-chat)] backdrop-blur-xl z-20 sticky top-0 transition-colors duration-300">
        <div className="flex items-center gap-4 w-full">
        <button 
          onClick={onBack}
          className="md:hidden p-2 text-zinc-500 hover:text-white active:bg-zinc-900 rounded-xl transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xl shadow-inner ${activeContact.email === 'Grupo' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20' : 'text-emerald-500'}`}>
          {activeContact.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h2 className="font-bold text-lg truncate text-white tracking-tight">{activeContact.displayName}</h2>
          {presenceStatus}
        </div>
        {activeContact.email === 'Grupo' && onOpenGroupSettings && (
          <button
            onClick={onOpenGroupSettings}
            className="p-2.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-xl transition-all shrink-0"
            title="Opcoes do grupo"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
        {hasMessages && (
          <button
            onClick={onClearChat}
            className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all shrink-0"
            title="Limpar Conversa"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        
        {activeContact.email !== 'Grupo' && (
          <div className="relative shrink-0" ref={optionsRef}>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={`p-2.5 rounded-xl transition-all ${showOptions ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}`}
              title="Mais opções"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  style={{ right: 0, top: 'calc(100% + 4px)' }}
                  className="absolute w-[200px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl z-[100] flex flex-col py-1"
                >
                  <button 
                    onClick={() => { setShowNicknameModal(true); setNicknameInput(currentCustomName); setShowOptions(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors text-left"
                  >
                    <Edit2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span className="truncate">Personalizar Apelido</span>
                  </button>
                  <div className="w-full h-px bg-zinc-800/50 my-1" />
                  <button 
                    onClick={() => { setShowConfirmRemove(true); setShowOptions(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-yellow-500 hover:bg-yellow-500/10 transition-colors text-left"
                  >
                    <UserX className="w-4 h-4 shrink-0" />
                    <span className="truncate">Remover Contato</span>
                  </button>
                  <button 
                    onClick={() => { setShowConfirmBlock(true); setShowOptions(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <Ban className="w-4 h-4 shrink-0" />
                    <span className="truncate">Bloquear Usuário</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>

      {createPortal(
        <AnimatePresence>
          {showConfirmRemove && (
            <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-black/80 backdrop-blur-md" 
                onClick={() => setShowConfirmRemove(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500">
                    <UserX className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Remover Contato</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-5">Você tem certeza que deseja remover <strong>{activeContact.displayName}</strong> da sua lista de contatos?</p>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setShowConfirmRemove(false)}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => { if(onRemoveContact && activeContact.uid) onRemoveContact(activeContact.uid); setShowConfirmRemove(false); }}
                    className="flex-1 py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    Remover
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {showConfirmBlock && (
            <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-black/80 backdrop-blur-md" 
                onClick={() => setShowConfirmBlock(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-red-500/10 rounded-xl text-red-500">
                    <Ban className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Bloquear Usuário</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-5">Tem certeza que deseja bloquear <strong>{activeContact.displayName}</strong>? O usuário será removido da sua lista e não poderá mais enviar mensagens ou convites.</p>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setShowConfirmBlock(false)}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => { if(onBlockContact && activeContact.uid) onBlockContact(activeContact.uid); setShowConfirmBlock(false); }}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    Bloquear
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {showNicknameModal && (
            <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-black/95 backdrop-blur-xl" 
                onClick={() => !isSavingNickname && setShowNicknameModal(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Editar Apelido</h2>
                </div>
                <p className="text-xs text-zinc-400 mb-6 font-medium leading-relaxed">
                  O apelido será exibido apenas para você. Deixe em branco para usar o nome original do contato.
                </p>
                
                <input
                  type="text"
                  value={nicknameInput}
                  disabled={isSavingNickname}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSavingNickname) handleSetNickname();
                    if (e.key === 'Escape' && !isSavingNickname) setShowNicknameModal(false);
                  }}
                  placeholder="Ex: João (Trabalho)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 mb-8 transition-all shadow-inner disabled:opacity-50"
                  autoFocus
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowNicknameModal(false)}
                    disabled={isSavingNickname}
                    className="py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors border border-zinc-800 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSetNickname}
                    disabled={isSavingNickname}
                    className="py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSavingNickname ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {isSavingNickname ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
