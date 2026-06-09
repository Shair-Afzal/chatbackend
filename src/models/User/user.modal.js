import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
const UserSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
         lowercase:true,
  trim:true
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken: {
    type: String,
  },
  profilepic:{
    type:String,
  },
  resetOtp: {
    type: String,
  },
  resetOtpExpire: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  isonline:{
    type:Boolean,
     default:false
  },
  lastSeen:{
    type:Date,
  },
  loginOtp:{
   type:String

  },
  loginOtpexipres:{
    type:Date

  },
  isVerified: {
    type: Boolean,
    default: false
}
},{ timestamps: true })

UserSchema.plugin(aggregatePaginate)

UserSchema.pre('save',async function(){
  if(!this.isModified("password")) return;
  this.password=await bcrypt.hash(this.password,10)

})

UserSchema.methods.isPasswordCorrect=async function (password){
  return await bcrypt.compare(password,this.password)


}
UserSchema.methods.generateAccessToken=function (){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:'1d'
    }


  )

}
UserSchema.methods.generateRefreshToken=function (){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      username:this.username
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:'2d'
    }


  )

}

export const User = mongoose.model("User", UserSchema);