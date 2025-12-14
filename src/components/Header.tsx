import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../lib/slices/authSlice";
import type { RootState } from "../lib/store";
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
    <header className="sticky top-0 z-[100] border-b border-gray-700 bg-black shadow-md">
      <Toaster richColors position="bottom-right" />
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <div className="flex-1">
          <h1 className="m-0 text-2xl font-bold tracking-tight text-blue-500">
            TaskFlow
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* Welcome Message */}
          <div className="hidden items-center md:flex">
            <span className="text-sm text-gray-400">
              Welcome back,{" "}
              <strong className="font-semibold text-white">
                {user?.name || "User"}
              </strong>
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <NotificationBell />
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              className="h-[46px] w-[46px] cursor-pointer overflow-hidden rounded-full border-2 border-transparent bg-transparent p-0 transition-colors duration-200 hover:border-blue-500"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <img
                src={`${import.meta.env.VITE_STORAGE_PATH}${
                  user?.profilePicture
                }`}
                alt="User profile"
                className="h-full w-full object-cover"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full z-[1000] mt-2 min-w-[200px] rounded-lg border border-gray-700 bg-[#3d3d3d] shadow-lg">
                <div className="border-b border-gray-700 px-4 py-3">
                  <p className="m-0 text-sm font-semibold text-white">
                    {user?.name || "User"}
                  </p>
                </div>
                <ul className="m-0 list-none p-2">
                  <li>
                    <button
                      className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] font-medium text-red-400 transition-all duration-200 md:px-3 md:py-2"
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
                      <span className="hidden md:inline">Logout</span>
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
