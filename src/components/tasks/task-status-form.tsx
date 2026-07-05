'use client';

import type { DoorayTaskStatus } from '@/shared/models/task';
import { useUpdateTaskStatusMutation } from '@/hooks/mutation/use-update-task-status-mutation';

export function TaskStatusForm({
  taskId,
  statuses,
  currentStatusId
}: {
  taskId: string;
  statuses: DoorayTaskStatus[];
  currentStatusId?: string;
}) {
  const mutation = useUpdateTaskStatusMutation();

  return (
    <form
      className="flex flex-col gap-3 rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const workflowId = String(formData.get('workflowId'));
        const status = statuses.find((item) => item.id === workflowId);
        if (status) {
          mutation.mutate({ taskId, status });
        }
      }}
    >
      <label className="text-[15px] font-semibold text-[#1D1D1F]">상태 변경</label>
      {mutation.isError ? (
        <p className="text-[13px] text-[#FF3B30]">
          변경 실패: {mutation.error instanceof Error ? mutation.error.message : '다시 시도해 주세요.'}
        </p>
      ) : null}
      {mutation.isSuccess ? (
        <p className="text-[13px] text-[#34C759]">상태가 변경되었습니다.</p>
      ) : null}
      <div className="flex gap-2">
        <select
          name="workflowId"
          defaultValue={currentStatusId}
          key={currentStatusId}
          className="h-11 flex-1 rounded-[10px] border border-black/[0.08] bg-white px-3 text-sm"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-11 rounded-lg bg-[#0071E3] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED] disabled:opacity-50"
        >
          {mutation.isPending ? '변경 중…' : '반영'}
        </button>
      </div>
    </form>
  );
}
