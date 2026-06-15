import { Router } from "express";
import { Sendmessage,getMessage } from "../../controllers/Message/Message.js";
import { verifyjwt } from "../../middlewares/VerifyJwt.js";


const router=Router()

router.route("/send").post(verifyjwt,Sendmessage)
router.route("/getmessage/:conversationId").get(verifyjwt,getMessage)
 





export default router