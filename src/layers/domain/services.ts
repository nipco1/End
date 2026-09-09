// ============================================================
// Domain Layer - Entities & Business Rules
// لایه دامنه - موجودیت‌ها و قوانین کسب‌وکار
// ============================================================

import { Document, User, Meeting, Workflow, AuditEntry, KnowledgeNode, DocumentStatus } from '../shared/types';

// Domain Services
export class DocumentDomainService {
  static canApprove(doc: Document, user: User): boolean {
    return user.permissions.includes('Approve') && 
           doc.status === 'review' &&
           doc.confidentialLevel !== 'confidential' || user.permissions.includes('ApproveConfidential');
  }

  static canDelete(doc: Document, user: User): boolean {
    if (doc.status === 'approved' || doc.status === 'published') {
      return user.permissions.includes('DeleteApprove');
    }
    return user.permissions.includes('DeleteRequest');
  }

  static canEdit(doc: Document, user: User): boolean {
    return user.permissions.includes('EditMetadata') || 
           user.permissions.includes('EditFile') ||
           doc.createdBy === user.id;
  }

  static validateStatusTransition(current: DocumentStatus, next: DocumentStatus): boolean {
    const validTransitions: Record<DocumentStatus, DocumentStatus[]> = {
      'draft': ['review', 'archived'],
      'review': ['approved', 'rejected', 'draft'],
      'approved': ['published', 'review', 'obsolete'],
      'published': ['obsolete', 'archived'],
      'rejected': ['draft', 'review'],
      'obsolete': ['archived'],
      'archived': []
    };
    return validTransitions[current]?.includes(next) || false;
  }

  static generateDocumentCode(type: string, dept: string): string {
    const prefix = type.substring(0, 3).toUpperCase();
    const deptCode = dept.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DOC-${deptCode}-${prefix}-${random}`;
  }

  static calculateHash(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const hash = this.simpleHash(buffer);
        resolve(hash);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  private static simpleHash(buffer: ArrayBuffer): string {
    const view = new Uint8Array(buffer);
    let hash = 0;
    for (let i = 0; i < view.length; i++) {
      hash = ((hash << 5) - hash) + view[i];
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

export class StorageDomainService {
  static canUpload(user: User, fileSize: number): boolean {
    const maxUpload = 500 * 1024 * 1024; // 500MB
    return user.permissions.includes('Upload') && fileSize <= maxUpload;
  }

  static isDuplicate(hash: string, existingDocs: Document[]): boolean {
    return existingDocs.some(doc => doc.sha256 === hash);
  }

  static determineStorageTier(fileSize: number, lastAccess: Date): 'hot' | 'warm' | 'cold' {
    const daysSinceAccess = (Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24);
    
    if (fileSize < 10 * 1024 * 1024 && daysSinceAccess < 30) return 'hot';
    if (fileSize < 100 * 1024 * 1024 && daysSinceAccess < 180) return 'warm';
    return 'cold';
  }

  static shouldCompress(mimeType: string, fileSize: number): boolean {
    const alreadyCompressed = ['image/jpeg', 'image/png', 'video/mp4', 'application/zip', 'application/x-rar'];
    return !alreadyCompressed.includes(mimeType) && fileSize > 1024 * 1024;
  }
}

export class WorkflowDomainService {
  static canTransition(workflow: Workflow, user: User): boolean {
    const currentStep = workflow.steps[workflow.currentStep];
    return user.role === currentStep.assigneeRole || user.permissions.includes('ManageWorkflow');
  }

  static getNextStep(workflow: Workflow): number {
    return Math.min(workflow.currentStep + 1, workflow.steps.length - 1);
  }

  static isComplete(workflow: Workflow): boolean {
    return workflow.currentStep >= workflow.steps.length - 1;
  }
}

export class AuditDomainService {
  static createAuditEntry(
    user: User,
    action: string,
    entity: string,
    status: 'success' | 'failed' | 'warning',
    details?: string
  ): AuditEntry {
    return {
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString('fa-IR'),
      user: user.fullName,
      role: user.role,
      action,
      entity,
      ip: '192.168.1.' + Math.floor(Math.random() * 255),
      device: 'Desktop',
      status,
      details,
      correlationId: crypto.randomUUID()
    };
  }
}
