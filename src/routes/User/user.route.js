import { Router } from "express";
import { RegisterUser,LoginUser,Forgetpassword,VerifyOtp,logout,RefreshAccessToken,VerifyLoginOtp,Currentuser,Getallusers,Changepassword,UpdateProfile} from "../../controllers/User/user.js";
import { verifyjwt } from "../../middlewares/VerifyJwt.js";
const router=Router()


router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/forgetpassword").post(Forgetpassword)
router.route("/verifyotp").post(VerifyOtp)
router.route("/logout").post(verifyjwt,logout)
router.route("/refreshtoken").post(RefreshAccessToken)
router.route("/loginotp").post(VerifyLoginOtp)
router.route("/userprofile/:_id").get(verifyjwt,Currentuser)
router.route("/allusers").get(verifyjwt,Getallusers)
router.route("/resetpassword").put(Changepassword)
router.route("/updateprofile").put(verifyjwt,UpdateProfile)



export default router