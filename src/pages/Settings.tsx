import { useState } from 'react';
import { Settings as SettingsIcon, Users, Shield, HardDrive, Brain, Search, Bell, Globe, Palette, Database, FileText, Workflow, Archive } from 'lucide-react';

const settingsSections = [
  { id: 'general', label: 'عمومی', icon: SettingsIcon },
  { id: 'branding', label: 'برندینگ', icon: Palette },
  { id: 'users', label: 'کاربران و نقش‌ها', icon: Users },
  { id: 'security', label: 'امنیت', icon: Shield },
  { id: 'storage', label: 'ذخیره‌سازی', icon: HardDrive },
  { id: 'ai', label: 'هوش مصنوعی', icon: Brain },
  { id: 'search', label: 'جست‌وجو', icon: Search },
  { id: 'notification', label: 'اعلان‌ها', icon: Bell },
  { id: 'language', label: 'زبان و تقویم', icon: Globe },
  { id: 'database', label: 'پایگاه داده', icon: Database },
  { id: 'documents', label: 'انواع سند', icon: FileText },
  { id: 'workflow', label: 'گردش کار', icon: Workflow },
  { id: 'archive', label: 'آرشیو و Retention', icon: Archive },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="flex gap-4 animate-fade-in h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <div className="card w-56 p-3 overflow-y-auto">
        <h2 className="font-bold text-sm text-slate-800 dark:text-white mb-3 px-2">تنظیمات سامانه</h2>
        <nav className="space-y-1">
          {settingsSections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === s.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <s.icon size={14} />
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 card p-6 overflow-y-auto">
        {activeSection === 'general' && <GeneralSettings />}
        {activeSection === 'branding' && <BrandingSettings />}
        {activeSection === 'users' && <UsersSettings />}
        {activeSection === 'security' && <SecuritySettings />}
        {activeSection === 'storage' && <StorageSettings />}
        {activeSection === 'ai' && <AISettings />}
        {!['general', 'branding', 'users', 'security', 'storage', 'ai'].includes(activeSection) && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <SettingsIcon size={48} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-500">تنظیمات بخش «{settingsSections.find(s => s.id === activeSection)?.label}»</p>
            <p className="text-xs text-slate-400 mt-1">این بخش قابل پیکربندی از طریق پنل مدیریت است</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">تنظیمات عمومی</h2>
      <div className="space-y-4">
        <SettingRow label="نام سامانه" value="سامانه مدیریت دانش نیپکو" type="text" />
        <SettingRow label="زبان پیش‌فرض" value="فارسی" type="select" options={['فارسی', 'English']} />
        <SettingRow label="تقویم" value="شمسی" type="select" options={['شمسی', 'میلادی']} />
        <SettingRow label="منطقه زمانی" value="Asia/Tehran (UTC+3:30)" type="text" />
        <SettingRow label="حداکثر حجم آپلود (MB)" value="500" type="number" />
        <SettingRow label="Session Timeout (دقیقه)" value="30" type="number" />
        <SettingRow label="MFA اجباری" value="false" type="toggle" />
        <SettingRow label="ثبت نام کاربران" value="false" type="toggle" />
      </div>
      <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">ذخیره تنظیمات</button>
    </div>
  );
}

function BrandingSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">برندینگ</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-300 block mb-2">لوگوی سامانه</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-bold">NPC</div>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300">تغییر لوگو</button>
          </div>
        </div>
        <SettingRow label="رنگ اصلی" value="#2563eb" type="color" />
        <SettingRow label="رنگ ثانویه" value="#16a34a" type="color" />
        <SettingRow label="عنوان صفحه لاگین" value="سامانه مدیریت دانش نیپکو" type="text" />
        <SettingRow label="زیرعنوان" value="مرکز دانش سازمانی • آرشیو اسناد • هوش مصنوعی" type="text" />
        <SettingRow label="فوتر" value="شرکت دانش‌بنیان نیپکو — تمامی حقوق محفوظ است" type="text" />
      </div>
      <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">ذخیره</button>
    </div>
  );
}

function UsersSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">کاربران و نقش‌ها</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ کاربر جدید</button>
      </div>
      <div className="space-y-3">
        {[
          { name: 'مهندس احمدی', role: 'مدیر دانش', dept: 'مهندسی', status: 'فعال' },
          { name: 'خانم رضایی', role: 'کارشناس کیفیت', dept: 'کیفیت', status: 'فعال' },
          { name: 'آقای محمدی', role: 'اپراتور تولید', dept: 'تولید', status: 'فعال' },
          { name: 'مهندس کریمی', role: 'مدیر مهندسی', dept: 'مهندسی', status: 'فعال' },
          { name: 'خانم حسینی', role: 'کارشناس HSE', dept: 'HSE', status: 'غیرفعال' },
        ].map((u, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {u.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{u.name}</p>
              <p className="text-xs text-slate-500">{u.role} — {u.dept}</p>
            </div>
            <span className={`badge ${u.status === 'فعال' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-600 dark:text-slate-300">ویرایش</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">امنیت</h2>
      <div className="space-y-4">
        <SettingRow label="حداقل طول رمز عبور" value="8" type="number" />
        <SettingRow label="پیچیدگی رمز" value="حروف + عدد + نماد" type="select" options={['ساده', 'متوسط', 'حروف + عدد + نماد']} />
        <SettingRow label="قفل حساب بعد از" value="5 تلاش ناموفق" type="number" />
        <SettingRow label="مدت قفل (دقیقه)" value="15" type="number" />
        <SettingRow label="MFA" value="optional" type="select" options={['غیرفعال', 'اختیاری', 'اجباری']} />
        <SettingRow label="Rate Limit (در دقیقه)" value="60" type="number" />
        <SettingRow label="Captcha" value="بعد از ۳ تلاش" type="select" options={['غیرفعال', 'همیشه', 'بعد از ۳ تلاش']} />
        <SettingRow label="HTTPS اجباری" value="true" type="toggle" />
        <SettingRow label="Encryption at Rest" value="true" type="toggle" />
      </div>
      <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">ذخیره</button>
    </div>
  );
}

function StorageSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">ذخیره‌سازی</h2>
      <div className="space-y-4">
        <SettingRow label="نوع Storage" value="Local + S3-Compatible" type="select" options={['Local', 'NAS', 'S3-Compatible', 'ترکیبی']} />
        <SettingRow label="حداکثر ظرفیت (GB)" value="1000" type="number" />
        <SettingRow label="آستانه هشدار ۱ (٪)" value="70" type="number" />
        <SettingRow label="آستانه هشدار ۲ (٪)" value="80" type="number" />
        <SettingRow label="آستانه بحرانی (٪)" value="95" type="number" />
        <SettingRow label="Deduplication" value="true" type="toggle" />
        <SettingRow label="Compression Policy" value="Lossless برای متن" type="select" options={['غیرفعال', 'Lossless', 'Lossy مجاز', 'هوشمند']} />
        <SettingRow label="Chunk Upload (MB)" value="5" type="number" />
        <SettingRow label="Quarantine Duration (ثانیه)" value="30" type="number" />
        <SettingRow label="Malware Scan" value="true" type="toggle" />
      </div>
      <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">ذخیره</button>
    </div>
  );
}

function AISettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-white">هوش مصنوعی</h2>
      <div className="space-y-4">
        <SettingRow label="Provider پیش‌فرض" value="On-Premise" type="select" options={['On-Premise', 'Cloud', 'Hybrid']} />
        <SettingRow label="مدل فعال" value="Local LLM (Ollama)" type="text" />
        <SettingRow label="اجازه ارسال به Cloud" value="false" type="toggle" />
        <SettingRow label="سطح محرمانگی مجاز برای AI" value="داخلی" type="select" options={['عمومی', 'داخلی', 'محرمانه']} />
        <SettingRow label="RAG Enabled" value="true" type="toggle" />
        <SettingRow label="حداکثر Token" value="4096" type="number" />
        <SettingRow label="Temperature" value="0.3" type="number" />
        <SettingRow label="Citation اجباری" value="true" type="toggle" />
        <SettingRow label="Human-in-the-Loop" value="true" type="toggle" />
      </div>
      <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">ذخیره</button>
    </div>
  );
}

function SettingRow({ label, value, type, options }: { label: string; value: string; type: string; options?: string[] }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
      </div>
      <div className="w-64">
        {type === 'text' && <input type="text" defaultValue={value} className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" />}
        {type === 'number' && <input type="number" defaultValue={value} className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" />}
        {type === 'select' && <select defaultValue={value} className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">{options?.map((o, i) => <option key={i}>{o}</option>)}</select>}
        {type === 'toggle' && (
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={value === 'true'} className="sr-only peer" />
            <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:-translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        )}
        {type === 'color' && <input type="color" defaultValue={value} className="w-10 h-8 rounded cursor-pointer" />}
      </div>
    </div>
  );
}
