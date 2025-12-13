import React, { useEffect, useRef } from "react";
import type { MESSAGE } from "../types/messenger";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: MESSAGE[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list-container">
      {messages.map((message) => (
        <MessageItem
          key={message._id}
          message={message}
          currentUserId={currentUserId}
        />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
