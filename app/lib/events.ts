// Custom event for notifying components of unread count changes
export const UNREAD_COUNT_CHANGED = 'unreadCountChanged';

export function dispatchUnreadCountChange() {
  window.dispatchEvent(new CustomEvent(UNREAD_COUNT_CHANGED));
}
