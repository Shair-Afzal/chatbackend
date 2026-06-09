import nodemailer from "nodemailer"



export const Sendmail=async (to,sub,txt)=>{
    try{
const otp = Math.floor(1000 + Math.random() * 9000);
        const transporter=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
             auth: {
        user: "shairafzal670@gmail.com",
        pass: "lujubgzxljyzxpxg",
      },
        })
         const mailoptions = {
      from: "shairafzal670@gmail.com",
      to: to,
      subject: sub,
      text: `${txt}: ${otp}
This code will expire in 10 minutes.`,
    };
     await transporter.sendMail(mailoptions)
     return String(otp)
    }catch(err){
        throw err

    }

}