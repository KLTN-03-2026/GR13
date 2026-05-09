import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    socket.on("joinConversation", (conversationId) => {
      // Use the ID as the room name directly to allow expert_ID, user_ID, or conversation_ID
      const roomName = conversationId.toString().startsWith("conversation_") || 
                       conversationId.toString().startsWith("expert_") || 
                       conversationId.toString().startsWith("user_") 
                       ? conversationId.toString() 
                       : `conversation_${conversationId}`;
      
      socket.join(roomName);
      console.log(`User ${socket.id} joined room ${roomName}`);
    });

    socket.on("leaveRoom", (conversationId: number) => {
      socket.leave(`conversation-${conversationId}`);
      console.log(`👤 User left room: conversation-${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log(`👋 User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
