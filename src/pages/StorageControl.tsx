import { HardDrive, AlertTriangle, CheckCircle, Zap, Archive, Trash2, RefreshCw, Shield, TrendingUp, Database, Server, Cloud } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const storageByType = [
  { name: 'PDF', size: 180, color: '#3b82f6' },
  { name: 'Office', size: 95, color: '#22c55e' },
  { name: 'تصویر', size: 120, color: '#f59e0b' },
  { name: 'ویدئو', size: 145, color: '#ef4444' },
  { name: 'CAD', size: 67, color: '#8b5cf6' },
  { name: 'سایر', size: 63, color: '#6b7280' },
];

const storageByDept = [
  { name: 'تولید', used: 156 },
  { name: 'مهندسی', used: 134 },
  { name: 'نگهداری', used: 89 },
  { name: 'کامپوزیت', used: 78 },
  { name: 'کیفیت', used: 67 },
  { name: 'HSE', used: 45 },
  { name: 'مدیریت', used: 34 },
  { name: 'سایر', used: 67 },
];

const optimizationSuggestions = [
  { id: 1, type: 'duplicate', title: 'فایل‌های تکراری قابل ادغام', count: 234, savings: '12.3 GB', risk: 'کم', icon: '🔄' },
  { id: 2, type: 'preview', title: 'Previewهای قابل بازسازی', count: 1567, savings: '8.7 GB', risk: 'بدون ریسک', icon: '🖼️' },
  { id: 3, type: 'cold', title: 'فایل‌های Cold Archive (بیش از ۱ سال بدون دسترسی)', count: 890, savings: '45.2 GB', risk: 'کم', icon: '❄️' },
  { id: 4, type: 'compress', title: 'فشرده‌سازی Lossless (متن/Office)', count: 456, savings: '5.6 GB', risk: 'بدون ریسک', icon: '📦' },
  { id: 5, type: 'old-version', title: 'نسخه‌های قدیمی با Policy مجاز', count: 123, savings: '3.4 GB', risk: 'متوسط', icon: '📋' },
];

const topFiles = [
  { name: 'ویدئو آموزش پرس ۲۰۰۰ تن', size: '2.3 GB', type: 'ویدئو', lastAccess: '۶ ماه پیش' },
  { name: 'نقشه‌های CAD خط تولید', size: '1.8 GB', type: 'CAD', lastAccess: '۲ ماه پیش' },
  { name: 'آرشیو تصاویر پروژه ۱۴۰۰', size: '1.2 GB', type: 'تصویر', lastAccess: '۱ سال پیش' },
  { name: 'گزارشات PDF سال ۱۴۰۱', size: '890 MB', type: 'PDF', lastAccess: '۸ ماه پیش' },
  { name: 'فایل‌های بکاپ دیتابیس', size: '750 MB', type: 'Backup', lastAccess: '۱ ماه پیش' },
];

const healthMetrics = [
  { label: 'وضعیت Storage', status: 'healthy', icon: CheckCircle, color: 'text-green-600' },
  { label: 'یکپارچگی فایل‌ها', status: '۹۹.۸٪', icon: Shield, color: 'text-green-600' },
  { label: 'آخرین Integrity Check', status: '۲ ساعت پیش', icon: Database, color: 'text-blue-600' },
  { label: 'پیش‌بینی پرشدن', status: '۴ ماه دیگر', icon: TrendingUp, color: 'text-amber-600' },
  { label: 'Jobهای شکست‌خورده', status: '۳ عدد', icon: AlertTriangle, color: 'text-red-600' },
  { label: 'فایل‌های Orphan', status: '۰ عدد', icon: Trash2, color: 'text-green-600' },
];

