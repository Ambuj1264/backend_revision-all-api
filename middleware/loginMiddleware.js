const jwt = require("jsonwebtoken");

const verify=async(req,res,next)=>{
const token=req.headers.authkey;

if(token){
    const verifytoken= await jwt.verify(token,"ambuj1264",async(err,data)=>{
        if(err){
            res.status(401).send({
                success: false,
                message: "something went wrong",
                result: err.message,
              });
             
        } else{
         req.role=data.findRegisterAccount.role
          next();

        }
    })
}
else{
    res.status(401).send({
        success: false,
        message: "something went wrong",
        result: "please fill authkey",
      });
}

}
module.exports=verify;
