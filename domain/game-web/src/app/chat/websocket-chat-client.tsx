"use client";

import { useState, useEffect } from "react";

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
  // const tryThis = "wss://epvwtmwlcd.execute-api.us-east-1.amazonaws.com/"
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    let ws: WebSocket;
    // Connect with query parameters for user/room info
    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "message") {
            setMessages((prev) => [...prev, data.data]);
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      ws.onerror = (err) => {
        console.error("WebSocket connection error", err);
        setIsConnected(false);
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      console.log("new Websocket", JSON.stringify(err, null, 2))
    }



  }, [wsUrl, username, roomId]);

  // const sendMessage = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!ws.current || wsRef.current.readyState !== WebSocket.OPEN) {
  //     console.error("WebSocket not connected");
  //     return;
  //   }

  //   if (!inputValue.trim()) return;

  //   // Send message through WebSocket
  //   wsRef.current.send(JSON.stringify({
  //     action: "sendMessage",
  //     message: inputValue,
  //   }));

  //   setInputValue("");
  // };

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
      {/* <form onSubmit={sendMessage} className="bg-gray-800 p-4 border-t border-gray-700">
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
      </form> */}
    </div>
  );
}