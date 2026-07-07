'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { openTaskDetailModal } from '@/components/tasks/task-detail-modal';
import { formatDate } from '@/shared/lib/utils';

export function NotificationBell() {
  const { items, unreadCount, markAllRead, markRead, requestPermission } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        aria-label="알림"
        onClick={() => {
          setOpen((current) => !current);
          requestPermission();
        }}
        className="relative rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-[#1C2434]">알림</h3>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs font-medium text-[#3C50E0] hover:underline"
                >
                  모두 읽음
                </button>
              ) : null}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length ? (
                items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      markRead(item.id);
                      setOpen(false);
                      openTaskDetailModal(item.taskId);
                    }}
                    className={`block w-full border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      item.read ? 'opacity-60' : ''
                    }`}
                  >
                    <p className="text-[13px] leading-snug text-[#1C2434]">
                      {!item.read ? (
                        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#3C50E0] align-middle" />
                      ) : null}
                      {item.message}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">{formatDate(item.createdAt)}</p>
                  </button>
                ))
              ) : (
                <p className="px-4 py-8 text-center text-sm text-gray-400">
                  새 알림이 없습니다.
                </p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
