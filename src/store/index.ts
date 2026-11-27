// ============================================================
// Application Store - Global State Management
// مدیریت state سراسری - اتصال تمام لایه‌ها
// ============================================================

import { createContext, useContext } from 'react';
import { Document, User, Meeting, Workflow, AuditEntry, Notification, KnowledgeNode, StorageStats, DocumentStatus } from '../layers/shared/types';
import { documentRepo, meetingRepo, workflowRepo, auditRepo, notificationRepo, seedInitialData, FileStorageService, NotificationService } from '../layers/infrastructure/repositories';
import { DocumentUseCases, MeetingUseCases, WorkflowUseCases } from '../layers/application/useCases';
import { AuditDomainService } from '../layers/domain/services';

// Initialize data on first load
seedInitialData();

export interface StoreState {
  // Data
  documents: Document[];
  meetings: Meeting[];
  workflows: Workflow[];
  auditLog: AuditEntry[];
  notifications: Notification[];
  user: User | null;
  
  // Storage Stats
  storageStats: StorageStats;
  
  // Actions - Documents
  addDocument: (data: Partial<Document> & { file?: File }) => Promise<{ success: boolean; error?: string }>;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => { success: boolean; error?: string };
  approveDocument: (id: string) => { success: boolean; error?: string };
  rejectDocument: (id: string, reason: string) => { success: boolean; error?: string };
  changeStatus: (id: string, status: DocumentStatus) => { success: boolean; error?: string };
  
  // Actions - Meetings
  addMeeting: (data: Partial<Meeting>) => { success: boolean; error?: string };
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  addActionItem: (meetingId: string, text: string, assignee: string, deadline: string) => { success: boolean };
  completeActionItem: (meetingId: string, itemId: string) => void;
  
  // Actions - Workflows
  addWorkflow: (data: Partial<Workflow>) => { success: boolean; error?: string };
  advanceWorkflow: (id: string) => { success: boolean; error?: string };
  
  // Actions - User
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Actions - Notifications
  addNotification: (text: string, type: 'info' | 'warning' | 'success' | 'error') => void;
  markNotificationRead: (id: string) => void;
  
  // Actions - Audit
  addAuditEntry: (action: string, entity: string, status: 'success' | 'failed' | 'warning') => void;
  
  // Refresh
  refreshData: () => void;
}

