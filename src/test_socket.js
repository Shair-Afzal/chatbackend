import { io } from "socket.io-client";

const socket = io("http://localhost:3500");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
    

  socket.emit(  "join","6a23d3e83ae4758bdd26fcef")
});