import { WebSocketChatClient } from "./websocket-chat-client";
import { Resource } from "sst";

export default function ChatPage() {
  // For now, hardcode username. In production, this would come from auth
  const username = "user-" + Math.random().toString(36).substr(2, 9);
  console.log("ChatPage", { "Resource.ChatApi.url": Resource.ChatApi.url})
  return (
    <WebSocketChatClient 
      wsUrl={Resource.ChatApi.url}
      username={username}
      roomId="public"
    />
  );
}