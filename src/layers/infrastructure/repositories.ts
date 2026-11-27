// ============================================================
// Infrastructure Layer - Repositories & External Services
// لایه زیرساخت - مخازن داده و سرویس‌های خارجی
// ============================================================

import { Document, User, Meeting, Workflow, AuditEntry, KnowledgeNode, Notification, Setting, StorageStats } from '../shared/types';

const STORAGE_KEYS = {
  DOCUMENTS: 'nipco_documents',
  MEETINGS: 'nipco_meetings',
  WORKFLOWS: 'nipco_workflows',
  AUDIT_LOG: 'nipco_audit_log',
  NOTIFICATIONS: 'nipco_notifications',
  SETTINGS: 'nipco_settings',
  USERS: 'nipco_users',
  KNOWLEDGE_TREE: 'nipco_knowledge_tree',
};

// Generic Repository with localStorage persistence
class LocalStorageRepository<T> {
  constructor(private key: string, private initialData: T[] = []) {}

  getAll(): T[] {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : this.initialData;
    } catch {
      return this.initialData;
    }
  }

  save(items: T[]): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(items));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  add(item: T): void {
    const items = this.getAll();
    items.push(item);
    this.save(items);
  }

  update(predicate: (item: T) => boolean, updates: Partial<T>): void {
    const items = this.getAll();
    const index = items.findIndex(predicate);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.save(items);
    }
  }

  delete(predicate: (item: T) => boolean): void {
    const items = this.getAll().filter(item => !predicate(item));
    this.save(items);
  }

  getById(id: string): T | undefined {
    return this.getAll().find((item: any) => item.id === id);
  }
}

// Repositories
export const documentRepo = new LocalStorageRepository<Document>(STORAGE_KEYS.DOCUMENTS);
export const meetingRepo = new LocalStorageRepository<Meeting>(STORAGE_KEYS.MEETINGS);
export const workflowRepo = new LocalStorageRepository<Workflow>(STORAGE_KEYS.WORKFLOWS);
export const auditRepo = new LocalStorageRepository<AuditEntry>(STORAGE_KEYS.AUDIT_LOG);
export const notificationRepo = new LocalStorageRepository<Notification>(STORAGE_KEYS.NOTIFICATIONS);
export const settingsRepo = new LocalStorageRepository<Setting>(STORAGE_KEYS.SETTINGS);

