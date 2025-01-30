import { ConversationItem } from "./ConversationItem";

interface Props {
  conversationData: {
    userSpeaking: boolean;
    grammarValid: boolean;
    content: string;
    correctedContent: string;
  }[];
}

export const ConversationList = ({ conversationData }: Props) => {
  return (
    <ul>
      {conversationData.map((talkMessage, i) => (
        <ConversationItem key={i} talkMessage={talkMessage} />
      ))}
    </ul>
  );
};
