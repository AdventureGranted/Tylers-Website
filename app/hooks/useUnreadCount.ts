import { useState, useEffect } from 'react';
import { UNREAD_COUNT_CHANGED } from '@/app/lib/events';

export function useUnreadCount(isAdmin: boolean) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/contact/unread');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnread();
    window.addEventListener(UNREAD_COUNT_CHANGED, fetchUnread);
    const interval = setInterval(fetchUnread, 60000);

    return () => {
      clearInterval(interval);
      window.removeEventListener(UNREAD_COUNT_CHANGED, fetchUnread);
    };
  }, [isAdmin]);

  return unreadCount;
}