// Initial Data Seed
export function seedInitialData(): void {
  if (documentRepo.getAll().length === 0) {
    const initialDocs: Document[] = [
      {
        id: '1', title: 'دستورالعمل تعمیر پرس هیدرولیک ۱۵۰۰ تن', code: 'DOC-MNT-001',
        type: 'PDF', size: '4.2 MB', sizeBytes: 4404019, status: 'approved', dept: 'نگهداری و تعمیرات',
        date: '۱۴۰۳/۰۷/۱۵', version: 'v2.1', hash: 'a3f8c2d1', sha256: 'a3f8e2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
        mimeType: 'application/pdf', storageClass: 'hot', ocrStatus: 'completed', aiStatus: 'completed',
        downloadCount: 45, viewCount: 123, tags: ['پرس', 'هیدرولیک', 'تعمیر'],
        owner: 'مهندس احمدی', approver: 'مهندس کریمی', confidentialLevel: 'internal',
        relatedDocs: [], createdAt: new Date(), updatedAt: new Date(), createdBy: '1'
      },
      {
        id: '2', title: 'گزارش RCA خرابی ربات ABB-3', code: 'DOC-ENG-045',
        type: 'Word', size: '1.8 MB', sizeBytes: 1887437, status: 'review', dept: 'مهندسی',
        date: '۱۴۰۳/۰۷/۱۴', version: 'v1.0', hash: 'b7e2f4a8', sha256: 'b7e2f4a8c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
        mimeType: 'application/msword', storageClass: 'hot', ocrStatus: 'completed', aiStatus: 'none',
        downloadCount: 23, viewCount: 67, tags: ['RCA', 'ربات', 'خرابی'],
        owner: 'مهندس کریمی', confidentialLevel: 'internal',
        relatedDocs: [], createdAt: new Date(), updatedAt: new Date(), createdBy: '2'
      },
      {
        id: '3', title: 'استاندارد تست کششی کامپوزیت', code: 'STD-CMP-012',
        type: 'PDF', size: '6.7 MB', sizeBytes: 7025459, status: 'published', dept: 'کامپوزیت',
        date: '۱۴۰۳/۰۷/۱۳', version: 'v3.0', hash: 'c1d9e5b3', sha256: 'c1d9e5b3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
        mimeType: 'application/pdf', storageClass: 'warm', ocrStatus: 'completed', aiStatus: 'completed',
        downloadCount: 67, viewCount: 234, tags: ['استاندارد', 'تست', 'کامپوزیت'],
        owner: 'آقای نوری', approver: 'مهندس احمدی', confidentialLevel: 'public',
        relatedDocs: [], createdAt: new Date(), updatedAt: new Date(), createdBy: '3'
      },
      {
        id: '4', title: 'نقشه فنی قالب پرس ۲۰۰۰ تن', code: 'DRW-PRD-089',
        type: 'CAD', size: '12.4 MB', sizeBytes: 13002342, status: 'approved', dept: 'تولید',
        date: '۱۴۰۳/۰۷/۱۲', version: 'v1.3', hash: 'd4a6g7c2', sha256: 'd4a6g7c2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        mimeType: 'application/acad', storageClass: 'warm', ocrStatus: 'pending', aiStatus: 'none',
        downloadCount: 34, viewCount: 89, tags: ['نقشه', 'قالب', 'پرس'],
        owner: 'آقای محمدی', confidentialLevel: 'confidential',
        relatedDocs: [], createdAt: new Date(), updatedAt: new Date(), createdBy: '4'
      },
      {
        id: '5', title: 'چک‌لیست بازرسی کمپرسور اسکرو', code: 'CHK-PRD-034',
        type: 'Excel', size: '0.8 MB', sizeBytes: 838861, status: 'approved', dept: 'تولید',
        date: '۱۴۰۳/۰۷/۱۱', version: 'v2.0', hash: 'e8b1h3d5', sha256: 'e8b1h3d5f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
        mimeType: 'application/vnd.ms-excel', storageClass: 'hot', ocrStatus: 'completed', aiStatus: 'none',
        downloadCount: 89, viewCount: 345, tags: ['چک‌لیست', 'بازرسی', 'کمپرسور'],
        owner: 'آقای محمدی', confidentialLevel: 'public',
        relatedDocs: [], createdAt: new Date(), updatedAt: new Date(), createdBy: '4'
      },
    ];
    documentRepo.save(initialDocs);
  }

  if (meetingRepo.getAll().length === 0) {
    const initialMeetings: Meeting[] = [
      {
        id: '1', title: 'کمیته فنی بررسی خرابی پرس ۱۵۰۰', date: '۱۴۰۳/۰۷/۱۶',
        time: '۱۰:۰۰ - ۱۱:۳۰', location: 'اتاق جلسات مهندسی',
        participants: ['مهندس احمدی', 'مهندس کریمی', 'آقای نوری', 'خانم رضایی'],
        status: 'upcoming', actionItems: [
          { id: '1', text: 'تهیه گزارش RCA', assignee: 'مهندس کریمی', deadline: '۱۴۰۳/۰۷/۲۰', status: 'pending', meetingId: '1' },
          { id: '2', text: 'بروزرسانی دستورالعمل', assignee: 'آقای نوری', deadline: '۱۴۰۳/۰۷/۲۲', status: 'pending', meetingId: '1' },
        ],
        hasRecording: true, attachments: [], createdBy: '1', createdAt: new Date()
      },
      {
        id: '2', title: 'بررسی کیفیت محصولات کامپوزیت', date: '۱۴۰۳/۰۷/۱۵',
        time: '۱۴:۰۰ - ۱۵:۰۰', location: 'سالن جلسات اصلی',
        participants: ['مهندس احمدی', 'آقای محمدی', 'خانم حسینی'],
        status: 'completed', actionItems: [
          { id: '3', text: 'ارسال نمونه برای تست', assignee: 'خانم رضایی', deadline: '۱۴۰۳/۰۷/۱۷', status: 'done', meetingId: '2' },
        ],
        hasRecording: true, attachments: [], createdBy: '1', createdAt: new Date()
      },
    ];
    meetingRepo.save(initialMeetings);
  }

  if (workflowRepo.getAll().length === 0) {
    const initialWorkflows: Workflow[] = [
      {
        id: '1', name: 'گردش کار تأیید اسناد فنی',
        steps: [
          { name: 'پیش‌نویس', assigneeRole: 'user' },
          { name: 'بررسی فنی', assigneeRole: 'expert' },
          { name: 'تأیید مدیر', assigneeRole: 'manager' },
          { name: 'انتشار', assigneeRole: 'admin' },
          { name: 'آرشیو', assigneeRole: 'admin' }
        ],
        currentStep: 2, documents: 23, avgTime: '۳ روز', status: 'active', createdBy: '1'
      },
      {
        id: '2', name: 'گردش کار گزارش خرابی',
        steps: [
          { name: 'ثبت گزارش', assigneeRole: 'user' },
          { name: 'تحلیل اولیه', assigneeRole: 'expert' },
          { name: 'RCA', assigneeRole: 'expert' },
          { name: 'اقدام اصلاحی', assigneeRole: 'manager' },
          { name: 'تأیید نهایی', assigneeRole: 'admin' },
          { name: 'بستن', assigneeRole: 'admin' }
        ],
        currentStep: 3, documents: 12, avgTime: '۵ روز', status: 'active', createdBy: '1'
      },
    ];
    workflowRepo.save(initialWorkflows);
  }

  if (auditRepo.getAll().length === 0) {
    const initialAudit: AuditEntry[] = [
      { id: '1', time: '۱۴:۲۳:۴۵', user: 'مهندس احمدی', role: 'مدیر دانش', action: 'Upload', entity: 'دستورالعمل تعمیر پرس ۱۵۰۰', ip: '192.168.1.45', device: 'Desktop', status: 'success', correlationId: 'c1' },
      { id: '2', time: '۱۴:۲۰:۱۲', user: 'خانم رضایی', role: 'کارشناس کیفیت', action: 'Download', entity: 'استاندارد تست کششی', ip: '192.168.1.67', device: 'Desktop', status: 'success', correlationId: 'c2' },
      { id: '3', time: '۱۴:۱۸:۳۳', user: 'آقای محمدی', role: 'اپراتور تولید', action: 'Login', entity: '-', ip: '192.168.1.23', device: 'Mobile', status: 'success', correlationId: 'c3' },
      { id: '4', time: '۱۴:۱۵:۰۱', user: 'نامشخص', role: '-', action: 'Failed Login', entity: '-', ip: '10.0.0.99', device: 'Unknown', status: 'failed', correlationId: 'c4' },
      { id: '5', time: '۱۴:۱۲:۴۵', user: 'مهندس کریمی', role: 'مدیر مهندسی', action: 'Approve', entity: 'گزارش RCA ربات ABB-3', ip: '192.168.1.12', device: 'Desktop', status: 'success', correlationId: 'c5' },
    ];
    auditRepo.save(initialAudit);
  }
}

// Infrastructure Services
export class FileStorageService {
  static async uploadFile(file: File): Promise<{ hash: string; size: number; mimeType: string }> {
    // Simulate file processing
    const hash = await this.calculateHash(file);
    return {
      hash,
      size: file.size,
      mimeType: file.type || 'application/octet-stream'
    };
  }

  private static calculateHash(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const view = new Uint8Array(buffer.slice(0, 1024)); // First 1KB for hash
        let hash = 0;
        for (let i = 0; i < view.length; i++) {
          hash = ((hash << 5) - hash) + view[i];
          hash = hash & hash;
        }
        resolve(Math.abs(hash).toString(16).padStart(16, '0'));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export class NotificationService {
  static push(text: string, type: 'info' | 'warning' | 'success' | 'error' = 'info'): void {
    const notif: Notification = {
      id: crypto.randomUUID(),
      text,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      type,
      read: false
    };
    notificationRepo.add(notif);
  }

  static getAll(): Notification[] {
    return notificationRepo.getAll().reverse().slice(0, 20);
  }

  static markRead(id: string): void {
    notificationRepo.update(n => n.id === id, { read: true });
  }
}
