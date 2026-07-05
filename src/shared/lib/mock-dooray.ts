import type {
  DoorayTask,
  DoorayTaskAttachment,
  DoorayTaskComment,
  DoorayTaskStatus
} from '@/shared/models/task';
import type { CreateTaskCommentInput, CreateTaskInput } from '@/entities/task/model/types';

const statuses: DoorayTaskStatus[] = [
  { id: 'todo', name: '할 일', class: 'registered', order: 100 },
  { id: 'doing', name: '진행 중', class: 'working', order: 200 },
  { id: 'review', name: '고객확인필요', class: 'working', order: 300 },
  { id: 'done', name: '완료', class: 'closed', order: 400 }
];

let taskSeq = 3;

let tasks: DoorayTask[] = [
  {
    id: 'task-1',
    title: '메인 화면 문구 수정 요청',
    body: '홈 화면 첫 문단을 서비스 소개 중심으로 다듬고 싶습니다.',
    status: statuses[0],
    taskNumber: '데모/1',
    number: 1,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: '고객용 로그인 버튼 위치 조정',
    body: '모바일에서 로그인 버튼이 너무 아래에 있어 상단으로 올려야 합니다.',
    status: statuses[1],
    taskNumber: '데모/2',
    number: 2,
    priority: 'normal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: '정산 페이지 문구 최종 확인',
    body: '배포 전 고객 확인이 필요합니다.',
    status: statuses[2],
    taskNumber: '데모/3',
    number: 3,
    priority: 'none',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const commentsByTaskId: Record<string, DoorayTaskComment[]> = {
  'task-1': [
    {
      id: 'comment-1',
      body: '확인했습니다. 오늘 중 초안 반영하겠습니다.',
      createdAt: new Date().toISOString()
    }
  ],
  'task-2': [],
  'task-3': [
    {
      id: 'comment-2',
      body: '고객사 확인 후 바로 완료 처리 예정입니다.',
      createdAt: new Date().toISOString()
    }
  ]
};

const attachmentsByTaskId: Record<string, DoorayTaskAttachment[]> = {
  'task-1': [],
  'task-2': [],
  'task-3': []
};

export function isMockDoorayMode() {
  return !process.env.DOORAY_BASE_URL || !process.env.DOORAY_API_TOKEN;
}

export function getMockTaskStatuses() {
  return statuses;
}

export function listMockTasks() {
  return tasks;
}

export function getMockTask(taskId: string) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
}

export function createMockTask(input: CreateTaskInput) {
  taskSeq += 1;
  const task: DoorayTask = {
    id: `task-${Date.now()}`,
    title: input.title,
    body: input.body,
    status: statuses[0],
    taskNumber: `데모/${taskSeq}`,
    number: taskSeq,
    priority: input.priority ?? 'none',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks = [task, ...tasks];
  commentsByTaskId[task.id] = [];
  attachmentsByTaskId[task.id] = [];
  return task;
}

export function listMockTaskComments(taskId: string) {
  return commentsByTaskId[taskId] ?? [];
}

export function createMockTaskComment(taskId: string, input: CreateTaskCommentInput) {
  const comment: DoorayTaskComment = {
    id: `comment-${Date.now()}`,
    body: input.body,
    createdAt: new Date().toISOString()
  };

  commentsByTaskId[taskId] = [...(commentsByTaskId[taskId] ?? []), comment];
  return comment;
}

export function updateMockTaskStatus(taskId: string, workflowId: string) {
  const nextStatus = statuses.find((status) => status.id === workflowId);

  if (!nextStatus) {
    throw new Error('Status not found');
  }

  tasks = tasks.map((task) =>
    task.id === taskId
      ? { ...task, status: nextStatus, updatedAt: new Date().toISOString() }
      : task
  );
  return getMockTask(taskId);
}

export function listMockTaskAttachments(taskId: string) {
  return attachmentsByTaskId[taskId] ?? [];
}

export function uploadMockTaskAttachment(taskId: string, file: File) {
  const attachment: DoorayTaskAttachment = {
    id: `attachment-${Date.now()}`,
    name: file.name,
    size: file.size,
    mimeType: file.type,
    createdAt: new Date().toISOString()
  };

  attachmentsByTaskId[taskId] = [...(attachmentsByTaskId[taskId] ?? []), attachment];
  return attachment;
}
