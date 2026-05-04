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

    socket.on("joinRoom", (conversationId: number) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`👤 User joined room: conversation-${conversationId}`);
    });

    socket.on("leaveRoom", (conversationId: number) => {
      socket.leave(`conversation-${conversationId}`);
      console.log(`👤 User left room: conversation-${conversationId}`);
    });

    socket.on("sendMessage", (data) => {
      io.to(`conversation-${data.conversationId}`).emit("receiveMessage", data);
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
