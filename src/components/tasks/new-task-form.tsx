'use client';

import { useState } from 'react';
import { useCreateTaskMutation } from '@/hooks/mutation/use-create-task-mutation';

export function NewTaskForm() {
  const mutation = useCreateTaskMutation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <form
      className="rounded-md border border-[#dddddd] bg-white p-5"
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
        <h2 className="text-[18px] font-bold text-[#333]">새 업무 요청</h2>
        {mutation.isPending ? <span className="text-xs text-[#666]">등록 중...</span> : null}
      </div>
      <div className="mt-4 space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="업무 제목"
          className="w-full rounded-md border border-[#d9d9d9] px-4 py-3 text-sm outline-none"
          required
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="업무 상세 설명"
          className="min-h-28 w-full rounded-md border border-[#d9d9d9] px-4 py-3 text-sm outline-none"
        />
        <button type="submit" className="rounded-md bg-[#2f6fff] px-5 py-3 text-sm font-semibold text-white">
          요청 등록
        </button>
      </div>
    </form>
  );
}
