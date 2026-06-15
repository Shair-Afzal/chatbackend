import { email, z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username is too long"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const LoginSchema=z.object({
    email:z
    .string()
    .email("invalid email"),
    password:z
    .string()
    .min(6,"Password must be at least 6 characters")
})
export const LoginOtpSchema=z.object({
    email:z
    .string()
    .email("invalid email"),
    Otp:z
    .string()
    .min(4,"password only take 4 character")
})
export const forgetpasswordSchema=z.object({
    email:z
    .string()
    .email("invalid email")

})
export const OtpSchema=z.object({
  otp:z
    .string()
    .min(4,"password only take 4 character")


})

export const Changepasswordschema=z.object({
 
  resetPasswordToken:z
                     .string(),
   password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
    confirmpassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),
                     
  

})

export const UpdateProfileschema=z.object({
    username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username is too long"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

})