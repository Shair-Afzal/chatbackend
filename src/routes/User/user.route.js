import { Router } from "express";
import {
  RegisterUser,
  LoginUser,
  Forgetpassword,
  VerifyOtp,
  logout,
  RefreshAccessToken,
  VerifyLoginOtp,
  Currentuser,
  Getallusers,
  Changepassword,
  UpdateProfile,
} from "../../controllers/User/user.js";
import { verifyjwt } from "../../middlewares/VerifyJwt.js";
import {
  LoginSchema,
  RegisterSchema,
  LoginOtpSchema,
  forgetpasswordSchema,
  OtpSchema,
  Changepasswordschema,
  UpdateProfileschema,
} from "../../Validations/user.validation.js";
import { validate } from "../../middlewares/Validate.middleware.js";
const router = Router();

router.route("/register").post(validate(RegisterSchema), RegisterUser);
router.route("/login").post(validate(LoginSchema), LoginUser);
router
  .route("/forgetpassword")
  .post(validate(forgetpasswordSchema), Forgetpassword);
router.route("/verifyotp").post(validate(OtpSchema), VerifyOtp);
router.route("/logout").post(verifyjwt, logout);
router.route("/refreshtoken").post(RefreshAccessToken);
router.route("/loginotp").post(validate(LoginOtpSchema), VerifyLoginOtp);
router.route("/userprofile/:_id").get(verifyjwt, Currentuser);
router.route("/allusers").get(verifyjwt, Getallusers);
router
  .route("/resetpassword")
  .put(validate(Changepasswordschema), Changepassword);
router
  .route("/updateprofile")
  .put(validate(UpdateProfileschema), verifyjwt, UpdateProfile);

export default router;
