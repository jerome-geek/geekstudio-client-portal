export interface TaskSnapshot {
  id: string;
  title: string;
  taskNumber?: string;
  statusId?: string;
  statusName?: string;
  commentCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'task-created' | 'status-changed' | 'comment-added';
  taskId: string;
  message: string;
  createdAt: string;
  read: boolean;
}

/**
 * 이전/현재 스냅샷을 비교해 알림 목록을 만든다.
 * prev가 null이면 첫 로딩 — 기준선만 잡고 알림은 만들지 않는다.
 */
export function diffSnapshots(
  prev: TaskSnapshot[] | null,
  next: TaskSnapshot[],
  now: string = new Date().toISOString()
): NotificationItem[] {
  if (!prev) {
    return [];
  }

  const prevById = new Map(prev.map((task) => [task.id, task]));
  const items: NotificationItem[] = [];

  for (const task of next) {
    const before = prevById.get(task.id);
    const label = task.taskNumber ? `#${task.taskNumber}` : task.title;

    if (!before) {
      items.push({
        id: `${task.id}-created-${now}`,
        type: 'task-created',
        taskId: task.id,
        message: `새 업무가 등록되었습니다: ${task.title} (${label})`,
        createdAt: now,
        read: false
      });
      continue;
    }

    if (before.statusId && task.statusId && before.statusId !== task.statusId) {
      items.push({
        id: `${task.id}-status-${now}`,
        type: 'status-changed',
        taskId: task.id,
        message: `상태 변경: ${task.title} — ${before.statusName ?? '?'} → ${task.statusName ?? '?'}`,
        createdAt: now,
        read: false
      });
    }

    if (task.commentCount > before.commentCount) {
      const added = task.commentCount - before.commentCount;
      items.push({
        id: `${task.id}-comment-${now}`,
        type: 'comment-added',
        taskId: task.id,
        message: `새 댓글 ${added}개: ${task.title}`,
        createdAt: now,
        read: false
      });
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// localStorage 저장소 (클라이언트 전용)
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'portal-notifications-v1';
const MAX_ITEMS = 50;

interface NotificationStore {
  snapshot: TaskSnapshot[] | null;
  items: NotificationItem[];
}

export function loadStore(): NotificationStore {
  if (typeof window === 'undefined') {
    return { snapshot: null, items: [] };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as NotificationStore;
    }
  } catch {
    // 손상된 저장소는 초기화
  }
  return { snapshot: null, items: [] };
}

export function saveStore(store: NotificationStore) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...store, items: store.items.slice(0, MAX_ITEMS) })
  );
}

/**
 * 본인이 포털에서 수행한 변경(댓글·상태·생성)을 기준선에 즉시 반영해
 * 다음 폴링에서 자기 행동이 알림으로 뜨지 않게 한다.
 */
/** 본인이 생성한 업무를 기준선에 추가해 자기 생성 알림을 막는다. */
export function appendSnapshotTask(task: TaskSnapshot) {
  const store = loadStore();
  if (!store.snapshot) {
    return;
  }
  if (!store.snapshot.some((item) => item.id === task.id)) {
    store.snapshot = [task, ...store.snapshot];
    saveStore(store);
  }
}

export function bumpSnapshot(update: {
  taskId: string;
  comment?: boolean;
  statusId?: string;
  statusName?: string;
}) {
  const store = loadStore();
  if (!store.snapshot) {
    return;
  }
  store.snapshot = store.snapshot.map((task) => {
    if (task.id !== update.taskId) {
      return task;
    }
    return {
      ...task,
      commentCount: task.commentCount + (update.comment ? 1 : 0),
      statusId: update.statusId ?? task.statusId,
      statusName: update.statusName ?? task.statusName
    };
  });
  saveStore(store);
}
