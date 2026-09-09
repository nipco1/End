import { useState } from 'react';
import { Users, Calendar, Clock, MapPin, FileText, CheckCircle, AlertCircle, Plus, Mic, Video } from 'lucide-react';

const meetings = [
  {
    id: 1,
    title: 'کمیته فنی بررسی خرابی پرس ۱۵۰۰',
    date: '۱۴۰۳/۰۷/۱۶',
    time: '۱۰:۰۰ - ۱۱:۳۰',
    location: 'اتاق جلسات مهندسی',
    participants: ['مهندس احمدی', 'مهندس کریمی', 'آقای نوری', 'خانم رضایی'],
    status: 'upcoming',
    actionItems: 3,
    hasRecording: true,
  },
  {
    id: 2,
    title: 'بررسی کیفیت محصولات کامپوزیت',
    date: '۱۴۰۳/۰۷/۱۵',
    time: '۱۴:۰۰ - ۱۵:۰۰',
    location: 'سالن جلسات اصلی',
    participants: ['مهندس احمدی', 'آقای محمدی', 'خانم حسینی'],
    status: 'completed',
    actionItems: 5,
    hasRecording: true,
  },
  {
    id: 3,
    title: 'هماهنگی تعمیرات اساسی سالانه',
    date: '۱۴۰۳/۰۷/۱۴',
    time: '۰۹:۰۰ - ۱۲:۰۰',
    location: 'اتاق جلسات مدیریت',
    participants: ['مهندس احمدی', 'مهندس کریمی', 'آقای نوری', 'آقای محمدی', 'خانم رضایی', 'آقای حسینی'],
    status: 'completed',
    actionItems: 8,
    hasRecording: true,
  },
  {
    id: 4,
    title: 'بازبینی استانداردهای HSE',
    date: '۱۴۰۳/۰۷/۱۸',
    time: '۱۱:۰۰ - ۱۲:۰۰',
    location: 'آنلاین',
    participants: ['خانم حسینی', 'مهندس احمدی'],
    status: 'upcoming',
    actionItems: 0,
    hasRecording: false,
  },
];

const actionItems = [
  { id: 1, text: 'تهیه گزارش RCA کامل خرابی پرس ۱۵۰۰', assignee: 'مهندس کریمی', deadline: '۱۴۰۳/۰۷/۲۰', status: 'pending' },
  { id: 2, text: 'بروزرسانی دستورالعمل نگهداری هیدرولیک', assignee: 'آقای نوری', deadline: '۱۴۰۳/۰۷/۲۲', status: 'pending' },
  { id: 3, text: 'ارسال نمونه برای تست آزمایشگاه', assignee: 'خانم رضایی', deadline: '۱۴۰۳/۰۷/۱۷', status: 'done' },
  { id: 4, text: 'تهیه لیست قطعات یدکی مورد نیاز', assignee: 'آقای محمدی', deadline: '۱۴۰۳/۰۷/۱۹', status: 'pending' },
  { id: 5, text: 'بروزرسانی FMEA خط تولید', assignee: 'مهندس احمدی', deadline: '۱۴۰۳/۰۷/۲۵', status: 'pending' },
];

export default function Meetings() {
  const [selectedMeeting, setSelectedMeeting] = useState<typeof meetings[0] | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">مدیریت جلسات و دانش ضمنی</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">ثبت جلسات، صورتجلسات، تصمیمات و Action Items</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
          <Plus size={16} /> ثبت جلسه جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-blue-600 num">۲</p>
          <p className="text-[10px] text-slate-500">جلسات پیش‌رو</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-green-600 num">۱۶</p>
          <p className="text-[10px] text-slate-500">جلسات این ماه</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-amber-600 num">۱۲</p>
          <p className="text-[10px] text-slate-500">Action Items باز</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-purple-600 num">۸</p>
          <p className="text-[10px] text-slate-500">ضبط صوتی</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Meetings List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-medium text-sm text-slate-700 dark:text-slate-300">جلسات</h2>
          {meetings.map(m => (
            <div
              key={m.id}
              onClick={() => setSelectedMeeting(m)}
              className={`card p-4 cursor-pointer transition-colors ${selectedMeeting?.id === m.id ? 'border-blue-300 bg-blue-50/50 dark:bg-blue-900/10' : 'hover:border-slate-300'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm text-slate-800 dark:text-white">{m.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {m.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {m.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {m.location}</span>
                  </div>
                </div>
                <span className={`badge ${m.status === 'upcoming' ? 'badge-info' : 'badge-success'}`}>
                  {m.status === 'upcoming' ? 'پیش‌رو' : 'برگزارشده'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{m.participants.length} نفر</span>
                  <div className="flex -mr-1 mr-2">
                    {m.participants.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white dark:border-slate-800 -mr-1" />
                    ))}
                    {m.participants.length > 3 && (
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 -mr-1 flex items-center justify-center text-[8px] text-slate-500">
                        +{m.participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.hasRecording && <Mic size={12} className="text-green-500" />}
                  {m.actionItems > 0 && (
                    <span className="text-xs text-slate-500">{m.actionItems} اقدام</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Items */}
        <div className="card p-4">
          <h2 className="font-medium text-sm text-slate-800 dark:text-white mb-3">Action Items</h2>
          <div className="space-y-2">
            {actionItems.map(item => (
              <div key={item.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-start gap-2">
                  {item.status === 'done' ? (
                    <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-xs ${item.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{item.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500">{item.assignee}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] text-slate-500">مهلت: {item.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expert Directory */}
      <div className="card p-5">
        <h2 className="font-medium text-sm text-slate-800 dark:text-white mb-4">فهرست متخصصین (Expert Directory)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'مهندس احمدی', expertise: 'هیدرولیک • پرس', exp: '۱۵ سال', docs: 45 },
            { name: 'مهندس کریمی', expertise: 'رباتیک • ABB', exp: '۱۰ سال', docs: 32 },
            { name: 'آقای نوری', expertise: 'کامپوزیت • مواد', exp: '۸ سال', docs: 28 },
            { name: 'خانم رضایی', expertise: 'کیفیت • ISO', exp: '۱۲ سال', docs: 38 },
          ].map((expert, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {expert.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{expert.name}</p>
                  <p className="text-[10px] text-slate-500">{expert.expertise}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>تجربه: {expert.exp}</span>
                <span>{expert.docs} سند</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
