import { useState } from 'react';
import { FileText, Upload, Filter, Grid3X3, List, Eye, Download, MoreVertical, Plus, Trash2, Edit3, CheckCircle, Clock, XCircle, Archive as ArchiveIcon } from 'lucide-react';
import { useStore } from '../store';
import { UploadModal } from '../components/Modals';

const statusLabels: Record<string, string> = {
  'draft': 'پیش‌نویس',
  'review': 'در انتظار تأیید',
  'approved': 'تأییدشده',
  'published': 'منتشرشده',
  'rejected': 'ردشده',
  'obsolete': 'منقضی',
  'archived': 'آرشیوشده',
};

const statusColors: Record<string, string> = {
  'draft': 'badge-neutral',
  'review': 'badge-warning',
  'approved': 'badge-success',
  'published': 'badge-info',
  'rejected': 'badge-danger',
  'obsolete': 'badge-danger',
  'archived': 'badge-neutral',
};

const typeIcons: Record<string, string> = {
  'PDF': '📄',
  'Word': '📝',
  'Excel': '📊',
  'CAD': '📐',
  'تصویر': '🖼️',
  'ویدئو': '🎬',
  'PowerPoint': '📊',
  'صوت': '🎵',
};

export default function Documents() {
  const store = useStore();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const documents = store.documents;
  const filteredDocs = filter === 'all' ? documents : documents.filter(d => {
    if (filter === 'approved') return d.status === 'approved' || d.status === 'published';
    if (filter === 'pending') return d.status === 'review';
    if (filter === 'draft') return d.status === 'draft';
    if (filter === 'expired') return d.status === 'obsolete';
    return true;
  });

  const selected = documents.find(d => d.id === selectedDoc);

  const handleApprove = (id: string) => {
    const result = store.approveDocument(id);
    if (!result.success) {
      alert(result.error);
    }
    setShowActions(null);
  };

  const handleReject = (id: string) => {
    if (!rejectReason) return;
    store.rejectDocument(id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
    setShowActions(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این سند مطمئن هستید؟')) {
      const result = store.deleteDocument(id);
      if (!result.success) {
        alert(result.error);
      }
    }
    setShowActions(null);
    setSelectedDoc(null);
  };

  const handleChangeStatus = (id: string, status: any) => {
    store.changeStatus(id, status);
    setShowActions(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">اسناد و مدارک</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">مدیریت، جست‌وجو و مشاهده تمام اسناد سازمانی — {documents.length} سند</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/25"
        >
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
                <tr key={doc.id} className="cursor-pointer" onClick={() => setSelectedDoc(doc.id)}>
                  <td className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span>{typeIcons[doc.type] || '📄'}</span>
                    {doc.title}
                  </td>
                  <td className="text-slate-500 text-xs">{doc.code}</td>
                  <td><span className="badge badge-neutral">{doc.type}</span></td>
                  <td className="text-slate-500 text-xs">{doc.size}</td>
                  <td className="text-slate-500 text-xs">{doc.dept}</td>
                  <td><span className={`badge ${statusColors[doc.status]}`}>{statusLabels[doc.status]}</span></td>
                  <td className="text-slate-500 text-xs">{doc.version}</td>
                  <td className="text-slate-500 text-xs">{doc.date}</td>
                  <td>
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowActions(showActions === doc.id ? null : doc.id); }}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      >
                        <MoreVertical size={14} className="text-slate-400" />
                      </button>
                      {showActions === doc.id && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1">
                          {doc.status === 'review' && (
                            <button onClick={(e) => { e.stopPropagation(); handleApprove(doc.id); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                              <CheckCircle size={12} /> تأیید
                            </button>
                          )}
                          {doc.status === 'review' && (
                            <button onClick={(e) => { e.stopPropagation(); setShowRejectModal(true); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <XCircle size={12} /> رد
                            </button>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); handleChangeStatus(doc.id, 'published'); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Eye size={12} /> انتشار
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleChangeStatus(doc.id, 'archived'); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <ArchiveIcon size={12} /> آرشیو
                          </button>
                          <hr className="my-1 border-slate-100 dark:border-slate-700" />
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <Trash2 size={12} /> حذف
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDocs.length === 0 && (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">سندی یافت نشد</p>
              <button onClick={() => setShowUpload(true)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">آپلود سند جدید</button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="card p-4 cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setSelectedDoc(doc.id)}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{typeIcons[doc.type] || '📄'}</span>
                <span className={`badge ${statusColors[doc.status]}`}>{statusLabels[doc.status]}</span>
              </div>
              <h3 className="font-medium text-sm text-slate-800 dark:text-white mb-1 line-clamp-2">{doc.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{doc.code} • {doc.version}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{doc.dept}</span>
                <span>{doc.size}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">{selected.title}</h2>
                  <p className="text-sm text-slate-500 mt-1">{selected.code} • {selected.version}</p>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                  <XCircle size={20} className="text-slate-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="واحد سازمانی" value={selected.dept} />
                <InfoRow label="نوع فایل" value={selected.type} />
                <InfoRow label="حجم" value={selected.size} />
                <InfoRow label="وضعیت" value={statusLabels[selected.status]} />
                <InfoRow label="تاریخ ثبت" value={selected.date} />
                <InfoRow label="نسخه" value={selected.version} />
                <InfoRow label="Hash (SHA-256)" value={selected.sha256?.substring(0, 16) + '...'} />
                <InfoRow label="وضعیت OCR" value={selected.ocrStatus === 'completed' ? 'تکمیل شده' : 'در انتظار'} />
                <InfoRow label="مالک" value={selected.owner} />
                <InfoRow label="سطح محرمانگی" value={selected.confidentialLevel === 'public' ? 'عمومی' : selected.confidentialLevel === 'internal' ? 'داخلی' : 'محرمانه'} />
                <InfoRow label="تعداد دانلود" value={String(selected.downloadCount)} />
                <InfoRow label="تعداد بازدید" value={String(selected.viewCount)} />
              </div>
              {selected.tags.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">برچسب‌ها</p>
                  <div className="flex gap-1 flex-wrap">
                    {selected.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-300">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700 flex-wrap">
                {selected.status === 'review' && (
                  <>
                    <button onClick={() => handleApprove(selected.id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      <CheckCircle size={14} /> تأیید
                    </button>
                    <button onClick={() => setShowRejectModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg text-sm hover:bg-red-200">
                      <XCircle size={14} /> رد
                    </button>
                  </>
                )}
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  <Eye size={14} /> پیش‌نمایش
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Download size={14} /> دانلود
                </button>
                <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md p-5 animate-fade-in">
            <h3 className="font-bold text-slate-800 dark:text-white mb-3">رد سند</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 h-24"
              placeholder="دلیل رد سند را وارد کنید (اجباری)..."
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => { setShowRejectModal(false); setRejectReason(''); }} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300">انصراف</button>
              <button onClick={() => selected && handleReject(selected.id)} disabled={!rejectReason} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm disabled:opacity-50">تأیید رد</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">نمایش ۱ تا {filteredDocs.length} از {documents.length} سند</p>
      </div>

      {/* Upload Modal */}
      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
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
