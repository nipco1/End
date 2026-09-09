// ============================================================
// Presentation Layer - Shared Components
// لایه ارائه - کامپوننت‌های مشترک
// ============================================================

import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, HardDrive, Shield } from 'lucide-react';
import { useStore } from '../store';
import { FileStorageService } from '../layers/infrastructure/repositories';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const store = useStore();
  const [files, setFiles] = useState<{ file: File; progress: number; status: 'pending' | 'uploading' | 'processing' | 'done' | 'error' }[]>([]);
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('تولید');
  const [type, setType] = useState('PDF');
  const [tags, setTags] = useState('');
  const [confidentialLevel, setConfidentialLevel] = useState<'public' | 'internal' | 'confidential'>('internal');
  const [isUploading, setIsUploading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles = selectedFiles.map(f => ({
      file: f,
      progress: 0,
      status: 'pending' as const
    }));
    
    // Check for duplicates
    const existingDocs = store.documents;
    const hasDuplicate = selectedFiles.some(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return existingDocs.some(d => d.title.toLowerCase() === f.name.replace(/\.[^.]+$/, '').toLowerCase());
    });
    setDuplicateWarning(hasDuplicate);
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles = droppedFiles.map(f => ({
      file: f,
      progress: 0,
      status: 'pending' as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading', progress: 30 } : f));
      
      // Simulate upload progress
      await new Promise(r => setTimeout(r, 500));
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 60, status: 'processing' } : f));
      
      await new Promise(r => setTimeout(r, 300));
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 90 } : f));

      // Upload to store
      const file = files[i].file;
      const result = await store.addDocument({
        title: title || file.name.replace(/\.[^.]+$/, ''),
        file,
        dept,
        type: type || file.name.split('.').pop()?.toUpperCase() || 'PDF',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        confidentialLevel
      });

      if (result.success) {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 100, status: 'done' } : f));
      } else {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' } : f));
      }
    }

    setIsUploading(false);
    
    // Close after success
    setTimeout(() => {
      const allDone = files.every(f => f.status === 'done');
      if (allDone) {
        onClose();
        setFiles([]);
        setTitle('');
        setTags('');
      }
    }, 1000);
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Upload size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">آپلود سند جدید</h2>
              <p className="text-xs text-slate-500">فایل‌ها با Hash SHA-256 بررسی و Deduplication می‌شوند</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
          >
            <Upload size={32} className="mx-auto text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">فایل‌ها را اینجا رها کنید یا کلیک کنید</p>
            <p className="text-xs text-slate-400 mt-1">حداکثر ۵۰۰ مگابایت • پشتیبانی از تمام فرمت‌ها</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
          </div>

          {/* Duplicate Warning */}
          {duplicateWarning && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle size={16} className="text-amber-600" />
              <p className="text-xs text-amber-700 dark:text-amber-300">فایل تکراری شناسایی شد! سیستم از Deduplication استفاده خواهد کرد.</p>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">فایل‌های انتخاب‌شده ({files.length})</p>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <FileText size={18} className="text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{f.file.name}</p>
                    <p className="text-[10px] text-slate-400">{FileStorageService.formatFileSize(f.file.size)}</p>
                    {f.status !== 'pending' && (
                      <div className="progress-bar mt-1 h-1.5">
                        <div className={`progress-bar-fill ${f.status === 'done' ? 'bg-green-500' : f.status === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${f.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {f.status === 'done' && <CheckCircle size={16} className="text-green-500" />}
                    {f.status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                    {f.status === 'pending' && (
                      <button onClick={() => removeFile(i)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <X size={14} className="text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-xs text-slate-500 pt-2">
                <span>مجموع: {FileStorageService.formatFileSize(totalSize)}</span>
                <span className="flex items-center gap-1"><HardDrive size={10} /> فضای آزاد: {store.storageStats.freeCapacity} GB</span>
              </div>
            </div>
          )}

          {/* Metadata */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div>
                <label className="text-xs text-slate-500 block mb-1">عنوان سند</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  placeholder={files[0]?.file.name.replace(/\.[^.]+$/, '') || 'عنوان سند'}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">واحد سازمانی</label>
                <select
                  value={dept}
                  onChange={e => setDept(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {['تولید', 'مهندسی', 'نگهداری و تعمیرات', 'کیفیت', 'کامپوزیت', 'HSE', 'مدیریت', 'آموزش'].map(d => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">نوع سند</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {['PDF', 'Word', 'Excel', 'PowerPoint', 'CAD', 'تصویر', 'ویدئو', 'صوت', 'سایر'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">سطح محرمانگی</label>
                <select
                  value={confidentialLevel}
                  onChange={e => setConfidentialLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <option value="public">عمومی</option>
                  <option value="internal">داخلی</option>
                  <option value="confidential">محرمانه</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 block mb-1">برچسب‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  placeholder="پرس، هیدرولیک، تعمیرات"
                />
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Shield size={14} className="text-blue-600" />
            <p className="text-[10px] text-blue-700 dark:text-blue-300">
              فایل‌ها ابتدا در Quarantine بررسی می‌شوند. Malware Scan و Hash SHA-256 به‌صورت خودکار انجام می‌شود.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2 sticky bottom-0 bg-white dark:bg-slate-800">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            انصراف
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {isUploading ? 'در حال آپلود...' : `آپلود ${files.length} فایل`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Create Meeting Modal
interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMeetingModal({ isOpen, onClose }: CreateMeetingModalProps) {
  const store = useStore();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('۱۰:۰۰ - ۱۱:۰۰');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title) return;
    store.addMeeting({
      title,
      date: date || new Date().toLocaleDateString('fa-IR'),
      time,
      location: location || 'نامشخص',
      participants: participants.split(',').map(p => p.trim()).filter(Boolean)
    });
    onClose();
    setTitle('');
    setDate('');
    setParticipants('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-white">ثبت جلسه جدید</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">عنوان جلسه *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" placeholder="عنوان جلسه" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">تاریخ</label>
              <input type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" placeholder="۱۴۰۳/۰۷/۱۶" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">ساعت</label>
              <input type="text" value={time} onChange={e => setTime(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" placeholder="۱۰:۰۰ - ۱۱:۰۰" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">محل برگزاری</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" placeholder="اتاق جلسات / آنلاین" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">شرکت‌کنندگان (با کاما جدا کنید)</label>
            <input type="text" value={participants} onChange={e => setParticipants(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" placeholder="مهندس احمدی, خانم رضایی" />
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300">انصراف</button>
          <button onClick={handleSubmit} disabled={!title} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">ثبت جلسه</button>
        </div>
      </div>
    </div>
  );
}

// Create Workflow Modal
interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkflowModal({ isOpen, onClose }: CreateWorkflowModalProps) {
  const store = useStore();
  const [name, setName] = useState('');
  const [steps, setSteps] = useState(['پیش‌نویس', 'بررسی', 'تأیید', 'انتشار']);

  if (!isOpen) return null;

  const addStep = () => setSteps([...steps, `مرحله ${steps.length + 1}`]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, value: string) => setSteps(steps.map((s, idx) => idx === i ? value : s));

  const handleSubmit = () => {
    if (!name) return;
    store.addWorkflow({
      name,
      steps: steps.map(s => ({ name: s, assigneeRole: 'user' }))
    });
    onClose();
    setName('');
    setSteps(['پیش‌نویس', 'بررسی', 'تأیید', 'انتشار']);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-white">ایجاد گردش کار جدید</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X size={18} className="text-slate-400" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-slate-500 block mb-1">نام گردش کار *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" placeholder="مثلاً: گردش کار تأیید اسناد" />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">مراحل</label>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  <input type="text" value={step} onChange={e => updateStep(i, e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300" />
                  <button onClick={() => removeStep(i)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addStep} className="mt-2 text-xs text-blue-600 hover:text-blue-700">+ افزودن مرحله</button>
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300">انصراف</button>
          <button onClick={handleSubmit} disabled={!name} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">ایجاد</button>
        </div>
      </div>
    </div>
  );
}

// Toast Notification Component
export function ToastContainer() {
  const store = useStore();
  const unread = store.notifications.filter(n => !n.read);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      {unread.slice(0, 3).map(n => (
        <div key={n.id} className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-in ${
          n.type === 'success' ? 'bg-green-600 text-white' :
          n.type === 'error' ? 'bg-red-600 text-white' :
          n.type === 'warning' ? 'bg-amber-500 text-white' :
          'bg-blue-600 text-white'
        }`}>
          {n.type === 'success' && <CheckCircle size={16} />}
          {n.type === 'error' && <AlertCircle size={16} />}
          {n.type === 'warning' && <AlertCircle size={16} />}
          <span className="text-sm">{n.text}</span>
          <button onClick={() => store.markNotificationRead(n.id)} className="mr-2 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
