import React from "react";
import type { MESSAGE } from "../types/messenger";
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
  console.log({ sender });

  const isSentByCurrentUser = message.senderId._id === currentUserId;

  return (
    <div
      className={`message-item ${isSentByCurrentUser ? "sent" : "received"}`}
    >
      <img
        src={`${import.meta.env.VITE_STORAGE_PATH}${sender?.profilePicture}`}
        alt={sender?.name || "Unknown"}
        className="avatar"
      />
      <div className="">
        <p className="message-sender-name text-xs text-neutral-400 text-center">
          {sender?.name || "Unknown"}
        </p>
        <div className="message-content">
          <p className="message-text">{message.content}</p>
        </div>
        <p className="message-timestamp text-neutral-400 text-center">
          {formatDate(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
