'use client';

import { useState } from 'react';
import { useCreateTaskMutation } from '@/hooks/mutation/use-create-task-mutation';

export function NewTaskForm() {
  const mutation = useCreateTaskMutation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <form
      className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(
          { title, body },
          {
            onSuccess: () => {
              setTitle('');
              setBody('');
            }
          }
        );
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">새 업무 요청</h2>
        {mutation.isPending ? <span className="text-xs text-black/50">등록 중...</span> : null}
      </div>
      <div className="mt-4 space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="업무 제목"
          className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none"
          required
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="업무 상세 설명"
          className="min-h-28 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
        >
          요청 등록
        </button>
      </div>
    </form>
  );
}
