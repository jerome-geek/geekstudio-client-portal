'use client';

import { useRef } from 'react';
import { useTaskAttachmentsQuery } from '@/hooks/query/use-task-attachments-query';
import { useUploadTaskAttachmentMutation } from '@/hooks/mutation/use-upload-task-attachment-mutation';

function formatSize(size?: number) {
  if (!size) {
    return '';
  }
  if (size < 1024) {
    return `${size}B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

export function AttachmentUpload({ taskId }: { taskId: string }) {
  const { data: attachments = [], isLoading } = useTaskAttachmentsQuery(taskId);
  const mutation = useUploadTaskAttachmentMutation(taskId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <h2 className="text-[15px] font-semibold text-[#1D1D1F]">
        첨부파일 <span className="text-[#6E6E73]">{attachments.length}</span>
      </h2>
      <div className="mt-3 space-y-1">
        {isLoading ? <p className="text-sm text-[#6E6E73]">불러오는 중…</p> : null}
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={`/api/tasks/${taskId}/attachments/${attachment.id}`}
            download={attachment.name}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#0071E3] transition-colors hover:bg-[#F5F5F7]"
          >
            <span className="truncate">{attachment.name}</span>
            <span className="ml-2 shrink-0 text-xs text-[#6E6E73]">
              {formatSize(attachment.size)}
            </span>
          </a>
        ))}
        {!attachments.length && !isLoading ? (
          <p className="rounded-lg border border-dashed border-black/10 p-3 text-[13px] text-[#6E6E73]">
            첨부파일이 없습니다.
          </p>
        ) : null}
      </div>
      {mutation.isError ? (
        <p className="mt-2 text-[13px] text-[#FF3B30]">
          업로드 실패: {mutation.error instanceof Error ? mutation.error.message : '다시 시도해 주세요.'}
        </p>
      ) : null}
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const file = fileInputRef.current?.files?.[0];
          if (file) {
            mutation.mutate(file, {
              onSuccess: () => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }
            });
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="min-w-0 flex-1 rounded-[10px] border border-black/[0.08] bg-[#F5F5F7] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-10 shrink-0 rounded-lg bg-[#0071E3] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED] disabled:opacity-50"
        >
          {mutation.isPending ? '업로드 중…' : '업로드'}
        </button>
      </form>
    </section>
  );
}
