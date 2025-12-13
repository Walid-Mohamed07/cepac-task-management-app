import React from "react";
import type { CONVERSATION } from "../types/messenger";
import type { User } from "../types";
import unknownProfilePic from "/media/images/profilePicture/unknown.webp";

interface ConversationListItemProps {
  conversation: CONVERSATION;
  onSelect: () => void;
  isSelected: boolean;
  usersMap: Map<string, User>;
  currentUser?: User | null;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  onSelect,
  isSelected,
  usersMap,
  currentUser,
}) => {
  const getConversationDetails = () => {
    if (conversation.isGroup) {
      return {
        name: conversation.name,
        avatar: unknownProfilePic, // Group avatar can be a specific icon
      };
    }

    const otherParticipantId = conversation.participants.find(
      (p) => p !== currentUser?._id
    );
    const otherParticipant = otherParticipantId
      ? usersMap.get(otherParticipantId)
      : null;

    return {
      name: otherParticipant?.name || "Unknown User",
      avatar: otherParticipant?.profilePicture || unknownProfilePic,
    };
  };

  const { name, avatar } = getConversationDetails();

  return (
    <div
      className={`conversation-list-item ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <img src={avatar} alt={name} className="avatar" />
      <div className="conversation-info">
        <p className="conversation-name">{name}</p>
        <p className="conversation-latest-message">
          {conversation.latestMessage?.content}
        </p>
      </div>
    </div>
  );
};

export default ConversationListItem;
