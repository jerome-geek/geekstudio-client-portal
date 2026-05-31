import Link from 'next/link';
import type { DoorayTask } from '@/shared/models/task';

export function TaskCard({ task }: { task: DoorayTask }) {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-base font-semibold text-ink">{task.title}</p>
      {task.body ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/60">{task.body}</p> : null}
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-coral">
        {task.status?.name ?? '미분류'}
      </p>
    </Link>
  );
}
