export interface ChatUser {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: ChatUser;
}

export interface Conversation {
  id: string;
  updatedAt: string;
  unreadCount: number;
  otherParticipant: ChatUser;
  lastMessage?: ChatMessage | null;
}

export interface GetMyConversationsResponse {
  myConversations: Conversation[];
}

export interface GetConversationMessagesResponse {
  conversationMessages: ChatMessage[];
}

export interface SendMessageResponse {
  sendMessage: {
    ok: boolean;
    error?: string | null;
    conversation: {
      id: string;
      updatedAt: string;
    };
    message: ChatMessage;
  };
}

export interface NotificationItem {
  id: string;
  notificationType: "message" | "application" | "payout" | "system";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface GetMyNotificationsResponse {
  myNotifications: NotificationItem[];
}

export interface MarkAllNotificationsReadResponse {
  markAllNotificationsRead: {
    ok: boolean;
    updatedCount: number;
  };
}
