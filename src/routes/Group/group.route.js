import { Router } from "express";
import { verifyjwt } from "../../middlewares/VerifyJwt.js";
import { CreateGroup,Getallgroups,Addmembers,removemembers } from "../../controllers/Group/group.js";


const router=Router()

router.route("/creategroup").post(verifyjwt,CreateGroup)
router.route("/getgroup").get(verifyjwt,Getallgroups)
router.route("/addmembers").post(verifyjwt,Addmembers)
router.route("/removemember").patch(verifyjwt,removemembers)



export default router