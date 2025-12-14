import React, { useState, useMemo } from "react";
import ConversationList from "../../components/ConversationList";
import MessageList from "../../components/MessageList";
import MessageInput from "../../components/MessageInput";
import type { User } from "../../types";
import { useAppSelector } from "../../lib/hooks";
import {
  useGetConversationsByUserQuery,
  useGetMessagesQuery,
  useCreateMessageMutation,
  useGetAllUsersQuery,
} from "../../lib/services/apiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import Loader from "../../components/shared/Loader";

const MessengerPage: React.FC = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const {
    data: conversations,
    isLoading: conversationsLoading,
    isError: conversationsError,
  } = useGetConversationsByUserQuery(currentUser?._id ?? skipToken);

  const {
    data: messages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useGetMessagesQuery(selectedConversationId ?? skipToken);

  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();

  const [createMessage] = useCreateMessageMutation();

  const usersMap = useMemo(() => {
    if (!users) return new Map<string, User>();
    // Assuming users is an array of User objects
    return (users as User[]).reduce((acc: Map<string, User>, user: User) => {
      acc.set(user._id, user);
      return acc;
    }, new Map<string, User>());
  }, [users]);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (selectedConversationId && currentUser) {
      try {
        await createMessage({
          conversationId: selectedConversationId,
          content,
        }).unwrap();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  if (conversationsLoading || usersLoading) {
    return <Loader />;
  }

  if (conversationsError) {
    return <div className="mt-5 text-center text-red-500">Error loading conversations.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-60px)]">
      <div className="w-[30%] overflow-y-auto border-r border-gray-300 p-4">
        <ConversationList
          conversations={conversations || []}
          onConversationSelect={handleConversationSelect}
          selectedConversationId={selectedConversationId}
          usersMap={usersMap}
          currentUser={currentUser}
        />
      </div>
      <div className="flex w-[70%] flex-col">
        {selectedConversationId ? (
          <>
            {messagesLoading && <Loader />}
            {messagesError && (
              <div className="mt-5 text-center text-red-500">Error loading messages.</div>
            )}
            {messages && currentUser && (
              <MessageList
                messages={messages}
                usersMap={usersMap}
                currentUserId={currentUser._id}
              />
            )}
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <h2>Select a conversation to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerPage;
