const isSuperAdmin = (req,res , next)=>{
    if(req.role === "SuperAdmin"){
        next();
    }else{
        return res.json({msg: "You are not SuperAdmin"});
    }
}
module.exports = isSuperAdmin;
