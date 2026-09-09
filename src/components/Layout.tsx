import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import {
  LayoutDashboard, FileText, GitBranch, HardDrive, Search,
  Brain, BarChart3, Archive, Shield, Settings, GitMerge,
  Users, Moon, Sun, Menu, LogOut, Bell, ChevronDown, User
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'داشبورد', labelEn: 'Dashboard' },
  { path: '/documents', icon: FileText, label: 'اسناد و مدارک', labelEn: 'Documents' },
  { path: '/knowledge-tree', icon: GitBranch, label: 'درخت دانش', labelEn: 'Knowledge Tree' },
  { path: '/storage', icon: HardDrive, label: 'مرکز ذخیره‌سازی', labelEn: 'Storage' },
  { path: '/search', icon: Search, label: 'جست‌وجو', labelEn: 'Search' },
  { path: '/ai', icon: Brain, label: 'دستیار هوشمند', labelEn: 'AI Assistant' },
  { path: '/workflows', icon: GitMerge, label: 'گردش کار', labelEn: 'Workflows' },
  { path: '/meetings', icon: Users, label: 'جلسات', labelEn: 'Meetings' },
  { path: '/reports', icon: BarChart3, label: 'گزارشات', labelEn: 'Reports' },
  { path: '/archive', icon: Archive, label: 'آرشیو سالانه', labelEn: 'Archive' },
  { path: '/audit', icon: Shield, label: 'گزارش حسابرسی', labelEn: 'Audit Log' },
  { path: '/settings', icon: Settings, label: 'تنظیمات', labelEn: 'Settings' },
];

export default function Layout() {
  const { user, setUser, darkMode, toggleDark, sidebarCollapsed, toggleSidebar, language } = useApp();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            NPC
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-sm text-slate-800 dark:text-white">نیپکو</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">مدیریت دانش سازمانی</p>
            </div>
          )}
        </div>

        <nav className="p-2 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                } ${sidebarCollapsed ? 'justify-center' : ''}`
              }
            >
              <item.icon size={18} />
              {!sidebarCollapsed && <span>{language === 'fa' ? item.label : item.labelEn}</span>}
            </NavLink>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-3 mx-2 mt-4 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">وضعیت ذخیره‌سازی</span>
            </div>
            <div className="progress-bar mb-1">
              <div className="progress-bar-fill bg-gradient-to-l from-blue-500 to-blue-600" style={{ width: '67%' }} />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">۶۷٪ مصرف شده — ۳۳٪ آزاد</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`main-content flex-1 ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Header */}
        <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Menu size={18} />
            </button>
            <div className="hidden md:flex relative">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="جست‌وجوی سریع..."
                className="search-input w-64 lg:w-80 text-sm"
                onClick={() => navigate('/search')}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 relative">
                <Bell size={18} />
                <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {showNotif && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-fade-in">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-medium text-sm text-slate-800 dark:text-white">اعلان‌ها</h3>
                  </div>
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {[
                      { text: '۳ سند در انتظار تأیید شما', time: '۵ دقیقه پیش', type: 'warning' },
                      { text: 'فضای ذخیره‌سازی به ۶۷٪ رسید', time: '۱ ساعت پیش', type: 'info' },
                      { text: 'OCR سند پرس هیدرولیک ۱۵۰۰ تکمیل شد', time: '۲ ساعت پیش', type: 'success' },
                      { text: 'آرشیو سال ۱۴۰۲ آماده بررسی', time: 'دیروز', type: 'info' },
                    ].map((n, i) => (
                      <div key={i} className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                        <p className="text-xs text-slate-700 dark:text-slate-300">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="hidden md:block text-sm text-slate-700 dark:text-slate-300">{user?.fullName}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {showUserMenu && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-fade-in">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{user?.fullName}</p>
                    <p className="text-xs text-slate-500">{user?.role} — {user?.department}</p>
                  </div>
                  <div className="p-1">
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                      <User size={14} /> پروفایل
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <LogOut size={14} /> خروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