export function createStore(): StoreState {
  const defaultUser: User = {
    id: '1',
    username: 'admin',
    fullName: 'مهندس احمدی',
    role: 'مدیر ارشد دانش',
    department: 'مدیریت',
    permissions: [
      'View', 'Download', 'Upload', 'EditMetadata', 'EditFile',
      'DeleteRequest', 'DeleteApprove', 'Approve', 'Reject',
      'Publish', 'Archive', 'Restore', 'Share', 'Export',
      'Print', 'AIAsk', 'AISummarize', 'ManageUsers',
      'ManagePolicies', 'ManageStorage', 'ManageAudit',
      'ManageWorkflow', 'ApproveConfidential'
    ]
  };

  const calculateStorageStats = (): StorageStats => {
    const docs = documentRepo.getAll();
    const totalBytes = docs.reduce((sum, d) => sum + d.sizeBytes, 0);
    const totalCapacity = 1000 * 1024 * 1024 * 1024; // 1TB
    const usedCapacity = totalBytes + (450 * 1024 * 1024 * 1024); // Base usage
    return {
      totalCapacity: 1000,
      usedCapacity: Math.round(usedCapacity / (1024 * 1024 * 1024)),
      freeCapacity: Math.round((totalCapacity - usedCapacity) / (1024 * 1024 * 1024)),
      hotStorage: 234,
      warmStorage: 312,
      coldStorage: 124,
      duplicateSize: 12.3,
      monthlyGrowth: 5.2,
      projectedFullDate: '۴ ماه دیگر'
    };
  };

  const state: StoreState = {
    documents: documentRepo.getAll(),
    meetings: meetingRepo.getAll(),
    workflows: workflowRepo.getAll(),
    auditLog: auditRepo.getAll(),
    notifications: notificationRepo.getAll().reverse().slice(0, 20),
    user: null,
    storageStats: calculateStorageStats(),

    addDocument: async (data) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      
      let hash = '';
      let sizeBytes = 0;
      let mimeType = 'application/pdf';
      
      if (data.file) {
        const fileInfo = await FileStorageService.uploadFile(data.file);
        hash = fileInfo.hash;
        sizeBytes = fileInfo.size;
        mimeType = fileInfo.mimeType;
      }

      const useCases = new DocumentUseCases(state.documents, state.user, state.auditLog);
      const result = useCases.createDocument({
        ...data,
        hash,
        sha256: hash,
        sizeBytes,
        size: FileStorageService.formatFileSize(sizeBytes),
        mimeType
      });

      if (result.success) {
        documentRepo.add(result.doc!);
        state.documents = documentRepo.getAll();
        state.storageStats = calculateStorageStats();
        state.auditLog = auditRepo.getAll();
        NotificationService.push(`سند "${data.title}" با موفقیت آپلود شد`, 'success');
        state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
      }
      return result;
    },

    updateDocument: (id, updates) => {
      documentRepo.update(d => d.id === id, { ...updates, updatedAt: new Date() });
      state.documents = documentRepo.getAll();
    },

    deleteDocument: (id) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      const useCases = new DocumentUseCases(state.documents, state.user, state.auditLog);
      const result = useCases.deleteDocument(id);
      if (result.success) {
        documentRepo.delete(d => d.id === id);
        state.documents = documentRepo.getAll();
        state.storageStats = calculateStorageStats();
        auditRepo.add(AuditDomainService.createAuditEntry(state.user, 'Delete', id, 'success'));
        state.auditLog = auditRepo.getAll();
        NotificationService.push('سند با موفقیت حذف شد', 'success');
        state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
      }
      return result;
    },

    approveDocument: (id) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      const useCases = new DocumentUseCases(state.documents, state.user, state.auditLog);
      const result = useCases.approveDocument(id);
      if (result.success) {
        documentRepo.update(d => d.id === id, { status: 'approved', approver: state.user!.fullName, updatedAt: new Date() });
        state.documents = documentRepo.getAll();
        auditRepo.add(AuditDomainService.createAuditEntry(state.user, 'Approve', id, 'success'));
        state.auditLog = auditRepo.getAll();
        NotificationService.push('سند تأیید شد', 'success');
        state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
      }
      return result;
    },

    rejectDocument: (id, reason) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      const useCases = new DocumentUseCases(state.documents, state.user, state.auditLog);
      const result = useCases.rejectDocument(id, reason);
      if (result.success) {
        documentRepo.update(d => d.id === id, { status: 'rejected', updatedAt: new Date() });
        state.documents = documentRepo.getAll();
        NotificationService.push('سند رد شد', 'warning');
        state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
      }
      return result;
    },

    changeStatus: (id, status) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      const useCases = new DocumentUseCases(state.documents, state.user, state.auditLog);
      const result = useCases.updateStatus(id, status);
      if (result.success) {
        documentRepo.update(d => d.id === id, { status, updatedAt: new Date() });
        state.documents = documentRepo.getAll();
      }
      return result;
    },

    addMeeting: (data) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      const useCases = new MeetingUseCases(state.meetings, state.user, state.auditLog);
      const result = useCases.createMeeting(data);
      if (result.success) {
        meetingRepo.add(result.meeting!);
        state.meetings = meetingRepo.getAll();
        NotificationService.push(`جلسه "${data.title}" ثبت شد`, 'success');
        state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
      }
      return result;
    },

    updateMeeting: (id, updates) => {
      meetingRepo.update(m => m.id === id, updates);
      state.meetings = meetingRepo.getAll();
    },

    deleteMeeting: (id) => {
      meetingRepo.delete(m => m.id === id);
      state.meetings = meetingRepo.getAll();
    },

    addActionItem: (meetingId, text, assignee, deadline) => {
      const useCases = new MeetingUseCases(state.meetings, state.user!, state.auditLog);
      const result = useCases.addActionItem(meetingId, { text, assignee, deadline });
      if (result.success) {
        const meetings = meetingRepo.getAll();
        const meeting = meetings.find(m => m.id === meetingId);
        if (meeting) {
          meeting.actionItems.push({
            id: crypto.randomUUID(),
            text,
            assignee,
            deadline,
            status: 'pending',
            meetingId
          });
          meetingRepo.save(meetings);
          state.meetings = meetingRepo.getAll();
        }
      }
      return result;
    },

    completeActionItem: (meetingId, itemId) => {
      const meetings = meetingRepo.getAll();
      const meeting = meetings.find(m => m.id === meetingId);
      if (meeting) {
        const item = meeting.actionItems.find(i => i.id === itemId);
        if (item) {
          item.status = 'done';
          meetingRepo.save(meetings);
          state.meetings = meetingRepo.getAll();
        }
      }
    },

    addWorkflow: (data) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      const useCases = new WorkflowUseCases(state.workflows, state.user, state.auditLog);
      const result = useCases.createWorkflow(data);
      if (result.success) {
        workflowRepo.add(result.workflow!);
        state.workflows = workflowRepo.getAll();
        NotificationService.push(`گردش کار "${data.name}" ایجاد شد`, 'success');
        state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
      }
      return result;
    },

    advanceWorkflow: (id) => {
      if (!state.user) return { success: false, error: 'لطفاً وارد شوید' };
      const useCases = new WorkflowUseCases(state.workflows, state.user, state.auditLog);
      const result = useCases.advanceWorkflow(id);
      if (result.success) {
        const workflows = workflowRepo.getAll();
        const wf = workflows.find(w => w.id === id);
        if (wf) {
          wf.currentStep = Math.min(wf.currentStep + 1, wf.steps.length - 1);
          workflowRepo.save(workflows);
          state.workflows = workflowRepo.getAll();
        }
      }
      return result;
    },

    login: (username, password) => {
      if (username && password) {
        state.user = defaultUser;
        auditRepo.add(AuditDomainService.createAuditEntry(defaultUser, 'Login', '-', 'success'));
        state.auditLog = auditRepo.getAll();
        return true;
      }
      return false;
    },

    logout: () => {
      if (state.user) {
        auditRepo.add(AuditDomainService.createAuditEntry(state.user, 'Logout', '-', 'success'));
      }
      state.user = null;
    },

    addNotification: (text, type) => {
      NotificationService.push(text, type);
      state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
    },

    markNotificationRead: (id) => {
      NotificationService.markRead(id);
      state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
    },

    addAuditEntry: (action, entity, status) => {
      if (state.user) {
        auditRepo.add(AuditDomainService.createAuditEntry(state.user, action, entity, status));
        state.auditLog = auditRepo.getAll();
      }
    },

    refreshData: () => {
      state.documents = documentRepo.getAll();
      state.meetings = meetingRepo.getAll();
      state.workflows = workflowRepo.getAll();
      state.auditLog = auditRepo.getAll();
      state.notifications = notificationRepo.getAll().reverse().slice(0, 20);
      state.storageStats = calculateStorageStats();
    }
  };

  return state;
}

// Singleton store
let storeInstance: StoreState | null = null;

export function getStore(): StoreState {
  if (!storeInstance) {
    storeInstance = createStore();
  }
  return storeInstance;
}

// React Context
export const StoreContext = createContext<StoreState>(getStore());

export function useStore(): StoreState {
  return useContext(StoreContext);
}
