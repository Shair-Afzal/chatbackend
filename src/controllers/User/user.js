import { asynchandler } from "../../utils/asynchandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/Apiresponse.js";
import { User } from "../../models/User/user.modal.js";
import { Sendmail } from "../../middlewares/Sendmail.middleware.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError("500", err.message);
  }
};

const RegisterUser = asynchandler(async (req, resp) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const exisistinguser = await User.findOne({ email });
  if (exisistinguser) {
    throw new ApiError(401, "Email already exist");
  }
  const user = await User.create({
    email,
    password,
    username,
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createduser) {
    throw new ApiError(500, "Internal server error");
  }
  return resp
    .status(200)
    .json(new ApiResponse(200, createduser, "user register successfully"));
});

const LoginUser = asynchandler(async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    throw new ApiError(400, "User  doesnot exist");
  }

  const ispasswordvalid = await user.isPasswordCorrect(password);
  if (!ispasswordvalid) {
    throw new ApiError(404, "invalid credintails");
  }

  // const {accessToken,refreshToken}=await generateToken(user._id);

  // const Loginuser=await User.findById(user._id).select(
  //     '-password -refreshToken'
  // )
  // const option={
  //     httpOnly:true,
  //     secure:true
  // }
  const otp = await Sendmail(email, "Verify Otp", "your login otp is");
  const hasedotp = await bcrypt.hash(otp, 10);
  user.loginOtp = hasedotp;
  user.loginOtpexipres = Date.now() + 5 * 60 * 1000;
  await user.save();

  return resp
    .status(200)
    .json(new ApiResponse(200, {}, "Otp sent successfully"));
});
const VerifyLoginOtp = asynchandler(async (req, resp) => {
  const { Otp, email } = req.body;
  if (!Otp) {
    throw new ApiError(400, "Otp is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(402, "user does not find");
  }
  if (user?.loginOtpexipres < Date.now()) {
    throw new ApiError(404, "Otp is expired");
  }
  const isvalid = await bcrypt.compare(Otp, user?.loginOtp);
  if (!isvalid) {
    throw new ApiError(404, "invalid otp");
  }
  const { accessToken, refreshToken } = await generateToken(user._id);

  const Loginuser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { accessToken }, "user login successfully"));
});

const Forgetpassword = asynchandler(async (req, resp) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(402, "user does not exist");
  }
  const otp = await Sendmail(
    email,
    "Reset password",
    "your rest password code is ",
  );
  const hasedotp = await bcrypt.hash(otp, 10);
  console.log(otp);
  user.resetOtp = hasedotp;
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  return resp
    .status(201)
    .json(new ApiResponse(200, {}, "Please check your email for reset code"));
});
const VerifyOtp = asynchandler(async (req, resp) => {
  const { otp } = req.body;

  if (!otp) {
    throw new ApiError(402, "otp is required");
  }
  const user = await User.findOne({
    resetOtpExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }
  const isOtpvalid = await bcrypt.compare(otp, user?.resetOtp);
  if (!isOtpvalid) {
    throw new ApiError(404, "Invalid otp");
  }

  const resetToken = jwt.sign(
    { _id: user._id },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: "10m" },
  );
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  user.resetOtp = undefined;
  user.resetOtpExpire = undefined;
  await user?.save();
  return resp
    .status(200)
    .json(new ApiResponse(200, resetToken, "you otp is verified successfully"));
});
const logout = asynchandler(async (req, resp) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(201)
    .json(new ApiResponse(201, {}, "User logout successfully"));
});

const RefreshAccessToken = asynchandler(async (req, resp) => {
  const incomingrefreshftoken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingrefreshftoken) {
    throw new ApiError(404, "refreshtoken is required");
  }
  const decoded = jwt.verify(
    incomingrefreshftoken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  const user = await User.findById(decoded?._id);
  if (!user) {
    throw new ApiError(401, "inavlid refresh token");
  }
  const { accessToken, refreshToken } = await generateToken(user?._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { accessToken }, "AccesToken refresh successfully"),
    );
});

const Currentuser = asynchandler(async (req, resp) => {
  const { _id } = req.params;
  const user = await User.findById(_id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(400, "user doest not exist");
  }
  return resp
    .status(201)
    .json(new ApiResponse(200, user, "Currectuser fetch succesfully"));
});

const Getallusers = asynchandler(async (req, resp) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const useraggregate = User.aggregate([
      {
        $project: {
          password: 0,
          refreshToken: 0,
          loginOtp: 0,
          loginOtpexipres: 0,
          resetPasswordToken: 0,
          resetPasswordExpire: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const user = await User.aggregatePaginate(useraggregate, {
      page,
      limit,
    });
    return resp
      .status(201)
      .json(new ApiResponse(200, user, "All user fetch suucessfully"));
  } catch (err) {
    throw new ApiError(404, err?.message);
  }
});
const Changepassword = asynchandler(async (req, resp) => {
  const { resetPasswordToken, password, confirmpassword } = req.body;
  if (!password || !confirmpassword) {
    throw new ApiError(404, "All fields required");
  }
  if (password != confirmpassword) {
    throw new ApiError("They both must be same ");
  }
  const decoded = jwt.verify(
    resetPasswordToken,
    process.env.RESET_TOKEN_SECRET,
  );
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(200, "Invalid resetToken");
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return resp.status(201).json(new ApiResponse(200, {}, "password reset successfully"));
});

const UpdateProfile=asynchandler(async (req,resp)=>{
    const {username,email,password}=req.body;
    if(!username||!email||!password){
        throw new ApiError(404,"All fields are required")
    }

    const existinguser=await User.findOne({email,_id:{$ne:req.user._id}})
    if (existinguser) {
    throw new ApiError(400, "Email already in use by another user");
   
  }
  const updatedata={
     username: username?.toLowerCase(),
  email,
  password,
  }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:updatedata
        },
        {new :true}
    ).select(
        '-password -refreshToken'
    )

    return resp.status(201).json(new ApiResponse(200,user,"profile is update suucessfully"))
})

export {
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
  UpdateProfile
};
