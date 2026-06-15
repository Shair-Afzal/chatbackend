import {Router}from "express"
import { createConversation,getConversations } from "../../controllers/Conversation/conversation.js";
import { verifyjwt } from "../../middlewares/VerifyJwt.js";


const router=Router();

router.route("/createconversation").post(verifyjwt,createConversation)
router.route("/getconversation").get(verifyjwt,getConversations)


export default router
