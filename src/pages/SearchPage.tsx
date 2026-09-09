import { useState } from 'react';
import { Search, Filter, FileText, Image, Film, Clock, Star, Tag, Calendar, Building2 } from 'lucide-react';

const searchResults = [
  { id: 1, title: 'دستورالعمل تعمیر پرس هیدرولیک ۱۵۰۰ تن', snippet: '...مراحل دمونتاژ پرس هیدرولیک شامل تخلیه روغن، بازکردن اتصالات هیدرولیک، جداسازی سیلندر...', type: 'PDF', dept: 'نگهداری', date: '۱۴۰۳/۰۷/۱۵', score: 95, tags: ['پرس', 'هیدرولیک', 'تعمیر'] },
  { id: 2, title: 'گزارش RCA خرابی پمپ هیدرولیک پرس ۱۲۰۰', snippet: '...علت ریشه‌ای خرابی: آلودگی روغن هیدرولیک ناشی از نقص فیلتر. اقدام اصلاحی: تعویض فیلتر و شستشوی سیستم...', type: 'Word', dept: 'مهندسی', date: '۱۴۰۳/۰۶/۲۰', score: 87, tags: ['RCA', 'پمپ', 'خرابی'] },
  { id: 3, title: 'استاندارد نگهداری سیستم‌های هیدرولیک', snippet: '...بازدید دوره‌ای هر ۵۰۰ ساعت کاری. تعویض روغن هر ۲۰۰۰ ساعت. بررسی شیلنگ‌ها و اتصالات...', type: 'PDF', dept: 'مهندسی', date: '۱۴۰۳/۰۵/۱۰', score: 82, tags: ['استاندارد', 'هیدرولیک', 'نگهداری'] },
  { id: 4, title: 'چک‌لیست بازرسی روزانه پرس‌ها', snippet: '...بررسی سطح روغن هیدرولیک، فشار سیستم، دمای عملیاتی، صدای غیرعادی، نشتی...', type: 'Excel', dept: 'تولید', date: '۱۴۰۳/۰۴/۰۱', score: 78, tags: ['چک‌لیست', 'بازرسی', 'پرس'] },
  { id: 5, title: 'آموزش عیب‌یابی سیستم هیدرولیک', snippet: '...ویدئوی آموزشی شامل شناسایی علائم خرابی، تست فشار، بررسی شیرهای کنترل...', type: 'ویدئو', dept: 'آموزش', date: '۱۴۰۳/۰۳/۱۵', score: 74, tags: ['آموزش', 'عیب‌یابی', 'هیدرولیک'] },
];

const recentSearches = ['پرس هیدرولیک', 'RCA ربات ABB', 'استاندارد کامپوزیت', 'چک‌لیست HSE', 'گزارش تولید'];
const savedSearches = ['اسناد منقضی واحد کیفیت', 'فایل‌های بدون مالک', 'دستورالعمل‌های پرس'];

export default function SearchPage() {
  const [query, setQuery] = useState('هیدرولیک');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search Header */}
      <div className="card p-6">
        <div className="relative max-w-3xl mx-auto">
          <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pr-12 pl-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="جست‌وجو در اسناد، متون OCR، Metadata و دانش سازمانی..."
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"
          >
            <Filter size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-fade-in">
            <FilterSelect label="واحد" options={['همه واحدها', 'تولید', 'مهندسی', 'نگهداری', 'کامپوزیت', 'HSE']} />
            <FilterSelect label="نوع سند" options={['همه انواع', 'PDF', 'Word', 'Excel', 'تصویر', 'ویدئو']} />
            <FilterSelect label="وضعیت" options={['همه', 'تأییدشده', 'در انتظار', 'پیش‌نویس', 'منقضی']} />
            <FilterSelect label="سال" options={['۱۴۰۳', '۱۴۰۲', '۱۴۰۱', '۱۴۰۰']} />
            <FilterSelect label="محرمانگی" options={['عمومی', 'داخلی', 'محرمانه']} />
            <FilterSelect label="مرتب‌سازی" options={['مرتبط‌ترین', 'جدیدترین', 'پربازدیدترین']} />
          </div>
        )}

        {/* Quick Tags */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-slate-500">جست‌وجوهای اخیر:</span>
          {recentSearches.map((s, i) => (
            <button key={i} onClick={() => setQuery(s)} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-800 dark:text-white">۵ نتیجه</span> برای «{query}» — زمان: ۰.۰۲۳ ثانیه
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg text-xs">ذخیره جست‌وجو</button>
        </div>
      </div>

      <div className="space-y-3">
        {searchResults.map(result => (
          <div key={result.id} className="card p-4 hover:border-blue-300 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                {result.type === 'PDF' ? '📄' : result.type === 'Word' ? '📝' : result.type === 'Excel' ? '📊' : '🎬'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm text-slate-800 dark:text-white">{result.title}</h3>
                  <span className="badge badge-info">{result.type}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">{result.snippet}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 text-[10px] text-slate-400"><Building2 size={10} /> {result.dept}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400"><Calendar size={10} /> {result.date}</span>
                  <div className="flex gap-1">
                    {result.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] text-slate-500">
                        <Tag size={8} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-left flex-shrink-0">
                <div className="flex items-center gap-1 text-xs">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{result.score}٪</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">ارتباط</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Searches */}
      <div className="card p-4">
        <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-3">جست‌وجوهای ذخیره‌شده</h3>
        <div className="flex gap-2 flex-wrap">
          {savedSearches.map((s, i) => (
            <button key={i} className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              <Star size={10} className="text-amber-500" /> {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] text-slate-500 mb-1 block">{label}</label>
      <select className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
        {options.map((o, i) => <option key={i}>{o}</option>)}
      </select>
    </div>
  );
}
