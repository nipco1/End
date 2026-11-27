import { useState } from 'react';
import { ChevronLeft, ChevronDown, Plus, Edit3, Trash2, FolderOpen, FileText, Settings, Move, GitBranch } from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  code: string;
  icon: string;
  docCount: number;
  children?: TreeNode[];
}

const knowledgeTree: TreeNode[] = [
  {
    id: '1', name: 'نیپکو', code: 'NPC', icon: '🏢', docCount: 2847,
    children: [
      {
        id: '1-1', name: 'مدیریت', code: 'MGT', icon: '👔', docCount: 234,
        children: [
          { id: '1-1-1', name: 'صورتجلسات', code: 'MTG', icon: '📋', docCount: 89 },
          { id: '1-1-2', name: 'قراردادها', code: 'CTR', icon: '📑', docCount: 45 },
          { id: '1-1-3', name: 'سیاست‌ها', code: 'POL', icon: '📜', docCount: 100 },
        ]
      },
      {
        id: '1-2', name: 'تولید', code: 'PRD', icon: '🏭', docCount: 342,
        children: [
          { id: '1-2-1', name: 'دستورالعمل‌ها', code: 'SOP', icon: '📖', docCount: 78 },
          { id: '1-2-2', name: 'گزارشات تولید', code: 'RPT', icon: '📊', docCount: 156 },
          { id: '1-2-3', name: 'نقشه‌ها', code: 'DRW', icon: '📐', docCount: 108 },
        ]
      },
      {
        id: '1-3', name: 'مهندسی', code: 'ENG', icon: '⚙️', docCount: 287,
        children: [
          { id: '1-3-1', name: 'مستندات فنی', code: 'TEC', icon: '🔧', docCount: 134 },
          { id: '1-3-2', name: 'RCA', code: 'RCA', icon: '🔍', docCount: 67 },
          { id: '1-3-3', name: 'FMEA', code: 'FMEA', icon: '⚠️', docCount: 45 },
          { id: '1-3-4', name: 'استانداردها', code: 'STD', icon: '📏', docCount: 41 },
        ]
      },
      {
        id: '1-4', name: 'نگهداری و تعمیرات', code: 'MNT', icon: '🔧', docCount: 198,
        children: [
          { id: '1-4-1', name: 'مکانیک', code: 'MEC', icon: '⚙️', docCount: 56 },
          { id: '1-4-2', name: 'برق', code: 'ELC', icon: '⚡', docCount: 45 },
          { id: '1-4-3', name: 'هیدرولیک', code: 'HYD', icon: '💧', docCount: 34 },
          { id: '1-4-4', name: 'رباتیک', code: 'ROB', icon: '🤖', docCount: 28 },
          { id: '1-4-5', name: 'تأسیسات', code: 'FAC', icon: '🏗️', docCount: 35 },
        ]
      },
      {
        id: '1-5', name: 'کیفیت', code: 'QAL', icon: '✅', docCount: 156,
        children: [
          { id: '1-5-1', name: 'چک‌لیست‌ها', code: 'CHK', icon: '☑️', docCount: 67 },
          { id: '1-5-2', name: 'گواهی‌ها', code: 'CRT', icon: '🏆', docCount: 34 },
          { id: '1-5-3', name: 'کالیبراسیون', code: 'CAL', icon: '📏', docCount: 55 },
        ]
      },
      {
        id: '1-6', name: 'کامپوزیت', code: 'CMP', icon: '🧪', docCount: 134,
        children: [
          { id: '1-6-1', name: 'مواد اولیه', code: 'MAT', icon: '🧱', docCount: 23 },
          { id: '1-6-2', name: 'فرایند', code: 'PRC', icon: '🔄', docCount: 34 },
          { id: '1-6-3', name: 'قالب و ابزار', code: 'TLS', icon: '🔨', docCount: 18 },
          { id: '1-6-4', name: 'عیوب و علل', code: 'DEF', icon: '🐛', docCount: 27 },
          { id: '1-6-5', name: 'تست‌ها', code: 'TST', icon: '🧪', docCount: 21 },
          { id: '1-6-6', name: 'Lessons Learned', code: 'LL', icon: '💡', docCount: 11 },
        ]
      },
      {
        id: '1-7', name: 'HSE', code: 'HSE', icon: '🦺', docCount: 89,
        children: [
          { id: '1-7-1', name: 'دستورالعمل ایمنی', code: 'SHS', icon: '⛑️', docCount: 34 },
          { id: '1-7-2', name: 'گزارشات حوادث', code: 'INC', icon: '🚨', docCount: 23 },
          { id: '1-7-3', name: 'آموزش HSE', code: 'TRN', icon: '🎓', docCount: 32 },
        ]
      },
      { id: '1-8', name: 'پروژه‌ها', code: 'PRJ', icon: '📁', docCount: 178 },
      { id: '1-9', name: 'استانداردها', code: 'STD', icon: '📏', docCount: 123 },
      { id: '1-10', name: 'آموزش', code: 'EDU', icon: '🎓', docCount: 95 },
      { id: '1-11', name: 'فرم‌ها', code: 'FRM', icon: '📝', docCount: 67 },
      { id: '1-12', name: 'آرشیو عمومی', code: 'ARC', icon: '🗄️', docCount: 456 },
    ]
  }
];

