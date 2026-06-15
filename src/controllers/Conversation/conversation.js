import { asynchandler } from "../../utils/asynchandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { Conversation } from "../../models/Conversion/conversion.model.js";

const createConversation = asynchandler(async (req, resp) => {
    const {reciverId}=req.body
    if(!reciverId){
        throw new ApiError(404,"Recived id is required")
    }
  const exconversation = await Conversation.findOne({
    participants: {
      $all: [req.user._id, reciverId],
    },
  });

  if (exconversation) {
    return resp
      .status(200)
      .json(
        new ApiResponse(200, exconversation, "Conversation is alreday created"),
      );
  }

  const conversation = await Conversation.create({
    participants: [req.user._id,reciverId],
  });

    return resp
      .status(201)
      .json(
        new ApiResponse(
          201,
          conversation,
          "Conversation is created successfully",
        ),
      );
  
});

const getConversations =asynchandler( async (req,resp)=>{
  const conversations = await Conversation.find({
    participants: req.user._id,
  }).populate("participants", "username email");

  if (!conversations || conversations.length === 0) { 
    throw new ApiError(404, "No conversations found");
  }
  return resp.status(200).json(new ApiResponse(200,conversations,"Conversations fetched successfully"))
})

export {
    createConversation,
    getConversations
}
