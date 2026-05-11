import React, { useState } from 'react';
import { UserCircle, Mail, Key, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginFormProps {
  isRegistering: boolean;
  setIsRegistering: (val: boolean) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  displayName: string;
  setDisplayName: (val: string) => void;
  authError: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  isRegistering,
  setIsRegistering,
  email,
  setEmail,
  password,
  setPassword,
  displayName,
  setDisplayName,
  authError,
  onSubmit,
  isSubmitting
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !termsAccepted) return;
    onSubmit(e);
  };

  const isButtonDisabled = isSubmitting || (isRegistering && !termsAccepted);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistering && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 ml-1">Nome</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                type="text"
                placeholder="Seu nome"
                maxLength={10}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-all text-sm"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 10))}
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 ml-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 ml-1">Senha</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="password"
              placeholder="Sua senha"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500 transition-all text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {isRegistering && (
          <div className="flex items-start gap-3 mt-4 mb-2">
            <button
              type="button"
              onClick={() => setTermsAccepted(!termsAccepted)}
              className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                termsAccepted 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'bg-zinc-950 border-zinc-700 text-transparent hover:border-emerald-500/50'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Eu li e aceito os{' '}
              <a 
                href="#/terms" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-emerald-500 hover:text-emerald-400 font-bold underline decoration-emerald-500/30 underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                Termos de Serviço e Privacidade
              </a>
              .
            </p>
          </div>
        )}

        {authError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-xs text-red-400 text-center font-medium">{authError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
            />
          ) : (
            <>
              <span>{isRegistering ? 'Cadastrar' : 'Entrar'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-zinc-400 hover:text-emerald-500 transition-colors"
        >
          {isRegistering ? (
            <>Já tem uma conta? <span className="font-bold">Entrar</span></>
          ) : (
            <>Não tem uma conta? <span className="font-bold">Criar agora</span></>
          )}
        </button>
      </div>
    </div>
  );
};