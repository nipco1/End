import { useState } from 'react';
import { Brain, Send, FileText, BookOpen, Lightbulb, RefreshCw, Copy, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; page?: string; doc: string }[];
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'سلام! من دستیار هوشمند مدیریت دانش نیپکو هستم. می‌توانم در موارد زیر به شما کمک کنم:\n\n• پاسخ به سؤالات فنی بر اساس اسناد سازمانی\n• خلاصه‌سازی اسناد طولانی\n• استخراج Lessons Learned\n• پیشنهاد اسناد مرتبط\n• تحلیل روند خرابی‌ها\n• پاسخ به سؤالات مدیریتی\n\nلطفاً سؤال خود را مطرح کنید.',
    timestamp: '۱۰:۳۰',
  },
];

const sampleResponses: Record<string, { content: string; sources: { title: string; page?: string; doc: string }[] }> = {
  'default': {
    content: 'بر اساس اسناد موجود در سامانه، اطلاعات زیر یافت شد:\n\n**علل رایج خرابی پرس‌های هیدرولیک:**\n\n۱. **آلودگی روغن** (۳۵٪ موارد) — ناشی از نقص فیلتر یا ورود گرد و غبار\n۲. **فرسودگی سیل** (۲۵٪ موارد) — عمر مفید ۲-۳ سال\n۳. **خرابی پمپ** (۲۰٪ موارد) — معمولاً به‌دلیل کاویتاسیون\n۴. **نشتی اتصالات** (۱۵٪ موارد) — شل‌شدن اتصالات در اثر ارتعاش\n۵. **داغ‌شدن سیستم** (۵٪ موارد) — نقص در سیستم خنک‌کاری\n\n**توصیه:** بازرسی دوره‌ای هر ۵۰۰ ساعت و تعویض فیلتر هر ۱۰۰۰ ساعت طبق استاندارد NPC-MNT-STD-003.',
    sources: [
      { title: 'دستورالعمل تعمیر پرس هیدرولیک ۱۵۰۰ تن', page: 'صفحه ۱۲-۱۵', doc: 'DOC-MNT-001' },
      { title: 'گزارش RCA خرابی پمپ هیدرولیک', page: 'صفحه ۳', doc: 'DOC-ENG-045' },
      { title: 'استاندارد نگهداری سیستم‌های هیدرولیک', page: 'بخش ۴.۲', doc: 'STD-MNT-003' },
    ],
  },
};

const quickActions = [
  { icon: BookOpen, label: 'خلاصه‌سازی سند', prompt: 'لطفاً سند دستورالعمل تعمیر پرس ۱۵۰۰ تن را خلاصه کن' },
  { icon: Lightbulb, label: 'Lessons Learned', prompt: 'مهم‌ترین درس‌آموخته‌های حوزه نگهداری و تعمیرات را استخراج کن' },
  { icon: FileText, label: 'تحلیل خرابی', prompt: 'علل اصلی خرابی پرس‌های هیدرولیک چیست؟' },
  { icon: Brain, label: 'پیشنهاد بهبود', prompt: 'پیشنهادات بهبود فرایند تولید کامپوزیت' },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('local');

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: Message = {
      id: messages.length + 1,
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = sampleResponses['default'];
      const aiMsg: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response.content,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex gap-4 animate-fade-in h-[calc(100vh-140px)]">
      {/* Chat Area */}
      <div className="flex-1 card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white text-sm">دستیار هوشمند سازمانی</h2>
              <p className="text-[10px] text-slate-500">پاسخ‌ها بر اساس اسناد مجاز سازمان • RAG-Based</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedProvider}
              onChange={e => setSelectedProvider(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              <option value="local">مدل داخلی (On-Premise)</option>
              <option value="cloud">مدل ابری</option>
              <option value="hybrid">ترکیبی</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : 'order-1'}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-[10px] text-slate-500 font-medium">منابع استناد:</p>
                    {msg.sources.map((src, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <ExternalLink size={10} className="text-blue-500" />
                        <span className="text-[10px] text-blue-700 dark:text-blue-300 flex-1">{src.title}</span>
                        <span className="text-[10px] text-blue-500">{src.page}</span>
                      </div>
                    ))}
                  </div>
                )}
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-400"><Copy size={12} /></button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-400"><ThumbsUp size={12} /></button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-400"><ThumbsDown size={12} /></button>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-400"><RefreshCw size={12} /></button>
                    <span className="text-[10px] text-slate-400 mr-auto">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-end">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="سؤال خود را بپرسید..."
            />
            <button
              onClick={() => handleSend()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            AI فقط بر اساس اسناد مجاز شما پاسخ می‌دهد • اطلاعات محرمانه به سرویس خارجی ارسال نمی‌شود
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 space-y-4 overflow-y-auto">
        {/* Quick Actions */}
        <div className="card p-4">
          <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-3">دسترسی سریع</h3>
          <div className="space-y-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action.prompt)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <action.icon size={14} className="text-blue-500" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Stats */}
        <div className="card p-4">
          <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-3">آمار AI</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">پاسخ‌های امروز</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">۲۳</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">میانگین رضایت</span>
              <span className="font-bold text-green-600">۸۷٪</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">اسناد پردازش‌شده</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">۱,۲۳۴</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">مدل فعال</span>
              <span className="font-bold text-blue-600">On-Premise</span>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="card p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <h3 className="font-medium text-xs text-amber-800 dark:text-amber-300 mb-2">🔒 حریم خصوصی</h3>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
            تمام پاسخ‌ها Citation-Based هستند. اسناد محرمانه فقط با مجوز Policy وارد AI می‌شوند. داده‌ها به سرویس خارجی ارسال نمی‌شوند مگر با تنظیم صریح.
          </p>
        </div>
      </div>
    </div>
  );
}
