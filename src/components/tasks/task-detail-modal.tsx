'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { overlay } from 'overlay-kit';
import { TaskDetail } from '@/components/tasks/task-detail';

function TaskDetailModal({
  taskId,
  open,
  onClose,
  onExited
}: {
  taskId: string;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence onExitComplete={onExited}>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-4xl rounded-2xl bg-[#F5F5F7] shadow-xl"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-center justify-between rounded-t-2xl border-b border-black/[0.08] bg-white px-5 py-3">
              <h1 className="text-[15px] font-semibold text-[#1D1D1F]">업무 상세</h1>
              <div className="flex items-center gap-1">
                <Link
                  href={`/tasks/${taskId}`}
                  className="flex h-9 items-center rounded-lg px-3 text-[13px] font-medium text-[#0071E3] transition-colors hover:bg-[#F5F5F7]"
                  onClick={onClose}
                >
                  전체 화면
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="닫기"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-[#6E6E73] transition-colors hover:bg-[#F5F5F7]"
                >
                  ×
                </button>
              </div>
            </header>
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
              <TaskDetail taskId={taskId} />
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export function openTaskDetailModal(taskId: string) {
  overlay.open(({ isOpen, close, unmount }) => (
    <TaskDetailModal taskId={taskId} open={isOpen} onClose={close} onExited={unmount} />
  ));
}
