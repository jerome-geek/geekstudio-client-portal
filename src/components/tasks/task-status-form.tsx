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
  const mutation = useUpdateTaskStatusMutation(taskId);

  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#fcfaf6] p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        mutation.mutate(String(formData.get('statusId')));
      }}
    >
      <label className="text-sm font-semibold text-ink">상태 변경</label>
      <div className="flex gap-3">
        <select
          name="statusId"
          defaultValue={currentStatusId}
          className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white"
        >
          반영
        </button>
      </div>
    </form>
  );
}
