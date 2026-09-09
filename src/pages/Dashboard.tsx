import { FileText, HardDrive, Brain, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowUp, ArrowDown, Eye, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

const docByDept = [
  { name: 'تولید', count: 342, fill: '#3b82f6' },
  { name: 'مهندسی', count: 287, fill: '#22c55e' },
  { name: 'نگهداری', count: 198, fill: '#f59e0b' },
  { name: 'کیفیت', count: 156, fill: '#ef4444' },
  { name: 'کامپوزیت', count: 134, fill: '#8b5cf6' },
  { name: 'HSE', count: 89, fill: '#06b6d4' },
];

const storageGrowth = [
  { month: 'فروردین', used: 42 },
  { month: 'اردیبهشت', used: 45 },
  { month: 'خرداد', used: 49 },
  { month: 'تیر', used: 53 },
  { month: 'مرداد', used: 58 },
  { month: 'شهریور', used: 62 },
  { month: 'مهر', used: 67 },
];

const weeklyActivity = [
  { day: 'شنبه', uploads: 12, downloads: 45, searches: 89 },
  { day: 'یکشنبه', uploads: 18, downloads: 52, searches: 102 },
  { day: 'دوشنبه', uploads: 25, downloads: 67, searches: 134 },
  { day: 'سه‌شنبه', uploads: 15, downloads: 48, searches: 95 },
  { day: 'چهارشنبه', uploads: 22, downloads: 71, searches: 118 },
  { day: 'پنج‌شنبه', uploads: 8, downloads: 34, searches: 67 },
];

const formatPieData = [
  { name: 'PDF', value: 35 },
  { name: 'Office', value: 25 },
  { name: 'تصویر', value: 18 },
  { name: 'ویدئو', value: 10 },
  { name: 'سایر', value: 12 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const recentDocs = [
  { id: 1, title: 'دستورالعمل تعمیر پرس هیدرولیک ۱۵۰۰ تن', dept: 'نگهداری', status: 'تأییدشده', date: '۱۴۰۳/۰۷/۱۵', views: 45 },
  { id: 2, title: 'گزارش RCA خرابی ربات ABB-3', dept: 'مهندسی', status: 'در انتظار', date: '۱۴۰۳/۰۷/۱۴', views: 23 },
  { id: 3, title: 'استاندارد تست کششی کامپوزیت', dept: 'کامپوزیت', status: 'تأییدشده', date: '۱۴۰۳/۰۷/۱۳', views: 67 },
  { id: 4, title: 'صورتجلسه کمیته فنی مرداد', dept: 'مدیریت', status: 'پیش‌نویس', date: '۱۴۰۳/۰۷/۱۲', views: 12 },
  { id: 5, title: 'چک‌لیست بازرسی کمپرسور اسکرو', dept: 'تولید', status: 'منتشرشده', date: '۱۴۰۳/۰۷/۱۱', views: 89 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">داشبورد مدیریت دانش</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">نمای کلی سامانه مدیریت دانش و آرشیو نیپکو</p>
        </div>
        <div className="flex gap-2">
          <select className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <option>سال ۱۴۰۳</option>
            <option>سال ۱۴۰۲</option>
            <option>سال ۱۴۰۱</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={FileText} title="کل اسناد" value="۲,۸۴۷" change="+۱۲٪" up color="blue" />
        <KPICard icon={HardDrive} title="مصرف ذخیره‌سازی" value="۶۷۰ GB" change="+۵٪" up color="green" />
        <KPICard icon={Brain} title="پردازش AI" value="۱,۲۳۴" change="+۲۸٪" up color="purple" />
        <KPICard icon={AlertTriangle} title="در انتظار تأیید" value="۲۳" change="-۸٪" up={false} color="amber" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Storage Growth */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-800 dark:text-white text-sm">رشد مصرف ذخیره‌سازی (GB)</h3>
            <span className="badge badge-info">۷ ماه اخیر</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={storageGrowth}>
              <defs>
                <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="used" stroke="#3b82f6" fill="url(#colorUsed)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* File Format Distribution */}
        <div className="card p-5">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">توزیع فرمت فایل‌ها</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={formatPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}٪`} labelLine={false}>
                {formatPieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Documents by Department */}
        <div className="card p-5">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">اسناد بر اساس واحد سازمانی</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={docByDept} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {docByDept.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="card p-5">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">فعالیت هفتگی</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="آپلود" />
              <Line type="monotone" dataKey="downloads" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="دانلود" />
              <Line type="monotone" dataKey="searches" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="جست‌وجو" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Documents & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Documents */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-800 dark:text-white text-sm">آخرین اسناد</h3>
            <a href="#/documents" className="text-xs text-blue-600 hover:text-blue-700">مشاهده همه ←</a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>عنوان سند</th>
                  <th>واحد</th>
                  <th>وضعیت</th>
                  <th>تاریخ</th>
                  <th>بازدید</th>
                </tr>
              </thead>
              <tbody>
                {recentDocs.map(doc => (
                  <tr key={doc.id}>
                    <td className="font-medium text-slate-700 dark:text-slate-300">{doc.title}</td>
                    <td className="text-slate-500">{doc.dept}</td>
                    <td><span className={`badge ${doc.status === 'تأییدشده' ? 'badge-success' : doc.status === 'در انتظار' ? 'badge-warning' : doc.status === 'پیش‌نویس' ? 'badge-neutral' : 'badge-info'}`}>{doc.status}</span></td>
                    <td className="text-slate-500 num">{doc.date}</td>
                    <td className="text-slate-500 num flex items-center gap-1"><Eye size={12} /> {doc.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-5">
          <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-4">آمار سریع</h3>
          <div className="space-y-3">
            <StatItem icon={CheckCircle} label="اسناد تأییدشده" value="۲,۱۵۶" color="text-green-600" />
            <StatItem icon={Clock} label="در انتظار بررسی" value="۲۳" color="text-amber-600" />
            <StatItem icon={Users} label="کاربران فعال" value="۸۷" color="text-blue-600" />
            <StatItem icon={TrendingUp} label="رشد ماهانه" value="۱۲٪" color="text-purple-600" />
            <StatItem icon={Download} label="دانلود امروز" value="۳۴۵" color="text-cyan-600" />
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">فایل‌های تکراری شناسایی‌شده</span>
                <span className="font-medium text-red-600">۱۲.۳ GB</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-slate-500">پیش‌بینی پرشدن Storage</span>
                <span className="font-medium text-amber-600">۴ ماه دیگر</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-slate-500">صف OCR</span>
                <span className="font-medium text-blue-600">۱۵ فایل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, title, value, change, up, color }: { icon: any; title: string; value: string; change: string; up: boolean; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-lg font-bold text-slate-800 dark:text-white num">{value}</p>
        <div className={`flex items-center gap-1 text-xs ${up ? 'text-green-600' : 'text-red-600'}`}>
          {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          <span>{change}</span>
          <span className="text-slate-400">نسبت به ماه قبل</span>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={14} className={color} />
        <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-800 dark:text-white num">{value}</span>
    </div>
  );
}
