import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex border-t border-gray-300 p-4"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="mr-4 flex-grow rounded-full border border-gray-300 px-4 py-2"
      />
      <button
        type="submit"
        className="cursor-pointer rounded-full border-none bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
