// ============================================================
// Application Layer - Use Cases & Application Services
// لایه کاربرد - موارد استفاده و سرویس‌های کاربردی
// ============================================================

import { Document, User, Meeting, Workflow, AuditEntry, KnowledgeNode, DocumentStatus, ActionItem } from '../shared/types';
import { DocumentDomainService, StorageDomainService, WorkflowDomainService, AuditDomainService } from '../domain/services';

// Application Service Interfaces
export interface IDocumentRepository {
  getAll(): Document[];
  getById(id: string): Document | undefined;
  create(doc: Document): void;
  update(doc: Document): void;
  delete(id: string): void;
  search(query: string): Document[];
}

export interface IMeetingRepository {
  getAll(): Meeting[];
  getById(id: string): Meeting | undefined;
  create(meeting: Meeting): void;
  update(meeting: Meeting): void;
  delete(id: string): void;
}

export interface IWorkflowRepository {
  getAll(): Workflow[];
  getById(id: string): Workflow | undefined;
  create(wf: Workflow): void;
  update(wf: Workflow): void;
}

export interface IAuditRepository {
  getAll(): AuditEntry[];
  add(entry: AuditEntry): void;
}

// Use Cases
export class DocumentUseCases {
  constructor(
    private docs: Document[],
    private user: User,
    private auditLog: AuditEntry[]
  ) {}

  createDocument(data: Partial<Document>): { success: boolean; doc?: Document; error?: string } {
    if (!this.user.permissions.includes('Upload')) {
      return { success: false, error: 'شما مجوز آپلود ندارید' };
    }

    const newDoc: Document = {
      id: crypto.randomUUID(),
      title: data.title || 'بدون عنوان',
      code: data.code || DocumentDomainService.generateDocumentCode(data.type || 'DOC', data.dept || 'GEN'),
      type: data.type || 'PDF',
      size: data.size || '0 KB',
      sizeBytes: data.sizeBytes || 0,
      status: 'draft',
      dept: data.dept || 'نامشخص',
      date: new Date().toLocaleDateString('fa-IR'),
      version: 'v1.0',
      hash: data.hash || '',
      sha256: data.sha256 || '',
      mimeType: data.mimeType || 'application/pdf',
      storageClass: 'hot',
      ocrStatus: 'pending',
      aiStatus: 'none',
      downloadCount: 0,
      viewCount: 0,
      tags: data.tags || [],
      owner: this.user.fullName,
      confidentialLevel: data.confidentialLevel || 'internal',
      relatedDocs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: this.user.id
    };

    this.docs.push(newDoc);
    this.auditLog.push(AuditDomainService.createAuditEntry(this.user, 'Upload', newDoc.title, 'success'));
    return { success: true, doc: newDoc };
  }

  approveDocument(docId: string): { success: boolean; error?: string } {
    const doc = this.docs.find(d => d.id === docId);
    if (!doc) return { success: false, error: 'سند یافت نشد' };
    if (!DocumentDomainService.canApprove(doc, this.user)) {
      return { success: false, error: 'شما مجوز تأیید ندارید' };
    }
    if (!DocumentDomainService.validateStatusTransition(doc.status, 'approved')) {
      return { success: false, error: `تغییر وضعیت از ${doc.status} به approved مجاز نیست` };
    }
    doc.status = 'approved';
    doc.approver = this.user.fullName;
    doc.updatedAt = new Date();
    this.auditLog.push(AuditDomainService.createAuditEntry(this.user, 'Approve', doc.title, 'success'));
    return { success: true };
  }

  rejectDocument(docId: string, reason: string): { success: boolean; error?: string } {
    const doc = this.docs.find(d => d.id === docId);
    if (!doc) return { success: false, error: 'سند یافت نشد' };
    doc.status = 'rejected';
    doc.updatedAt = new Date();
    this.auditLog.push(AuditDomainService.createAuditEntry(this.user, 'Reject', doc.title, 'success', reason));
    return { success: true };
  }

