import { User } from "../models/User/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { asynchandler } from "../utils/asynchandler.js";


export const verifyjwt=asynchandler(async (req,response,next)=>{
    try{
     
         const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      if(!token){
        throw new ApiError(404,"Unautherizes access")
      }
      const decodetoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      const user=await User.findById(decodetoken?._id).select(
        '-password,refreshToken'

      )
      if(!user){
        throw new ApiError(404,"inavlid access token")
      }
      req.user=user;
      next()

    }catch(err){
        throw new ApiError(401,err?.message||"token is not valid")
    }
})