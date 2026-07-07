import { describe, expect, it } from 'vitest';
import { diffSnapshots, type TaskSnapshot } from '@/shared/lib/notifications';

const base: TaskSnapshot = {
  id: 'task-1',
  title: '로그인 버튼 수정',
  taskNumber: '데모/1',
  statusId: 'todo',
  statusName: '할 일',
  commentCount: 2
};

describe('diffSnapshots', () => {
  it('첫 로딩(prev=null)은 알림을 만들지 않는다', () => {
    expect(diffSnapshots(null, [base])).toEqual([]);
  });

  it('변화가 없으면 알림이 없다', () => {
    expect(diffSnapshots([base], [base])).toEqual([]);
  });

  it('새 업무를 감지한다', () => {
    const added: TaskSnapshot = { ...base, id: 'task-2', title: '새 요청' };
    const items = diffSnapshots([base], [base, added]);
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('task-created');
    expect(items[0].taskId).toBe('task-2');
  });

  it('상태 변경을 감지한다', () => {
    const moved: TaskSnapshot = { ...base, statusId: 'done', statusName: '완료' };
    const items = diffSnapshots([base], [moved]);
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('status-changed');
    expect(items[0].message).toContain('할 일');
    expect(items[0].message).toContain('완료');
  });

  it('댓글 증가를 감지한다', () => {
    const commented: TaskSnapshot = { ...base, commentCount: 4 };
    const items = diffSnapshots([base], [commented]);
    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('comment-added');
    expect(items[0].message).toContain('2개');
  });

  it('댓글 감소(삭제)는 알림을 만들지 않는다', () => {
    const removed: TaskSnapshot = { ...base, commentCount: 1 };
    expect(diffSnapshots([base], [removed])).toEqual([]);
  });

  it('상태 변경과 댓글 증가가 동시에 있으면 둘 다 만든다', () => {
    const both: TaskSnapshot = { ...base, statusId: 'done', statusName: '완료', commentCount: 3 };
    const items = diffSnapshots([base], [both]);
    expect(items.map((item) => item.type).sort()).toEqual(['comment-added', 'status-changed']);
  });
});
