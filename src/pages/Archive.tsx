import { Archive as ArchiveIcon, Calendar, Lock, Unlock, Search, RefreshCw, CheckCircle, AlertTriangle, Clock, HardDrive } from 'lucide-react';

const years = [
  { year: '۱۴۰۳', status: 'Active', docs: 1234, size: '234 GB', backup: 'تأیید', integrity: '۱۰۰٪' },
  { year: '۱۴۰۲', status: 'Closed', docs: 2567, size: '456 GB', backup: 'تأیید', integrity: '۹۹.۸٪' },
  { year: '۱۴۰۱', status: 'Archived', docs: 2134, size: '389 GB', backup: 'تأیید', integrity: '۹۹.۵٪' },
  { year: '۱۴۰۰', status: 'Archived', docs: 1876, size: '312 GB', backup: 'تأیید', integrity: '۹۹.۲٪' },
  { year: '۱۳۹۹', status: 'Archived', docs: 1543, size: '267 GB', backup: 'تأیید', integrity: '۹۸.۹٪' },
];

const statusConfig: Record<string, { badge: string; icon: any; color: string }> = {
  'Active': { badge: 'badge-success', icon: CheckCircle, color: 'text-green-600' },
  'Closed': { badge: 'badge-warning', icon: Clock, color: 'text-amber-600' },
  'Archived': { badge: 'badge-info', icon: ArchiveIcon, color: 'text-blue-600' },
  'Locked': { badge: 'badge-danger', icon: Lock, color: 'text-red-600' },
};

const archiveChecklist = [
  { item: 'بررسی Workflowهای باز', status: 'pass', detail: '۰ مورد باز' },
  { item: 'تأیید Backup', status: 'pass', detail: 'آخرین Backup: ۲ ساعت پیش' },
  { item: 'بررسی یکپارچگی فایل‌ها', status: 'pass', detail: '۹۹.۸٪ سالم' },
  { item: 'گزارش Duplicate', status: 'warning', detail: '۲۳ فایل تکراری' },
  { item: 'بررسی Retention', status: 'pass', detail: 'همه مطابق Policy' },
  { item: 'گزارش Storage', status: 'pass', detail: '۴۵۶ GB — Cold Tier' },
];

export default function Archive() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">آرشیو سالانه</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">مدیریت سال‌های شمسی، آرشیو و بازیابی</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300">
            <RefreshCw size={14} /> بررسی یکپارچگی
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            <Calendar size={14} /> ایجاد سال جدید
          </button>
        </div>
      </div>

      {/* Years Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {years.map(y => {
          const config = statusConfig[y.status];
          return (
            <div key={y.year} className="card p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-slate-800 dark:text-white">{y.year}</span>
                <span className={`badge ${config.badge}`}>{y.status}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">تعداد اسناد</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 num">{y.docs}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">حجم</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 num">{y.size}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Backup</span>
                  <span className="font-medium text-green-600">{y.backup}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">یکپارچگی</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 num">{y.integrity}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-1">
                <button className="flex-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">
                  مشاهده
                </button>
                <button className="flex-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-[10px] text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                  Restore
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Archive Process */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Archive Checklist */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-green-600" />
            <h3 className="font-medium text-slate-800 dark:text-white text-sm">چک‌لیست قبل از آرشیو (سال ۱۴۰۲)</h3>
          </div>
          <div className="space-y-3">
            {archiveChecklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                {item.status === 'pass' ? (
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{item.item}</p>
                  <p className="text-[10px] text-slate-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
            تأیید و آرشیو سال ۱۴۰۲
          </button>
        </div>

        {/* Archive Summary */}
        <div className="card p-5">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">خلاصه آرشیو سال ۱۴۰۲</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-600 num">۲,۵۶۷</p>
              <p className="text-[10px] text-blue-500">کل اسناد</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-600 num">۲,۱۳۴</p>
              <p className="text-[10px] text-green-500">تأییدشده</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-amber-600 num">۲۳</p>
              <p className="text-[10px] text-amber-500">در انتظار</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-purple-600 num">۴۵۶ GB</p>
              <p className="text-[10px] text-purple-500">حجم کل</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300">دسته‌بندی‌های برتر:</h4>
            {[
              { name: 'دستورالعمل‌ها', count: 345 },
              { name: 'گزارشات', count: 567 },
              { name: 'نقشه‌ها', count: 234 },
              { name: 'استانداردها', count: 123 },
              { name: 'صورتجلسات', count: 89 },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">{c.name}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 num">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storage Tier Info */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive size={18} className="text-blue-600" />
          <h3 className="font-medium text-slate-800 dark:text-white text-sm">وضعیت Tiered Storage</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-600 font-medium mb-1">Hot (سال ۱۴۰۳)</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300 num">۲۳۴ GB</p>
            <p className="text-[10px] text-blue-500 mt-1">دسترسی سریع • SSD</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <p className="text-xs text-amber-600 font-medium mb-1">Warm (سال ۱۴۰۲)</p>
            <p className="text-lg font-bold text-amber-700 dark:text-amber-300 num">۴۵۶ GB</p>
            <p className="text-[10px] text-amber-500 mt-1">دسترسی متوسط • HDD</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Cold (۱۴۰۱ و قبل)</p>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-300 num">۹۶۸ GB</p>
            <p className="text-[10px] text-slate-500 mt-1">آرشیو • Tape/Object Storage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
