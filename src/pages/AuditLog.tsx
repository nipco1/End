import { useState } from 'react';
import { Shield, Search, Filter, Download, Eye, User, Clock, Globe, Monitor } from 'lucide-react';

const auditLogs = [
  { id: 1, time: '۱۴:۲۳:۴۵', user: 'مهندس احمدی', role: 'مدیر دانش', action: 'Upload', entity: 'دستورالعمل تعمیر پرس ۱۵۰۰', ip: '192.168.1.45', device: 'Desktop', status: 'success' },
  { id: 2, time: '۱۴:۲۰:۱۲', user: 'خانم رضایی', role: 'کارشناس کیفیت', action: 'Download', entity: 'استاندارد تست کششی', ip: '192.168.1.67', device: 'Desktop', status: 'success' },
  { id: 3, time: '۱۴:۱۸:۳۳', user: 'آقای محمدی', role: 'اپراتور تولید', action: 'Login', entity: '-', ip: '192.168.1.23', device: 'Mobile', status: 'success' },
  { id: 4, time: '۱۴:۱۵:۰۱', user: 'نامشخص', role: '-', action: 'Failed Login', entity: '-', ip: '10.0.0.99', device: 'Unknown', status: 'failed' },
  { id: 5, time: '۱۴:۱۲:۴۵', user: 'مهندس کریمی', role: 'مدیر مهندسی', action: 'Approve', entity: 'گزارش RCA ربات ABB-3', ip: '192.168.1.12', device: 'Desktop', status: 'success' },
  { id: 6, time: '۱۴:۱۰:۲۲', user: 'سیستم', role: 'System', action: 'OCR Complete', entity: 'نقشه فنی قالب پرس', ip: '127.0.0.1', device: 'Server', status: 'success' },
  { id: 7, time: '۱۴:۰۸:۱۵', user: 'خانم حسینی', role: 'کارشناس HSE', action: 'View', entity: 'دستورالعمل ایمنی لیفتراک', ip: '192.168.1.78', device: 'Tablet', status: 'success' },
  { id: 8, time: '۱۴:۰۵:۳۰', user: 'مهندس احمدی', role: 'مدیر دانش', action: 'Permission Change', entity: 'پوشه کامپوزیت', ip: '192.168.1.45', device: 'Desktop', status: 'success' },
  { id: 9, time: '۱۴:۰۲:۱۸', user: 'سیستم', role: 'System', action: 'Storage Alert', entity: 'مصرف به ۶۷٪ رسید', ip: '127.0.0.1', device: 'Server', status: 'warning' },
  { id: 10, time: '۱۳:۵۸:۴۵', user: 'آقای نوری', role: 'کارشناس نگهداری', action: 'Version Create', entity: 'چک‌لیست بازرسی کمپرسور', ip: '192.168.1.34', device: 'Desktop', status: 'success' },
];

const actionTypes: Record<string, string> = {
  'Upload': 'badge-info',
  'Download': 'badge-success',
  'Login': 'badge-neutral',
  'Failed Login': 'badge-danger',
  'Approve': 'badge-success',
  'OCR Complete': 'badge-info',
  'View': 'badge-neutral',
  'Permission Change': 'badge-warning',
  'Storage Alert': 'badge-warning',
  'Version Create': 'badge-info',
};

export default function AuditLog() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">گزارش حسابرسی (Audit Log)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">ثبت تمام عملیات مهم سامانه — غیرقابل حذف</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300">
            <Download size={14} /> خروجی
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-slate-800 dark:text-white num">۱,۲۳۴</p>
          <p className="text-[10px] text-slate-500">رویداد امروز</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-red-600 num">۵</p>
          <p className="text-[10px] text-slate-500">لاگین ناموفق</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-amber-600 num">۱۲</p>
          <p className="text-[10px] text-slate-500">هشدار امنیتی</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-green-600 num">۸۷</p>
          <p className="text-[10px] text-slate-500">کاربر فعال</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="جست‌وجو در Audit Log..." className="w-full pr-9 pl-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          <option>همه عملیات</option>
          <option>Login</option>
          <option>Upload</option>
          <option>Download</option>
          <option>Approve</option>
          <option>Delete</option>
        </select>
        <select className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          <option>همه کاربران</option>
          <option>مهندس احمدی</option>
          <option>خانم رضایی</option>
          <option>سیستم</option>
        </select>
        <input type="text" defaultValue="۱۴۰۳/۰۷/۱۵" className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-28" />
      </div>

      {/* Audit Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>زمان</th>
              <th>کاربر</th>
              <th>نقش</th>
              <th>عملیات</th>
              <th>موضوع</th>
              <th>IP</th>
              <th>دستگاه</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id}>
                <td className="text-xs text-slate-500 num whitespace-nowrap">{log.time}</td>
                <td className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <User size={10} className="text-slate-400" />
                  </div>
                  {log.user}
                </td>
                <td className="text-xs text-slate-500">{log.role}</td>
                <td><span className={`badge ${actionTypes[log.action] || 'badge-neutral'}`}>{log.action}</span></td>
                <td className="text-xs text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{log.entity}</td>
                <td className="text-xs text-slate-500 num">{log.ip}</td>
                <td className="text-xs text-slate-500">{log.device}</td>
                <td>
                  {log.status === 'success' && <span className="text-green-600">✓</span>}
                  {log.status === 'failed' && <span className="text-red-600">✗</span>}
                  {log.status === 'warning' && <span className="text-amber-600">⚠</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">نمایش ۱ تا ۱۰ از ۱,۲۳۴ رویداد</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, '...', 124].map((p, i) => (
            <button key={i} className={`w-8 h-8 rounded-lg text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
