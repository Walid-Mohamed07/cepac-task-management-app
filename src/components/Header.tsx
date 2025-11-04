import { useState } from "react";
import "../styles/header.css";

export default function Header({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void;
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: "Task assigned to you", time: "5 min ago", read: false },
    { id: 2, message: "Subtask completed", time: "2 hours ago", read: true },
    { id: 3, message: "Project updated", time: "1 day ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="app-header">
      <div className="header-wrapper">
        <div className="header-left">
          <h1 className="app-title">TaskFlow</h1>
        </div>

        <div className="header-right">
          {/* Welcome Message */}
          <div className="welcome-section">
            <span className="welcome-text">
              Welcome back, <strong>{userName || "User"}</strong>
            </span>
          </div>

          {/* Notifications */}
          <div className="notifications-container">
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M15.5 1.5H4.5C3.95 1.5 3.5 1.95 3.5 2.5V12.5C3.5 13.05 3.95 13.5 4.5 13.5H6.5L10 17.5L13.5 13.5H15.5C16.05 13.5 16.5 13.05 16.5 12.5V2.5C16.5 1.95 16.05 1.5 15.5 1.5Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowNotifications(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-item ${
                          notif.read ? "read" : "unread"
                        }`}
                      >
                        <div className="notification-content">
                          <p>{notif.message}</p>
                          <span className="notification-time">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="empty-message">No notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button className="logout-btn" onClick={onLogout} title="Sign out">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M7 16H2C1.45 16 1 15.55 1 15V3C1 2.45 1.45 2 2 2H7M12 12L16 8M16 8L12 4M16 8H7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
