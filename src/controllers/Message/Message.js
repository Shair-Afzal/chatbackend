import { asynchandler } from "../../utils/asynchandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Message } from "../../models/Message/message.modal.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { Conversation } from "../../models/Conversion/conversion.model.js";
import { getIO } from "../../sockets/index.js";


const Sendmessage=asynchandler(async (req,resp) => {
    const {conversationId,text,reciverId}=req.body
    if(!conversationId || !text || !reciverId){
        throw new ApiError(404,"All fields are required")
    }
    const conversation=await Conversation.findById(conversationId)
    if(!conversation){
        throw new ApiError(400,"conversation not found")
    }
    const newMessage=await Message.create({
        senderId:req.user?._id,
        conversationId,
        text,
        reciverId,
    })
    conversation.lastmessage=text;
    conversation.lastMessageAt=new Date()
    await Conversation.findByIdAndUpdate(
    conversationId,
    { lastMessage: text, lastMessageAt: new Date() }
  );

  const io=getIO();
  io.to(reciverId).emit("recived message",text)
  return resp.
  status(201)
  .json(new ApiResponse(201,newMessage,"Message sent"))

})

const getMessage=asynchandler(async(req,resp)=>{
    const {conversationId}=req.params
 if(!conversationId){
    throw new ApiError(404,"conversationId is required")
 }


 const messages = await Message.find({ conversationId })
    .populate("senderId", "name")
    .sort({ createdAt: 1 });
    return resp
           .status(201)
           .json(new ApiResponse(201,messages,"Message is get successfully"))

})

export {
    getMessage,
    Sendmessage
}