import { gql } from "graphql-request";

export const GET_MY_CONVERSATIONS = gql`
  query GetMyConversations {
    myConversations {
      id
      updatedAt
      unreadCount
      otherParticipant {
        id
        name
        email
        role
        influencerProfile {
          profilePicture
        }
      }
      lastMessage {
        id
        content
        createdAt
        sender {
          id
          name
        }
      }
    }
  }
`;

export const GET_CONVERSATION_MESSAGES = gql`
  query GetConversationMessages($conversationId: ID!) {
    conversationMessages(conversationId: $conversationId) {
      id
      content
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $conversationId: ID, $receiverId: ID) {
    sendMessage(content: $content, conversationId: $conversationId, receiverId: $receiverId) {
      ok
      error
      conversation {
        id
        updatedAt
      }
      message {
        id
        content
        createdAt
        sender {
          id
          name
        }
      }
    }
  }
`;

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications($first: Int) {
    myNotifications(first: $first) {
      id
      notificationType
      title
      message
      link
      isRead
      createdAt
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      ok
      updatedCount
    }
  }
`;

export const SAVE_OFFER = gql`
  mutation SaveOffer($offerId: ID!) {
    saveOffer(offerId: $offerId) {
      success
      message
      offer {
        id
        isSaved
      }
    }
  }
`;
