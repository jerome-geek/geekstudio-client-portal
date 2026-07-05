import type {
  DoorayTask,
  DoorayTaskAttachment,
  DoorayTaskComment,
  DoorayTaskStatus,
  WorkflowClass
} from '@/shared/models/task';

export interface DoorayWorkflowRaw {
  id: string;
  name: string;
  order?: number;
  class?: WorkflowClass;
}

export interface DoorayPostRaw {
  id: string;
  subject: string;
  body?: { mimeType?: string; content?: string };
  taskNumber?: string;
  number?: number;
  priority?: string;
  closed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string | null;
  workflowClass?: WorkflowClass;
  workflow?: { id: string; name: string };
  fileIdList?: string[];
}

export interface DoorayLogRaw {
  id: string;
  type?: string;
  createdAt?: string;
  creator?: { type?: string };
  body?: { mimeType?: string; content?: string };
}

export interface DoorayFileRaw {
  id: string;
  name: string;
  size?: number;
  mimeType?: string;
  createdAt?: string;
}

export function toTaskStatus(raw: DoorayWorkflowRaw): DoorayTaskStatus {
  return { id: raw.id, name: raw.name, class: raw.class, order: raw.order };
}

export function toTask(raw: DoorayPostRaw): DoorayTask {
  return {
    id: raw.id,
    title: raw.subject,
    body: raw.body?.content,
    bodyMimeType: raw.body?.mimeType,
    status: raw.workflow
      ? { id: raw.workflow.id, name: raw.workflow.name, class: raw.workflowClass }
      : undefined,
    taskNumber: raw.taskNumber,
    number: raw.number,
    priority: raw.priority,
    closed: raw.closed,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    dueDate: raw.dueDate,
    fileIds: raw.fileIdList
  };
}

export function toComment(raw: DoorayLogRaw): DoorayTaskComment {
  return {
    id: raw.id,
    body: raw.body?.content ?? '',
    createdAt: raw.createdAt,
    creatorType: raw.creator?.type
  };
}

export function toAttachment(raw: DoorayFileRaw): DoorayTaskAttachment {
  return {
    id: raw.id,
    name: raw.name,
    size: raw.size,
    mimeType: raw.mimeType,
    createdAt: raw.createdAt
  };
}
