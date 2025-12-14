import React, { useMemo, useState, useRef, useEffect } from "react";
import type { MESSAGE, REACTION } from "../types/messenger";
import { useReactToMessageMutation } from "../lib/services/apiSlice";
import ReactionPicker from "./shared/ReactionPicker";
import { formatDate } from "../utils/formatDate";

interface MessageItemProps {
  message: MESSAGE;
  currentUserId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
}) => {
  const sender = message.senderId;

  const [reactToMessage] = useReactToMessageMutation();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const isSentByCurrentUser = message.senderId._id === currentUserId;

  const reactionsByEmoji = useMemo(() => {
    const m = new Map<string, REACTION[]>();
    (message.reactions || []).forEach((r) => {
      const arr = m.get(r.emoji) || [];
      arr.push(r);
      m.set(r.emoji, arr);
    });
    return m;
  }, [message.reactions]);

  const currentUserReaction = (message.reactions || []).find(
    (r) => r.userId?._id === currentUserId
  );

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setShowPopup(false);
        setShowPicker(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  return (
    <div
      className={`flex max-w-[80%] items-center  gap-2 ${
        isSentByCurrentUser
          ? "flex-row-reverse items-center self-end"
          : "items-center self-start"
      }`}
    >
      <img
        src={`${import.meta.env.VITE_STORAGE_PATH}${sender?.profilePicture}`}
        alt={sender?.name || "Unknown"}
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="relative" ref={wrapperRef}>
        <p
          className={`${
            isSentByCurrentUser ? "text-end" : "text-start"
          } text-xs text-neutral-400 px-4 py-1`}
        >
          {sender?.name || "Unknown"}
        </p>
        <div
          className={`flex items-center ${
            isSentByCurrentUser
              ? "flex-row-reverse ms-auto"
              : "flex-row me-auto"
          } gap-2 w-fit`}
        >
          <div
            className={`w-fit rounded-2xl px-4 py-2 ${
              isSentByCurrentUser
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            <p className="m-0 max-w-max text-wrap wrap-anywhere">
              {message.content}
            </p>
          </div>

          {/* picker next to message content - acts to add/remove reaction for current user */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPicker((s) => !s);
                setShowPopup(false);
              }}
              className="text-sm px-2 py-1 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer"
              aria-label="Add reaction"
            >
              😊
            </button>
            {showPicker && (
              <div
                className={`absolute bottom-10 ${
                  isSentByCurrentUser ? "right-0" : "left-0"
                } z-50 w-max`}
              >
                <ReactionPicker
                  onSelect={async (emoji) => {
                    try {
                      if (currentUserReaction) {
                        if (currentUserReaction.emoji === emoji) {
                          await reactToMessage({
                            id: message._id,
                            emoji,
                            action: "remove",
                          });
                        } else {
                          await reactToMessage({
                            id: message._id,
                            emoji: currentUserReaction.emoji,
                            action: "remove",
                          });
                          await reactToMessage({
                            id: message._id,
                            emoji,
                            action: "add",
                          });
                        }
                      } else {
                        await reactToMessage({
                          id: message._id,
                          emoji,
                          action: "add",
                        });
                      }
                    } catch (err) {
                      console.error(err);
                    }
                    setShowPicker(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {/* Reactions list */}
        <div
          className={`flex items-center gap-2 px-2 ${
            isSentByCurrentUser ? "justify-self-end" : ""
          }`}
        >
          {Array.from(reactionsByEmoji.entries()).map(([emoji, arr]) => {
            const userReacted = arr.some((r) => r.userId._id === currentUserId);
            return (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEmoji(emoji);
                  setShowPopup(true);
                }}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-sm ${
                  userReacted ? "ring-1 ring-blue-400" : "bg-gray-100"
                }`}
              >
                <span className="text-lg leading-none">{emoji}</span>
                <span className="text-xs text-neutral-600">{arr.length}</span>
              </button>
            );
          })}
        </div>
        <p
          className={`${
            isSentByCurrentUser ? "text-end" : "text-start"
          } text-center text-xs text-neutral-400 px-4 py-1`}
        >
          {formatDate(message.createdAt)}
        </p>
        {/* Popup showing reactors for selected emoji */}
        {showPopup && selectedEmoji && (
          <div
            className="absolute bottom-12 left-0 z-50 w-56 rounded-lg bg-white shadow-lg p-2"
            onMouseLeave={() => setShowPopup(false)}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">{selectedEmoji}</span>
              <span className="text-sm text-neutral-600">
                {(reactionsByEmoji.get(selectedEmoji) || []).length} reacts
              </span>
            </div>
            <div className="max-h-48 overflow-auto">
              {(reactionsByEmoji.get(selectedEmoji) || []).map((r) => (
                <div key={r._id} className="flex items-center gap-2 py-1">
                  <img
                    src={`${import.meta.env.VITE_STORAGE_PATH}${
                      r.userId?.profilePicture
                    }`}
                    alt={r.userId?.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <div className="w-full flex justify-between items-center text-sm">
                    <div className="font-medium text-black">
                      {r.userId?.name}
                    </div>
                    <div className="text-xs text-neutral-500">{r.emoji}</div>
                  </div>
                  {r.userId._id === currentUserId && (
                    <div className="text-xs text-blue-500">you</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
