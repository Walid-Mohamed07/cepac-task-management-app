"use client";

import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { useGetNotificationsQuery } from "../lib/services/apiSlice";
import { closePanel, togglePanel } from "../lib/slices/notificationSlice";
import NotificationPanel from "./NotificationPanel";
import type { RootState } from "../lib/store";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Notification } from "../types";

const showToast = (notification: Notification) => {
  const { title, message, messageType } = notification;
  const options = { description: message };

  switch (messageType) {
    case "success":
      toast.success(title, options);
      break;
    case "error":
      toast.error(title, options);
      break;
    case "warning":
      toast.warning(title, options);
      break;
    case "info":
      toast.info(title, options);
      break;
    default:
      toast.info(title, options);
      break;
  }
};

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const { showPanel } = useAppSelector((state) => state.notifications);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { data: notifications = [] } = useGetNotificationsQuery(user!._id!, {
    skip: !user,
    pollingInterval: 20000,
  });

  console.log({ notifications });

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const prevNotificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    } else {
      const prevIds = new Set(prevNotificationsRef.current.map((n) => n._id));
      const newNotifications = notifications.filter((n) => !prevIds.has(n._id));

      newNotifications.forEach((notification) => {
        if (notification.read === false) {
          showToast(notification);
        }
      });
    }
    prevNotificationsRef.current = notifications;
  }, [notifications, isInitialLoad]);

  const unreadCount = notifications.filter((n) => n.read === false).length;

  return (
    <div className="relative">
      <button
        onClick={() => dispatch(togglePanel())}
        className="relative p-2 text-gray-300 hover:text-gray-600 cursor-pointer transition"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => dispatch(closePanel())}
        />
      )}
    </div>
  );
}
