import { useState } from 'react';
import { FileText, Upload, Filter, Grid3X3, List, Eye, Download, MoreVertical, Plus, File, Image, Film, Music, Archive as ArchiveIcon, CheckCircle, Clock, XCircle } from 'lucide-react';

const documents = [
  { id: 1, title: 'دستورالعمل تعمیر پرس هیدرولیک ۱۵۰۰ تن', code: 'DOC-MNT-001', type: 'PDF', size: '4.2 MB', status: 'تأییدشده', dept: 'نگهداری و تعمیرات', date: '۱۴۰۳/۰۷/۱۵', version: 'v2.1', hash: 'a3f8...c2d1' },
  { id: 2, title: 'گزارش RCA خرابی ربات ABB-3', code: 'DOC-ENG-045', type: 'Word', size: '1.8 MB', status: 'در انتظار تأیید', dept: 'مهندسی', date: '۱۴۰۳/۰۷/۱۴', version: 'v1.0', hash: 'b7e2...f4a8' },
  { id: 3, title: 'استاندارد تست کششی کامپوزیت', code: 'STD-CMP-012', type: 'PDF', size: '6.7 MB', status: 'منتشرشده', dept: 'کامپوزیت', date: '۱۴۰۳/۰۷/۱۳', version: 'v3.0', hash: 'c1d9...e5b3' },
  { id: 4, title: 'نقشه فنی قالب پرس ۲۰۰۰ تن', code: 'DRW-PRD-089', type: 'CAD', size: '12.4 MB', status: 'تأییدشده', dept: 'تولید', date: '۱۴۰۳/۰۷/۱۲', version: 'v1.3', hash: 'd4a6...g7c2' },
  { id: 5, title: 'چک‌لیست بازرسی کمپرسور اسکرو', code: 'CHK-PRD-034', type: 'Excel', size: '0.8 MB', status: 'تأییدشده', dept: 'تولید', date: '۱۴۰۳/۰۷/۱۱', version: 'v2.0', hash: 'e8b1...h3d5' },
  { id: 6, title: 'گزارش ماهانه HSE - شهریور', code: 'RPT-HSE-067', type: 'PDF', size: '3.1 MB', status: 'پیش‌نویس', dept: 'HSE', date: '۱۴۰۳/۰۷/۱۰', version: 'v1.0', hash: 'f2c4...i6e8' },
  { id: 7, title: 'صورتجلسه کمیته فنی مرداد', code: 'MTG-MGT-023', type: 'Word', size: '0.5 MB', status: 'تأییدشده', dept: 'مدیریت', date: '۱۴۰۳/۰۷/۰۹', version: 'v1.0', hash: 'g5d7...j9f1' },
  { id: 8, title: 'دستورالعمل ایمنی کار با لیفتراک', code: 'SOP-HSE-015', type: 'PDF', size: '2.3 MB', status: 'منقضی', dept: 'HSE', date: '۱۴۰۲/۱۲/۲۰', version: 'v1.2', hash: 'h8e0...k2g4' },
  { id: 9, title: 'آنالیز عیوب رایج کامپوزیت', code: 'KNW-CMP-008', type: 'PDF', size: '8.9 MB', status: 'منتشرشده', dept: 'کامپوزیت', date: '۱۴۰۳/۰۶/۲۵', version: 'v2.1', hash: 'i1f3...l5h7' },
  { id: 10, title: 'گزارش کالیبراسیون تجهیزات', code: 'RPT-QAL-041', type: 'Excel', size: '1.2 MB', status: 'در انتظار تأیید', dept: 'کیفیت', date: '۱۴۰۳/۰۷/۰۸', version: 'v1.0', hash: 'j4g6...m8i0' },
];

const statusColors: Record<string, string> = {
  'تأییدشده': 'badge-success',
  'در انتظار تأیید': 'badge-warning',
  'منتشرشده': 'badge-info',
  'پیش‌نویس': 'badge-neutral',
  'منقضی': 'badge-danger',
};

const typeIcons: Record<string, string> = {
  'PDF': '📄',
  'Word': '📝',
  'Excel': '📊',
  'CAD': '📐',
  'تصویر': '🖼️',
  'ویدئو': '🎬',
};

export default function Documents() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);
  const [filter, setFilter] = useState('all');

  const filteredDocs = filter === 'all' ? documents : documents.filter(d => {
    if (filter === 'approved') return d.status === 'تأییدشده' || d.status === 'منتشرشده';
    if (filter === 'pending') return d.status === 'در انتظار تأیید';
    if (filter === 'draft') return d.status === 'پیش‌نویس';
    if (filter === 'expired') return d.status === 'منقضی';
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">اسناد و مدارک</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">مدیریت، جست‌وجو و مشاهده تمام اسناد سازمانی</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/25">
          <Upload size={16} />
          آپلود سند جدید
        </button>
      </div>

      {/* Filters */}
      <div className="card p-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          {[
            { key: 'all', label: 'همه' },
            { key: 'approved', label: 'تأییدشده' },
            { key: 'pending', label: 'در انتظار' },
            { key: 'draft', label: 'پیش‌نویس' },
            { key: 'expired', label: 'منقضی' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f.key ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
            <List size={16} />
          </button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
            <Grid3X3 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>کد</th>
                <th>نوع</th>
                <th>حجم</th>
                <th>واحد</th>
                <th>وضعیت</th>
                <th>نسخه</th>
                <th>تاریخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="cursor-pointer" onClick={() => setSelectedDoc(doc)}>
                  <td className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span>{typeIcons[doc.type] || '📄'}</span>
                    {doc.title}
                  </td>
                  <td className="text-slate-500 text-xs num">{doc.code}</td>
                  <td><span className="badge badge-neutral">{doc.type}</span></td>
                  <td className="text-slate-500 text-xs num">{doc.size}</td>
                  <td className="text-slate-500 text-xs">{doc.dept}</td>
                  <td><span className={`badge ${statusColors[doc.status]}`}>{doc.status}</span></td>
                  <td className="text-slate-500 text-xs num">{doc.version}</td>
                  <td className="text-slate-500 text-xs num">{doc.date}</td>
                  <td>
                    <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                      <MoreVertical size={14} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="card p-4 cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setSelectedDoc(doc)}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{typeIcons[doc.type] || '📄'}</span>
                <span className={`badge ${statusColors[doc.status]}`}>{doc.status}</span>
              </div>
              <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-1 line-clamp-2">{doc.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{doc.code} • {doc.version}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{doc.dept}</span>
                <span className="num">{doc.size}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">{selectedDoc.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{selectedDoc.code} • {selectedDoc.version}</p>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                  <XCircle size={20} className="text-slate-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="واحد سازمانی" value={selectedDoc.dept} />
                <InfoRow label="نوع فایل" value={selectedDoc.type} />
                <InfoRow label="حجم" value={selectedDoc.size} />
                <InfoRow label="وضعیت" value={selectedDoc.status} />
                <InfoRow label="تاریخ ثبت" value={selectedDoc.date} />
                <InfoRow label="نسخه" value={selectedDoc.version} />
                <InfoRow label="Hash (SHA-256)" value={selectedDoc.hash} />
                <InfoRow label="وضعیت OCR" value="تکمیل شده" />
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  <Eye size={14} /> پیش‌نمایش
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                  <Download size={14} /> دانلود
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <ArchiveIcon size={14} /> آرشیو
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">نمایش ۱ تا ۱۰ از ۲,۸۴۷ سند</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, '...', 285].map((p, i) => (
            <button key={i} className={`w-8 h-8 rounded-lg text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
    </div>
  );
}
