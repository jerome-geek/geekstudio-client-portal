import Link from 'next/link';
import type { DoorayTask } from '@/shared/models/task';

export function TaskCard({ task }: { task: DoorayTask }) {
  const taskNumber = task.id.replace(/\D/g, '') || task.id;

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-md border border-[#d7d7d7] bg-white px-6 py-7 shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition hover:border-[#c6c6c6]"
    >
      <p className="min-h-[86px] text-[20px] leading-[1.55] text-[#222]">{task.title}</p>
      <div className="mt-6 flex items-end justify-between">
        <p className="text-[20px] font-medium text-[#1c63ff]">{taskNumber}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff7ff] text-xs font-bold text-[#2a6cff]">
          G
        </span>
      </div>
    </Link>
  );
}
