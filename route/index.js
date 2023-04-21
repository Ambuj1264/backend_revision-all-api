const express =require("express");
const route=express.Router();
const auth=require("./auth/index.js");
const unauth=require("./unauth/index.js")
const verify=require("../middleware/loginMiddleware.js")

route.use("/api/auth",verify, auth);
route.use("/api",unauth)
module.exports=route;

