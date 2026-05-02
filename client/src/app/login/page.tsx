'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'فشل تسجيل الدخول');
        setLoading(false);
        return;
      }
      const from = searchParams.get('from') || '/admin';
      router.push(from);
    } catch {
      setError('خطأ في الاتصال بالخادم');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* ════ PRESTIGE BACKGROUND GLOWS ════ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[400px] space-y-10 relative z-10"
      >
        {/* Prestige Title */}
        <div className="text-center space-y-3">
           <motion.h1 
             initial={{ y: 20 }}
             animate={{ y: 0 }}
             className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight"
           >
              العروي <span className="text-primary/80">للديكورات</span>
           </motion.h1>
           <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/40"></span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Admin Portal</span>
              <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/40"></span>
           </div>
        </div>

        {/* Glassmorphism Form */}
        <div className="bg-white/[0.02] backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative group">
           {/* Subtle corner highlight */}
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
           
           <form onSubmit={handleLogin} className="space-y-8 relative z-10">
              <div className="space-y-4">
                 <div className="relative">
                    <input 
                       type="text" 
                       required
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                       autoComplete="username"
                       placeholder="اسم المستخدم" 
                       className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all text-white font-body text-center text-sm placeholder:text-white/20" 
                    />
                 </div>
                 <div className="relative">
                    <input 
                       type="password" 
                       required
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                       autoComplete="current-password"
                       placeholder="كلمة المرور" 
                       className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all text-white font-body text-center text-sm placeholder:text-white/20" 
                    />
                 </div>
                 {error && (
                   <div className="text-center text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-4">{error}</div>
                 )}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-5 rounded-2xl font-bold text-base shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <span className="material-symbols-outlined text-xl transition-transform group-hover/btn:translate-x-1">login</span>
                  </>
                )}
                {/* Prestige Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>
           </form>
        </div>

        {/* Minimal Footer Info */}
        <div className="text-center">
           <p className="text-[10px] text-white/20 font-body uppercase tracking-[0.1em] cursor-default hover:text-primary transition-colors">
              تم تطويره بواسطة ياسر العروي
           </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
