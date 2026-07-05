export type WorkflowClass = 'registered' | 'working' | 'closed';

export interface DoorayTaskStatus {
  id: string;
  name: string;
  class?: WorkflowClass;
  order?: number;
}

export interface DoorayTask {
  id: string;
  title: string;
  body?: string;
  bodyMimeType?: string;
  status?: DoorayTaskStatus;
  taskNumber?: string;
  number?: number;
  priority?: string;
  closed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  dueDate?: string | null;
  fileIds?: string[];
}

export interface DoorayTaskComment {
  id: string;
  body: string;
  createdAt?: string;
  creatorType?: string;
}

export interface DoorayTaskAttachment {
  id: string;
  name: string;
  size?: number;
  mimeType?: string;
  createdAt?: string;
  url?: string;
}

export interface DoorayTaskBoardGroup {
  statusId: string;
  statusName: string;
  statusClass?: WorkflowClass;
  tasks: DoorayTask[];
}
