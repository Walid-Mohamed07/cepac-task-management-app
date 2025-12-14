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
      className={`mb-2 flex cursor-pointer items-center rounded-lg p-2 ${
        isSelected ? "bg-gray-200" : ""
      } hover:bg-gray-100`}
      onClick={onSelect}
    >
      <img
        src={`${import.meta.env.VITE_STORAGE_PATH}${avatar}`}
        alt={name}
        className="mr-2 h-10 w-10 rounded-full object-cover"
      />
      <div className="">
        <p className="font-bold">{name}</p>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500">
          {conversation.latestMessage?.content}
        </p>
      </div>
    </div>
  );
};

export default ConversationListItem;
