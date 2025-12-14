import type { User } from ".";

export interface CONVERSATION {
  _id: string;
  isGroup: boolean;
  name: string;
  participants: User[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  latestMessage?: MESSAGE;
}

export interface MESSAGE {
  _id: string;
  conversationId: string;
  senderId: User;
  content: string;
  edited: boolean;
  deleted: boolean;
  readBy: User[];
  reactions?: REACTION[];
  createdAt: string;
  updatedAt: string;
}

export interface REACTION {
  _id: string;
  emoji: string;
  userId: User;
}
