'use client';

import { useState } from 'react';
import { useCreateTaskMutation } from '@/hooks/mutation/use-create-task-mutation';

const PRIORITY_OPTIONS = [
  { value: 'none', label: '우선순위 없음' },
  { value: 'highest', label: '최상' },
  { value: 'high', label: '높음' },
  { value: 'normal', label: '보통' },
  { value: 'low', label: '낮음' },
  { value: 'lowest', label: '최하' }
];

export function NewTaskForm({ onCreated }: { onCreated?: () => void }) {
  const mutation = useCreateTaskMutation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('none');
  const [files, setFiles] = useState<File[]>([]);

  return (
    <form
      className="rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) {
          return;
        }
        mutation.mutate(
          { title: title.trim(), body, priority, files },
          {
            onSuccess: () => {
              setTitle('');
              setBody('');
              setPriority('none');
              setFiles([]);
              onCreated?.();
            }
          }
        );
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1D1D1F]">새 업무 요청</h2>
        {mutation.isPending ? <span className="text-xs text-[#6E6E73]">등록 중…</span> : null}
      </div>
      {mutation.isError ? (
        <p className="mt-2 text-[13px] text-[#FF3B30]">
          등록 실패: {mutation.error instanceof Error ? mutation.error.message : '다시 시도해 주세요.'}
        </p>
      ) : null}
      <div className="mt-4 space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="업무 제목 (필수)"
          className="w-full rounded-[10px] border border-black/[0.08] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0071E3]/30"
          required
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="업무 상세 설명"
          className="min-h-28 w-full rounded-[10px] border border-black/[0.08] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0071E3]/30"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="h-11 rounded-[10px] border border-black/[0.08] bg-white px-3 text-sm"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="file"
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="flex-1 rounded-[10px] border border-black/[0.08] bg-[#F5F5F7] px-4 py-2.5 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-11 rounded-lg bg-[#0071E3] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED] disabled:opacity-50"
        >
          요청 등록
        </button>
      </div>
    </form>
  );
}
