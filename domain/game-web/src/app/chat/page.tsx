import { ChatClient } from "./chat-client";
import { Resource } from "sst";

export default function ChatPage() {
  const topic = `${Resource.App.name}/${Resource.App.stage}/chat/public`;
  
  return (
    <ChatClient 
      topic={topic}
      endpoint={Resource.ChatRealtime.endpoint}
      authorizer={Resource.ChatRealtime.authorizer}
    />
  );
}