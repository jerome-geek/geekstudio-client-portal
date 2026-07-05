'use client';

import { useState } from 'react';
import { useTaskCommentsQuery } from '@/hooks/query/use-task-comments-query';
import { useCreateTaskCommentMutation } from '@/hooks/mutation/use-create-task-comment-mutation';
import { formatDate } from '@/shared/lib/utils';

export function TaskComments({ taskId }: { taskId: string }) {
  const { data: comments = [], isLoading } = useTaskCommentsQuery(taskId);
  const mutation = useCreateTaskCommentMutation(taskId);
  const [body, setBody] = useState('');

  return (
    <section className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <h2 className="text-xl font-semibold text-[#1D1D1F]">
        댓글 <span className="text-[#6E6E73]">{comments.length}</span>
      </h2>
      <div className="mt-4 space-y-2">
        {isLoading ? <p className="text-sm text-[#6E6E73]">댓글 불러오는 중…</p> : null}
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-xl bg-[#F5F5F7] p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#1D1D1F]">
              {comment.body}
            </p>
            {comment.createdAt ? (
              <p className="mt-2 text-xs text-[#6E6E73]">{formatDate(comment.createdAt)}</p>
            ) : null}
          </article>
        ))}
        {!comments.length && !isLoading ? (
          <div className="rounded-xl border border-dashed border-black/10 p-4 text-sm text-[#6E6E73]">
            아직 댓글이 없습니다.
          </div>
        ) : null}
      </div>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!body.trim()) {
            return;
          }
          mutation.mutate(
            { body: body.trim() },
            {
              onSuccess: () => setBody('')
            }
          );
        }}
      >
        {mutation.isError ? (
          <p className="text-[13px] text-[#FF3B30]">
            등록 실패: {mutation.error instanceof Error ? mutation.error.message : '다시 시도해 주세요.'}
          </p>
        ) : null}
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="댓글을 남겨보세요"
          className="min-h-24 w-full rounded-[10px] border border-black/[0.08] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0071E3]/30"
          required
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-11 rounded-lg bg-[#0071E3] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED] disabled:opacity-50"
        >
          {mutation.isPending ? '등록 중…' : '댓글 등록'}
        </button>
      </form>
    </section>
  );
}
