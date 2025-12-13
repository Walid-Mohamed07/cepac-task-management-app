import type { Notification } from "../types";
import { useMarkNotificationAsReadMutation } from "../lib/services/apiSlice";
import { formatDate } from "../utils/formatDate";

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

const typeIcons = {
  error: "❌",
  success: "✅",
  warning: "⚠️",
  task: "📋",
  info: "ℹ️",
};

export default function NotificationPanel({
  notifications,
  onClose,
}: NotificationPanelProps) {
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border-b border-gray-100 p-4 hover:bg-gray-50 transition ${
                notification.read === false ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  {typeIcons[notification.type as keyof typeof typeIcons] ||
                    "ℹ️"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </div>
              {notification.read === false && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    Mark as read
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
