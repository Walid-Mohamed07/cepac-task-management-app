import { useState, useEffect, useRef } from "react";
import type { User } from "../types";

interface UserSelectProps {
  users: User[];
  isLoading: boolean;
  value: string;
  onChange: (userId: string) => void;
}

export default function UserSelect({
  users,
  isLoading,
  value,
  onChange,
}: UserSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedUser = users.find((u) => u._id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (userId: string) => {
    onChange(userId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-left flex items-center justify-between"
      >
        {selectedUser ? (
          <div className="flex items-center gap-2">
            <img
              className="size-6 rounded-full"
              src={`${import.meta.env.VITE_STORAGE_PATH}${
                selectedUser.profilePicture || "unknown.webp"
              }`}
              alt={selectedUser.name}
            />
            <span>{selectedUser.name}</span>
          </div>
        ) : (
          <span className="text-gray-500">
            {isLoading ? "Loading users..." : "Select a user"}
          </span>
        )}
        <svg
          className="w-5 h-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => handleSelect(user._id)}
              className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 flex items-center gap-2"
            >
              <img
                className="size-6 rounded-full"
                src={`${import.meta.env.VITE_STORAGE_PATH}${
                  user.profilePicture || "unknown.webp"
                }`}
                alt={user.name}
              />
              <span className="font-normal block truncate">{user.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
