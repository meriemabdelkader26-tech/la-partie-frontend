import { gql } from "graphql-request";

export const ASK_CHATBOT_MUTATION = gql`
  mutation AskChatbot($question: String!, $role: String) {
    askChatbot(question: $question, role: $role) {
      answer
      intent
      confidence
      suggestions
      requiresHumanSupport
    }
  }
`;
