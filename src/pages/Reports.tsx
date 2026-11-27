import { useState } from 'react';
import { BarChart3, Download, FileText, Filter, Calendar, Building2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const reportTypes = [
  { id: 'dept', label: 'اسناد بر اساس واحد', icon: Building2, count: 234 },
  { id: 'year', label: 'اسناد بر اساس سال', icon: Calendar, count: 156 },
  { id: 'status', label: 'اسناد تأییدشده/ردشده', icon: FileText, count: 189 },
  { id: 'expired', label: 'اسناد منقضی', icon: TrendingUp, count: 45 },
  { id: 'activity', label: 'فعالیت کاربران', icon: BarChart3, count: 312 },
  { id: 'storage', label: 'رشد Storage', icon: TrendingUp, count: 89 },
  { id: 'duplicate', label: 'فایل‌های تکراری', icon: FileText, count: 234 },
  { id: 'large', label: 'فایل‌های بزرگ', icon: FileText, count: 67 },
  { id: 'unused', label: 'فایل‌های کم‌استفاده', icon: FileText, count: 123 },
  { id: 'retention', label: 'گزارش Retention', icon: FileText, count: 78 },
  { id: 'health', label: 'سلامت Storage', icon: FileText, count: 34 },
  { id: 'sla', label: 'Workflow SLA', icon: FileText, count: 56 },
  { id: 'owner', label: 'دانش‌های بدون مالک', icon: FileText, count: 23 },
  { id: 'search', label: 'جست‌وجوهای بدون نتیجه', icon: FileText, count: 89 },
  { id: 'ocr', label: 'کیفیت OCR', icon: FileText, count: 45 },
  { id: 'ai', label: 'استفاده از AI', icon: FileText, count: 67 },
  { id: 'equipment', label: 'اسناد مرتبط با تجهیزات', icon: FileText, count: 134 },
  { id: 'composite', label: 'مستندات کامپوزیت', icon: FileText, count: 98 },
  { id: 'lessons', label: 'Lessons Learned', icon: FileText, count: 45 },
  { id: 'meetings', label: 'جلسات و Action Items', icon: FileText, count: 78 },
];

const monthlyData = [
  { month: 'فروردین', docs: 120, approvals: 98, downloads: 456 },
  { month: 'اردیبهشت', docs: 145, approvals: 112, downloads: 523 },
  { month: 'خرداد', docs: 178, approvals: 145, downloads: 612 },
  { month: 'تیر', docs: 156, approvals: 134, downloads: 567 },
  { month: 'مرداد', docs: 198, approvals: 167, downloads: 689 },
  { month: 'شهریور', docs: 210, approvals: 189, downloads: 734 },
  { month: 'مهر', docs: 234, approvals: 198, downloads: 812 },
];

const deptData = [
  { name: 'تولید', docs: 342 },
  { name: 'مهندسی', docs: 287 },
  { name: 'نگهداری', docs: 198 },
  { name: 'کیفیت', docs: 156 },
  { name: 'کامپوزیت', docs: 134 },
  { name: 'HSE', docs: 89 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('dept');

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">گزارشات</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Report Builder حرفه‌ای با خروجی Excel/PDF/CSV</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300">
            <Download size={14} /> خروجی Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
            <Download size={14} /> خروجی PDF
          </button>
        </div>
      </div>

      {/* Report Selector */}
      <div className="card p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter size={16} className="text-slate-500" />
          <h3 className="font-medium text-sm text-slate-700 dark:text-slate-300">انتخاب گزارش</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {reportTypes.slice(0, 10).map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r.id)}
              className={`p-3 rounded-xl text-xs text-right transition-colors ${
                selectedReport === r.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <p className="font-medium">{r.label}</p>
              <p className="text-[10px] text-slate-400 mt-1">{r.count} رکورد</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">از تاریخ</label>
          <input type="text" defaultValue="۱۴۰۳/۰۱/۰۱" className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 w-28" />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">تا تاریخ</label>
          <input type="text" defaultValue="۱۴۰۳/۰۷/۱۵" className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 w-28" />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">واحد</label>
          <select className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            <option>همه واحدها</option>
            <option>تولید</option>
            <option>مهندسی</option>
            <option>نگهداری</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 block mb-1">Group By</label>
          <select className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            <option>ماه</option>
            <option>واحد</option>
            <option>نوع سند</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium mt-4">اعمال فیلتر</button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-4">روند ماهانه اسناد</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="docs" stroke="#3b82f6" strokeWidth={2} name="اسناد جدید" />
              <Line type="monotone" dataKey="approvals" stroke="#22c55e" strokeWidth={2} name="تأییدشده" />
              <Line type="monotone" dataKey="downloads" stroke="#f59e0b" strokeWidth={2} name="دانلود" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-4">اسناد بر اساس واحد</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="docs" radius={[4, 4, 0, 0]}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-sm text-slate-800 dark:text-white">نتایج گزارش: اسناد بر اساس واحد</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>واحد سازمانی</th>
              <th>تعداد اسناد</th>
              <th>تأییدشده</th>
              <th>در انتظار</th>
              <th>حجم کل</th>
              <th>رشد ماهانه</th>
            </tr>
          </thead>
          <tbody>
            {deptData.map((d, i) => (
              <tr key={i}>
                <td className="font-medium text-slate-700 dark:text-slate-300">{d.name}</td>
                <td className="num">{d.docs}</td>
                <td className="num text-green-600">{Math.round(d.docs * 0.82)}</td>
                <td className="num text-amber-600">{Math.round(d.docs * 0.08)}</td>
                <td className="num">{Math.round(d.docs * 0.45)} GB</td>
                <td className="num text-blue-600">+{Math.round(d.docs * 0.05)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
