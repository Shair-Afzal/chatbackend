import { Server } from "socket.io";

let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 👤 join user room
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    // 💬 private message
    socket.on("send-message", (data) => {
      io.to(data.receiverId).emit("receive-message", data);
    });

    // 👥 join group
    socket.on("join-group", (groupId) => {
      socket.join(groupId);
    });

    // 💬 group message
    socket.on("send-group-message", (data) => {
      io.to(data.groupId).emit("receive-group-message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};