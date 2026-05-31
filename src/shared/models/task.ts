export interface DoorayTaskStatus {
  id: string;
  name: string;
}

export interface DoorayTask {
  id: string;
  title: string;
  body?: string;
  status?: DoorayTaskStatus;
  createdAt?: string;
}

export interface DoorayTaskComment {
  id: string;
  body: string;
  createdAt?: string;
}

export interface DoorayTaskAttachment {
  id: string;
  name: string;
  url?: string;
}

export interface DoorayTaskBoardGroup {
  statusId: string;
  statusName: string;
  tasks: DoorayTask[];
}
