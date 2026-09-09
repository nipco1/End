import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

export default function Login() {
  const store = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (username && password) {
        const success = store.login(username, password);
        if (success) {
          navigate('/');
        } else {
          setError('نام کاربری یا رمز عبور اشتباه است');
        }
      } else {
        setError('نام کاربری و رمز عبور الزامی است');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-2xl mb-4">
            <span className="text-white font-bold text-2xl">NPC</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">سامانه مدیریت دانش نیپکو</h1>
          <p className="text-blue-200 text-sm">مرکز دانش سازمانی • آرشیو اسناد • هوش مصنوعی</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">ورود به سامانه</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">نام کاربری</label>
              <div className="relative">
                <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="نام کاربری خود را وارد کنید"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">رمز عبور</label>
              <div className="relative">
                <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="رمز عبور"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="rounded border-slate-300" />
                مرا به خاطر بسپار
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">فراموشی رمز</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  در حال ورود...
                </span>
              ) : 'ورود به سامانه'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-[10px] text-center text-slate-400">
              نسخه ۱.۰.۰ • شرکت دانش‌بنیان نیپکو • تمامی حقوق محفوظ است
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-4 text-center">
          <button
            onClick={() => { setUsername('admin'); setPassword('admin'); }}
            className="text-xs text-blue-300 hover:text-blue-200 transition-colors"
          >
            ورود سریع (نسخه نمایشی)
          </button>
        </div>
      </div>
    </div>
  );
}
