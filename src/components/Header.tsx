import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../lib/slices/authSlice";
import type { RootState } from "../lib/store";
import "../styles/header.css";
import NotificationBell from "./NotificationBell";
import { Toaster } from "sonner";

// A default profile picture for users without one
// import DefaultProfilePicture from "/media/images/profilePicture/unknown.webp";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="app-header">
      <Toaster richColors position="bottom-right" />
      <div className="header-wrapper">
        <div className="header-left">
          <h1 className="app-title">TaskFlow</h1>
        </div>

        <div className="header-right">
          {/* Welcome Message */}
          <div className="welcome-section">
            <span className="welcome-text">
              Welcome back, <strong>{user?.name || "User"}</strong>
            </span>
          </div>

          {/* Notifications */}
          <div className="notifications-container">
            <NotificationBell />
          </div>

          {/* User Profile */}
          <div className="user-profile-container">
            <button
              className="user-profile-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <img
                src={`${import.meta.env.VITE_STORAGE_PATH}${
                  user?.profilePicture
                }`}
                alt="User profile"
                className="user-profile-img"
              />
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <div className="user-info">
                  <p className="user-name">{user?.name || "User"}</p>
                </div>
                <ul className="user-menu-list">
                  <li className="user-menu-item">
                    <button
                      className="logout-btn"
                      onClick={handleLogout}
                      title="Sign out"
                    >
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
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
