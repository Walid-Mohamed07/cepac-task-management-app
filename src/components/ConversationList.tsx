import React from "react";
import type { CONVERSATION } from "../types/messenger";
import type { User } from "../types";
import ConversationListItem from "./ConversationListItem";

interface ConversationListProps {
  conversations: CONVERSATION[];
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId: string | null;
  usersMap: Map<string, User>;
  currentUser?: User | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onConversationSelect,
  selectedConversationId,
  usersMap,
  currentUser,
}) => {
  return (
    <div className="conversation-list-container">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation._id}
          conversation={conversation}
          onSelect={() => onConversationSelect(conversation._id)}
          isSelected={conversation._id === selectedConversationId}
          usersMap={usersMap}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default ConversationList;
