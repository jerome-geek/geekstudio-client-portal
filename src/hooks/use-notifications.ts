'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { requestJson } from '@/shared/lib/fetcher';
import {
  diffSnapshots,
  loadStore,
  saveStore,
  type NotificationItem,
  type TaskSnapshot
} from '@/shared/lib/notifications';

const POLL_INTERVAL = 60_000;

export const notificationKeys = {
  snapshots: ['notifications', 'snapshots'] as const
};

function fireBrowserNotification(items: NotificationItem[]) {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }
  if (Notification.permission !== 'granted' || !document.hidden) {
    return;
  }
  for (const item of items.slice(0, 3)) {
    new Notification('긱스튜디오 고객 포털', { body: item.message, tag: item.id });
  }
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<NotificationItem[]>(() => loadStore().items);

  const { data } = useQuery({
    queryKey: notificationKeys.snapshots,
    queryFn: () => requestJson<TaskSnapshot[]>('/api/notifications'),
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: POLL_INTERVAL / 2,
    retry: false
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    const store = loadStore();
    const fresh = diffSnapshots(store.snapshot, data);
    const nextItems = fresh.length ? [...fresh, ...store.items] : store.items;
    saveStore({ snapshot: data, items: nextItems });
    if (fresh.length) {
      setItems(nextItems);
      fireBrowserNotification(fresh);
    }
  }, [data]);

  const markAllRead = useCallback(() => {
    const store = loadStore();
    const nextItems = store.items.map((item) => ({ ...item, read: true }));
    saveStore({ ...store, items: nextItems });
    setItems(nextItems);
  }, []);

  const markRead = useCallback((id: string) => {
    const store = loadStore();
    const nextItems = store.items.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
    saveStore({ ...store, items: nextItems });
    setItems(nextItems);
  }, []);

  const requestPermission = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: notificationKeys.snapshots });
  }, [queryClient]);

  return {
    items,
    unreadCount: items.filter((item) => !item.read).length,
    markAllRead,
    markRead,
    requestPermission,
    refresh
  };
}