export default function StorageControl() {
  const totalCapacity = 1000;
  const usedCapacity = 670;
  const usedPercent = (usedCapacity / totalCapacity) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">مرکز کنترل ذخیره‌سازی</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">مدیریت فضا، بهینه‌سازی و پایش سلامت Storage</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <RefreshCw size={14} /> اسکن مجدد
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <Zap size={14} /> بهینه‌سازی هوشمند
          </button>
        </div>
      </div>

      {/* Capacity Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-slate-800 dark:text-white">ظرفیت کل ذخیره‌سازی</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> مصرف‌شده</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200" /> آزاد</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> هشدار ۸۰٪</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> بحرانی ۹۵٪</span>
          </div>
        </div>
        <div className="relative h-8 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-blue-500 to-blue-600 rounded-full transition-all" style={{ width: `${usedPercent}%` }} />
          <div className="absolute inset-y-0 right-0 bg-amber-500/30 border-r-2 border-amber-500" style={{ width: '80%' }} />
          <div className="absolute inset-y-0 right-0 bg-red-500/30 border-r-2 border-red-500" style={{ width: '95%' }} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-slate-500">مصرف فعلی</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white num">{usedCapacity} GB</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">فضای آزاد</p>
              <p className="text-lg font-bold text-green-600 num">{totalCapacity - usedCapacity} GB</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">رشد ماهانه</p>
              <p className="text-lg font-bold text-amber-600 num">+۵.۲ GB</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">فایل‌های تکراری</p>
              <p className="text-lg font-bold text-red-600 num">۱۲.۳ GB</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-500">پیش‌بینی پرشدن</p>
            <p className="text-lg font-bold text-amber-600">حدود ۴ ماه دیگر</p>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {healthMetrics.map((m, i) => (
          <div key={i} className="card p-3 text-center">
            <m.icon size={20} className={`mx-auto mb-2 ${m.color}`} />
            <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{m.status}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">مصرف بر اساس نوع فایل (GB)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={storageByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="size" radius={[4, 4, 0, 0]}>
                {storageByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">مصرف بر اساس واحد (GB)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={storageByDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Bar dataKey="used" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm">پیشنهادات بهینه‌سازی</h3>
          <span className="badge badge-info">مجموع قابل آزادسازی: ۷۵.۲ GB</span>
        </div>
        <div className="space-y-3">
          {optimizationSuggestions.map(s => (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.title}</p>
                <p className="text-xs text-slate-500">{s.count} مورد • ریسک: {s.risk}</p>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-green-600">{s.savings}</p>
                <p className="text-[10px] text-slate-400">قابل آزادسازی</p>
              </div>
              <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50">
                اجرا
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Top Files */}
      <div className="card p-5">
        <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">بزرگ‌ترین فایل‌ها</h3>
        <div className="space-y-2">
          {topFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">{f.name}</p>
                <p className="text-[10px] text-slate-400">{f.type} • آخرین دسترسی: {f.lastAccess}</p>
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 num">{f.size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 border-r-4 border-r-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Server size={16} className="text-blue-600" />
            <h4 className="font-medium text-sm text-slate-800 dark:text-white">Hot Storage</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600 num">۲۳۴ GB</p>
          <p className="text-xs text-slate-500 mt-1">فایل‌های پرتکرار • دسترسی بالا</p>
          <div className="progress-bar mt-2">
            <div className="progress-bar-fill bg-blue-500" style={{ width: '35%' }} />
          </div>
        </div>
        <div className="card p-4 border-r-4 border-r-amber-500">
          <div className="flex items-center gap-2 mb-2">
            <Database size={16} className="text-amber-600" />
            <h4 className="font-medium text-sm text-slate-800 dark:text-white">Warm Storage</h4>
          </div>
          <p className="text-2xl font-bold text-amber-600 num">۳۱۲ GB</p>
          <p className="text-xs text-slate-500 mt-1">دسترسی متوسط • اسناد فعال</p>
          <div className="progress-bar mt-2">
            <div className="progress-bar-fill bg-amber-500" style={{ width: '47%' }} />
          </div>
        </div>
        <div className="card p-4 border-r-4 border-r-slate-400">
          <div className="flex items-center gap-2 mb-2">
            <Cloud size={16} className="text-slate-500" />
            <h4 className="font-medium text-sm text-slate-800 dark:text-white">Cold Archive</h4>
          </div>
          <p className="text-2xl font-bold text-slate-600 num">۱۲۴ GB</p>
          <p className="text-xs text-slate-500 mt-1">اسناد کم‌مصرف • آرشیو بلندمدت</p>
          <div className="progress-bar mt-2">
            <div className="progress-bar-fill bg-slate-400" style={{ width: '18%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
