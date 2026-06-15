import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app=express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.use(cookieParser());

import UserRouter from "./routes/User/user.route.js" 
import ConversationRouter from "./routes/Conversation/conversation.route.js"
import MessageRouter from "./routes/Message/Message.route.js"

app.use("/api/v1/user",UserRouter),
app.use("/api/v1/conversation",ConversationRouter)
app.use("/api/v1/message",MessageRouter)






export {app}