import { Server } from "socket.io";
import { User } from "../models/User/user.modal.js";

let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 👤 join user room
    socket.on("join", async (userId) => {
        console.log("JOIN EVENT:", userId);
        socket.join(userId);
      const user = await User.findByIdAndUpdate(userId,{
        isonline:true
      },
      
  {
    new: true,
  }
    )
    console.log("usersocket",user)
      socket.userId=userId;
      io.emit("user-online",userId)
    
      
    });
     

   socket.on("typing", ({ receiverId, senderId }) => {
  io.to(receiverId).emit("user-typing", {
    senderId,
    isTyping: true
  });
});

socket.on("stop-typing", ({ receiverId, senderId }) => {
  io.to(receiverId).emit("user-typing", {
    senderId,
    isTyping: false
  });
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

   socket.on("disconnect", async () => {
  try {
    if (socket.userId) {
      await User.findByIdAndUpdate(
        socket.userId,
        {
          isonline: false,
          lastSeen: new Date(),
        }
      );

      io.emit("user-offline", socket.userId);
    }

    console.log("User disconnected:", socket.id);
  } catch (error) {
    console.log(error);
  }
});
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
}; 