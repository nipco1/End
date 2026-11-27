import { GitMerge, CheckCircle, Clock, XCircle, ArrowLeft, Plus, Settings } from 'lucide-react';
import { useStore } from '../store';
import { CreateWorkflowModal } from '../components/Modals';
import { useState } from 'react';

const workflows = [
  {
    id: 1,
    name: 'گردش کار تأیید اسناد فنی',
    steps: ['پیش‌نویس', 'بررسی فنی', 'تأیید مدیر', 'انتشار', 'آرشیو'],
    currentStep: 2,
    documents: 23,
    avgTime: '۳ روز',
    status: 'active',
  },
  {
    id: 2,
    name: 'گردش کار گزارش خرابی',
    steps: ['ثبت گزارش', 'تحلیل اولیه', 'RCA', 'اقدام اصلاحی', 'تأیید نهایی', 'بستن'],
    currentStep: 3,
    documents: 12,
    avgTime: '۵ روز',
    status: 'active',
  },
  {
    id: 3,
    name: 'گردش کار استاندارد جدید',
    steps: ['پیشنهاد', 'بررسی کمیته', 'تدوین', 'تأیید مدیریت', 'انتشار'],
    currentStep: 1,
    documents: 5,
    avgTime: '۱۴ روز',
    status: 'active',
  },
  {
    id: 4,
    name: 'گردش کار درخواست دسترسی',
    steps: ['درخواست', 'بررسی مدیر واحد', 'تأیید امنیت', 'اعمال'],
    currentStep: 0,
    documents: 8,
    avgTime: '۱ روز',
    status: 'active',
  },
];

const pendingApprovals = [
  { id: 1, title: 'دستورالعمل نگهداری ربات ABB-5', requester: 'مهندس کریمی', dept: 'مهندسی', waiting: '۲ روز', priority: 'بالا' },
  { id: 2, title: 'گزارش ماهانه کیفیت - مهر', requester: 'خانم رضایی', dept: 'کیفیت', waiting: '۱ روز', priority: 'متوسط' },
  { id: 3, title: 'استاندارد جدید تست ضربه کامپوزیت', requester: 'آقای نوری', dept: 'کامپوزیت', waiting: '۴ روز', priority: 'بالا' },
  { id: 4, title: 'تغییر روش اجرایی انبار', requester: 'آقای محمدی', dept: 'تولید', waiting: '۶ ساعت', priority: 'کم' },
];

export default function Workflows() {
  const store = useStore();
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const currentWorkflows = store.workflows.length > 0 ? store.workflows : workflows;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">گردش کار (Workflow)</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">طراحی و مدیریت فرایندهای تأیید و انتشار اسناد</p>
        </div>
        <button onClick={() => setShowCreateWorkflow(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">
          <Plus size={16} /> گردش کار جدید
        </button>
      </div>

      {/* Workflow Templates */}
      <div className="space-y-4">
        <h2 className="font-medium text-sm text-slate-700 dark:text-slate-300">گردش کارهای فعال</h2>
        {currentWorkflows.map(wf => (
          <div key={wf.id} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <GitMerge size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-slate-800 dark:text-white">{wf.name}</h3>
                  <p className="text-xs text-slate-500">{wf.documents} سند در جریان • میانگین: {wf.avgTime}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <Settings size={14} className="text-slate-400" />
              </button>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {wf.steps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                    i < wf.currentStep ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                    i === wf.currentStep ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-300' :
                    'bg-slate-100 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {i < wf.currentStep ? <CheckCircle size={12} /> : i === wf.currentStep ? <Clock size={12} /> : null}
                    {typeof step === 'string' ? step : step.name}
                  </div>
                  {i < wf.steps.length - 1 && (
                    <ArrowLeft size={14} className="text-slate-300 mx-1 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-sm text-slate-800 dark:text-white">تأییدهای در انتظار من</h2>
          <span className="badge badge-warning">{pendingApprovals.length} مورد</span>
        </div>
        <div className="space-y-3">
          {pendingApprovals.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1">درخواست‌دهنده: {item.requester} • {item.dept} • انتظار: {item.waiting}</p>
              </div>
              <span className={`badge ${item.priority === 'بالا' ? 'badge-danger' : item.priority === 'متوسط' ? 'badge-warning' : 'badge-neutral'}`}>
                اولویت: {item.priority}
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">تأیید</button>
                <button className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-900/50">رد</button>
                <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-600 dark:text-slate-300">مشاهده</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLA Report */}
      <div className="card p-5">
        <h2 className="font-medium text-sm text-slate-800 dark:text-white mb-4">گزارش SLA گردش کار</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
            <p className="text-xl font-bold text-green-600 num">۸۷٪</p>
            <p className="text-[10px] text-green-500"> innerhalb SLA</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <p className="text-xl font-bold text-amber-600 num">۸٪</p>
            <p className="text-[10px] text-amber-500">نزدیک به SLA</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
            <p className="text-xl font-bold text-red-600 num">۵٪</p>
            <p className="text-[10px] text-red-500">خارج از SLA</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <p className="text-xl font-bold text-blue-600 num">۲.۳ روز</p>
            <p className="text-[10px] text-blue-500">میانگین زمان</p>
          </div>
        </div>
      </div>

      <CreateWorkflowModal isOpen={showCreateWorkflow} onClose={() => setShowCreateWorkflow(false)} />
    </div>
  );
}
