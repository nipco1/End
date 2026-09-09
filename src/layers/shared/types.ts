// ============================================================
// Shared Layer - Types & Interfaces
// لایه مشترک - تعاریف نوع و اینترفیس‌ها
// ============================================================

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  department: string;
  avatar?: string;
  permissions: string[];
}

export interface Document {
  id: string;
  title: string;
  persianTitle?: string;
  code: string;
  type: string;
  size: string;
  sizeBytes: number;
  status: DocumentStatus;
  dept: string;
  date: string;
  version: string;
  hash: string;
  sha256: string;
  mimeType: string;
  storageClass: StorageTier;
  ocrStatus: 'pending' | 'processing' | 'completed' | 'failed';
  aiStatus: 'none' | 'processing' | 'completed';
  downloadCount: number;
  viewCount: number;
  tags: string[];
  owner: string;
  approver?: string;
  confidentialLevel: 'public' | 'internal' | 'confidential';
  retentionPolicy?: string;
  relatedDocs: string[];
  file?: File;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type DocumentStatus = 'draft' | 'review' | 'approved' | 'published' | 'rejected' | 'obsolete' | 'archived';

export type StorageTier = 'hot' | 'warm' | 'cold';

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  status: 'upcoming' | 'completed' | 'cancelled';
  minutes?: string;
  decisions?: string[];
  actionItems: ActionItem[];
  hasRecording: boolean;
  attachments: string[];
  createdBy: string;
  createdAt: Date;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  deadline: string;
  status: 'pending' | 'done' | 'overdue';
  meetingId: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  currentStep: number;
  documents: number;
  avgTime: string;
  status: 'active' | 'inactive' | 'draft';
  createdBy: string;
}

export interface WorkflowStep {
  name: string;
  assigneeRole: string;
  sla?: number;
}

export interface AuditEntry {
  id: string;
  time: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  ip: string;
  device: string;
  status: 'success' | 'failed' | 'warning';
  details?: string;
  correlationId: string;
}

export interface StorageStats {
  totalCapacity: number;
  usedCapacity: number;
  freeCapacity: number;
  hotStorage: number;
  warmStorage: number;
  coldStorage: number;
  duplicateSize: number;
  monthlyGrowth: number;
  projectedFullDate: string;
}

export interface KnowledgeNode {
  id: string;
  name: string;
  code: string;
  icon: string;
  docCount: number;
  parentId?: string;
  children?: KnowledgeNode[];
  owner?: string;
  permissions?: string[];
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

export interface Setting {
  key: string;
  label: string;
  value: any;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  options?: string[];
  description?: string;
  category: string;
}
