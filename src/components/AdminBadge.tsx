import React, { useEffect, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

let cachedAdminUid: string | null = null;

export const AdminBadge = ({ uid, email }: { uid?: string, email?: string }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (email) {
      setIsAdmin(email === 'jogonesteterp@gmail.com');
      return;
    }
    
    if (uid) {
      if (cachedAdminUid === uid) {
        setIsAdmin(true);
        return;
      }
      if (cachedAdminUid && cachedAdminUid !== uid) {
        setIsAdmin(false);
        return;
      }

      const fetchAdmin = async () => {
        try {
          const q = query(collection(db, 'users'), where('email', '==', 'jogonesteterp@gmail.com'));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            cachedAdminUid = snapshot.docs[0].id;
            if (cachedAdminUid === uid) setIsAdmin(true);
          }
        } catch (e) {
          console.error("Erro ao verificar admin:", e);
        }
      };
      
      fetchAdmin();
    }
  }, [uid, email]);

  if (!isAdmin) return null;

  return (
    <span 
      className="inline-flex items-center justify-center text-blue-500 ml-1 rounded-full cursor-help relative group"
    >
      <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-[10px] uppercase font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-800 z-50">
        Verificado
      </span>
    </span>
  );
};