export default function KnowledgeTree() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '1-4']));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id}>
        <div
          className={`tree-node flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isSelected ? 'active' : ''}`}
          style={{ paddingRight: `${depth * 20 + 12}px` }}
          onClick={() => { setSelectedNode(node); if (hasChildren) toggleNode(node.id); }}
        >
          {hasChildren ? (
            <button className="p-0.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronLeft size={14} />}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <span className="text-base">{node.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{node.name}</p>
            <p className="text-[10px] text-slate-400">{node.code} • {node.docCount} سند</p>
          </div>
          {hasChildren && (
            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              {node.children!.length}
            </span>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div className="animate-fade-in">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-4 animate-fade-in h-[calc(100vh-140px)]">
      {/* Tree Panel */}
      <div className="card flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-800 dark:text-white">درخت دانش سازمانی</h2>
          </div>
          <div className="flex gap-1">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500" title="افزودن گره">
              <Plus size={16} />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500" title="ویرایش">
              <Edit3 size={16} />
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500" title="تنظیمات">
              <Settings size={16} />
            </button>
          </div>
        </div>
        <div className="space-y-0.5">
          {knowledgeTree.map(node => renderNode(node))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="card w-80 p-5 overflow-y-auto">
        {selectedNode ? (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">{selectedNode.icon}</span>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mt-2">{selectedNode.name}</h3>
              <p className="text-xs text-slate-500">کد: {selectedNode.code}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-blue-600">{selectedNode.docCount}</p>
                <p className="text-[10px] text-blue-500">تعداد اسناد</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-green-600">{selectedNode.children?.length || 0}</p>
                <p className="text-[10px] text-green-500">زیرمجموعه</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">عملیات</h4>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                <FolderOpen size={14} /> مشاهده اسناد
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                <Plus size={14} /> افزودن زیرمجموعه
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                <Move size={14} /> جابه‌جایی
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                <Trash2 size={14} /> حذف
              </button>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Metadata</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">مسئول:</span><span className="text-slate-700 dark:text-slate-300">مهندس احمدی</span></div>
                <div className="flex justify-between"><span className="text-slate-500">آخرین بروزرسانی:</span><span className="text-slate-700 dark:text-slate-300">۱۴۰۳/۰۷/۱۵</span></div>
                <div className="flex justify-between"><span className="text-slate-500">سطح دسترسی:</span><span className="text-slate-700 dark:text-slate-300">عمومی</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <GitBranch size={48} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm text-slate-500">یک گره از درخت دانش را انتخاب کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}
