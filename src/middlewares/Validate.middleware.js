import { ApiError } from "../utils/ApiError.js"

export const validate=(schema)=>{
    return (req,resp,next)=>{
        try{
            schema.parse(req.body)
           next()
        }catch(err){
            return resp.status(400).json({
      success:false,
      errors: err.issues
   })

        }
    }

}