  deleteDocument(docId: string): { success: boolean; error?: string } {
    const doc = this.docs.find(d => d.id === docId);
    if (!doc) return { success: false, error: 'سند یافت نشد' };
    if (!DocumentDomainService.canDelete(doc, this.user)) {
      return { success: false, error: 'شما مجوز حذف ندارید' };
    }
    const index = this.docs.indexOf(doc);
    this.docs.splice(index, 1);
    this.auditLog.push(AuditDomainService.createAuditEntry(this.user, 'Delete', doc.title, 'success'));
    return { success: true };
  }

  updateStatus(docId: string, newStatus: DocumentStatus): { success: boolean; error?: string } {
    const doc = this.docs.find(d => d.id === docId);
    if (!doc) return { success: false, error: 'سند یافت نشد' };
    if (!DocumentDomainService.validateStatusTransition(doc.status, newStatus)) {
      return { success: false, error: `تغییر وضعیت از ${doc.status} به ${newStatus} مجاز نیست` };
    }
    doc.status = newStatus;
    doc.updatedAt = new Date();
    this.auditLog.push(AuditDomainService.createAuditEntry(this.user, 'StatusChange', `${doc.title} → ${newStatus}`, 'success'));
    return { success: true };
  }
}

export class MeetingUseCases {
  constructor(
    private meetings: Meeting[],
    private user: User,
    private auditLog: AuditEntry[]
  ) {}

  createMeeting(data: Partial<Meeting>): { success: boolean; meeting?: Meeting; error?: string } {
    const newMeeting: Meeting = {
      id: crypto.randomUUID(),
      title: data.title || 'بدون عنوان',
      date: data.date || new Date().toLocaleDateString('fa-IR'),
      time: data.time || '۱۰:۰۰ - ۱۱:۰۰',
      location: data.location || 'نامشخص',
      participants: data.participants || [this.user.fullName],
      status: 'upcoming',
      actionItems: [],
      hasRecording: false,
      attachments: [],
      createdBy: this.user.id,
      createdAt: new Date()
    };
    this.meetings.push(newMeeting);
    this.auditLog.push(AuditDomainService.createAuditEntry(this.user, 'CreateMeeting', newMeeting.title, 'success'));
    return { success: true, meeting: newMeeting };
  }

  addActionItem(meetingId: string, item: Partial<ActionItem>): { success: boolean; error?: string } {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) return { success: false, error: 'جلسه یافت نشد' };
    const newItem: ActionItem = {
      id: crypto.randomUUID(),
      text: item.text || '',
      assignee: item.assignee || '',
      deadline: item.deadline || '',
      status: 'pending',
      meetingId
    };
    meeting.actionItems.push(newItem);
    return { success: true };
  }

  completeActionItem(meetingId: string, itemId: string): { success: boolean; error?: string } {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) return { success: false, error: 'جلسه یافت نشد' };
    const item = meeting.actionItems.find(i => i.id === itemId);
    if (!item) return { success: false, error: 'آیتم یافت نشد' };
    item.status = 'done';
    return { success: true };
  }
}

export class WorkflowUseCases {
  constructor(
    private workflows: Workflow[],
    private user: User,
    private auditLog: AuditEntry[]
  ) {}

  createWorkflow(data: Partial<Workflow>): { success: boolean; workflow?: Workflow; error?: string } {
    const newWf: Workflow = {
      id: crypto.randomUUID(),
      name: data.name || 'گردش کار جدید',
      steps: data.steps || [{ name: 'پیش‌نویس', assigneeRole: 'user' }, { name: 'تأیید', assigneeRole: 'manager' }],
      currentStep: 0,
      documents: 0,
      avgTime: '۰ روز',
      status: 'active',
      createdBy: this.user.id
    };
    this.workflows.push(newWf);
    this.auditLog.push(AuditDomainService.createAuditEntry(this.user, 'CreateWorkflow', newWf.name, 'success'));
    return { success: true, workflow: newWf };
  }

  advanceWorkflow(wfId: string): { success: boolean; error?: string } {
    const wf = this.workflows.find(w => w.id === wfId);
    if (!wf) return { success: false, error: 'گردش کار یافت نشد' };
    if (!WorkflowDomainService.canTransition(wf, this.user)) {
      return { success: false, error: 'شما مجوز انتقال مرحله ندارید' };
    }
    wf.currentStep = WorkflowDomainService.getNextStep(wf);
    return { success: true };
  }
}
