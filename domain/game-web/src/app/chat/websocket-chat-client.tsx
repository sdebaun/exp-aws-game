"use client";

import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';

type ChatMessage = {
  messageId: string;
  username: string;
  message: string;
  timestamp: number;
  roomId: string;
};

export function WebSocketChatClient({ 
  wsUrl, 
  username = "anonymous", 
  roomId = "public" 
}: {
  wsUrl: string;
  username?: string;
  roomId?: string;
}) {
  console.log("WebSocketChatClient", { wsUrl })
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    onOpen: () => {
      console.log("WebSocket connected");
    },
    onClose: () => {
      console.log("WebSocket disconnected");
    },
    onError: (error) => {
      console.error("WebSocket connection error", error);
    },
    shouldReconnect: () => true,
    reconnectInterval: 3000,
  });

  const isConnected = readyState === ReadyState.OPEN;

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.data]);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    }
  }, [lastMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      console.error("WebSocket not connected");
      return;
    }

    if (!inputValue.trim()) return;

    sendMessage(JSON.stringify({
      action: "sendMessage",
      message: inputValue,
    }));

    setInputValue("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Chat Room: {roomId}</h1>
        <div className="text-sm mt-1 flex items-center gap-4">
          <span className={`inline-flex items-center ${isConnected ? "text-green-400" : "text-yellow-400"}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`}></span>
            {isConnected ? "Connected" : "Connecting..."}
          </span>
          <span className="text-gray-400">as {username}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            {isConnected ? "No messages yet. Start the conversation!" : "Connecting to chat..."}
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.messageId} className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-blue-400">{msg.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-white">{msg.message}</div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            required
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Waiting for connection..."}
            disabled={!isConnected}
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            type="submit" 
            disabled={!isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}