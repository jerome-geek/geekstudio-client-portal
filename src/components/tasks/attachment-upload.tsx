'use client';

import { useState } from 'react';
import { useUploadTaskAttachmentMutation } from '@/hooks/mutation/use-upload-task-attachment-mutation';

export function AttachmentUpload({ taskId }: { taskId: string }) {
  const mutation = useUploadTaskAttachmentMutation(taskId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <section className="rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">첨부파일</h2>
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (selectedFile) {
            mutation.mutate(selectedFile);
          }
        }}
      >
        <input
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          className="flex-1 rounded-xl border border-black/10 bg-[#fcfaf6] px-4 py-3 text-sm"
        />
        <button type="submit" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">
          업로드
        </button>
      </form>
      {mutation.data ? <p className="mt-3 text-sm text-black/60">최근 업로드: {mutation.data.name}</p> : null}
    </section>
  );
}
