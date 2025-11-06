import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  closePanel,
} from "../lib/slices/notificationSlice";
import {
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} from "../lib/services/apiSlice";

const typeIcons = {
  error: "❌",
  success: "✅",
  warning: "⚠️",
  task: "📋",
  info: "ℹ️",
};

export default function NotificationPanel() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.notifications);
  const [markAsReadMutation] = useMarkNotificationAsReadMutation();
  const [deleteNotificationMutation] = useDeleteNotificationMutation();

  const handleMarkAsRead = async (id: string) => {
    dispatch(markAsRead(id));
    try {
      await markAsReadMutation(id).unwrap();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    dispatch(deleteNotification(id));
    try {
      await deleteNotificationMutation(id).unwrap();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <button
          onClick={() => dispatch(closePanel())}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Actions */}
      {items.length > 0 && (
        <div className="border-b border-gray-200 px-4 py-2 flex gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
          <button
            onClick={handleClearAll}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.map((notification: any) => (
            <div
              key={notification._id}
              className={`border-b border-gray-100 p-4 hover:bg-gray-50 transition ${
                notification.status === "unread" ? "bg-blue-50" : ""
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
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {notification.status === "unread" && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
