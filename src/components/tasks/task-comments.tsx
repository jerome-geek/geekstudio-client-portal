'use client';

import { useState } from 'react';
import { useTaskCommentsQuery } from '@/hooks/query/use-task-comments-query';
import { useCreateTaskCommentMutation } from '@/hooks/mutation/use-create-task-comment-mutation';

export function TaskComments({ taskId }: { taskId: string }) {
  const { data: comments = [], isLoading } = useTaskCommentsQuery(taskId);
  const mutation = useCreateTaskCommentMutation(taskId);
  const [body, setBody] = useState('');

  return (
    <section className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">댓글</h2>
      <div className="mt-4 space-y-3">
        {isLoading ? <p className="text-sm text-black/50">댓글 불러오는 중...</p> : null}
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-2xl border border-black/10 bg-[#fcfaf6] p-4">
            <p className="text-sm leading-6 text-black/75">{comment.body}</p>
          </article>
        ))}
        {!comments.length && !isLoading ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-4 text-sm text-black/45">
            아직 댓글이 없습니다.
          </div>
        ) : null}
      </div>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(
            { body },
            {
              onSuccess: () => setBody('')
            }
          );
        }}
      >
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="고객사 코멘트를 남겨보세요"
          className="min-h-28 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
          required
        />
        <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          댓글 등록
        </button>
      </form>
    </section>
  );
}
