// "use client";

// import { useState, useEffect } from "react";
// import mqtt from "mqtt";

// type ChatMessage = {
//   id: string;
//   username: string;
//   message: string;
//   timestamp: number;
// };

// function createConnection(endpoint: string, authorizer: string) {
//   return mqtt.connect(`wss://${endpoint}/mqtt?x-amz-customauthorizer-name=${authorizer}`, {
//     protocolVersion: 5,
//     manualConnect: true,
//     username: "",
//     password: "PLACEHOLDER_TOKEN",
//     clientId: `client_${window.crypto.randomUUID()}`,
//   });
// }

// export function ChatClient({ topic, endpoint, authorizer }: {
//   topic: string, endpoint: string, authorizer: string
// }) {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [connection, setConnection] = useState<mqtt.MqttClient | null>(null);

//   useEffect(() => {
//     const connection = createConnection(endpoint, authorizer);

//     connection.on("connect", async () => {
//       try {
//         await connection.subscribeAsync(topic, { qos: 1 });
//         setConnection(connection);
//       } catch (e) { }
//     });
//     connection.on("message", (_fullTopic, payload) => {
//       const message = new TextDecoder("utf8").decode(new Uint8Array(payload));
//       setMessages((prev) => [...prev, message]);
//     });
//     connection.on("error", console.error);

//     connection.connect();

//     return () => {
//       connection.end();
//       setConnection(null);
//     };
//   }, [topic, endpoint, authorizer]);

//   return (
//     <div className="flex flex-col h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <div className="bg-gray-800 p-4 border-b border-gray-700">
//         <h1 className="text-2xl font-bold">Realtime Chat</h1>
//         <div className="text-sm mt-1">
//           <span className={`inline-flex items-center ${connection ? "text-green-400" : "text-yellow-400"}`}>
//             <span className={`w-2 h-2 rounded-full mr-2 ${connection ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`}></span>
//             {connection ? "Connected" : "Connecting..."}
//           </span>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.length === 0 ? (
//           <div className="text-center text-gray-500 mt-8">
//             {connection ? "No messages yet. Start the conversation!" : "Connecting to chat..."}
//           </div>
//         ) : (
//           messages.map((msg, i) => {
//             const parsedMsg = JSON.parse(msg);
//             return (
//               <div key={i} className="bg-gray-800 p-3 rounded-lg">
//                 <div className="text-sm text-gray-400 mb-1">
//                   {new Date().toLocaleTimeString()}
//                 </div>
//                 <div className="text-white">{parsedMsg.message}</div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Input */}
//       <form
//         onSubmit={async (e) => {
//           e.preventDefault();

//           const input = (e.target as HTMLFormElement).message;

//           connection!.publish(
//             topic,
//             JSON.stringify({ message: input.value }),
//             { qos: 1 }
//           );
//           input.value = "";
//         }}
//         className="bg-gray-800 p-4 border-t border-gray-700"
//       >
//         <div className="flex gap-2">
//           <input
//             required
//             autoFocus
//             type="text"
//             name="message"
//             placeholder={connection ? "Type a message..." : "Waiting for connection..."}
//             disabled={!connection}
//             className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//           />
//           <button 
//             type="submit" 
//             disabled={!connection}
//             className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-semibold transition-colors"
//           >
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }