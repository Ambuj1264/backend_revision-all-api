const express=require("express")
const router=express.Router();
const {Registration,Login}=require("../../controllers/userController/index");
const {paymentVerification}=require('../../controllers/integration/index')
router.post("/login", Login.login);
router.post("/register", Registration.registration);
router.post("/paymentverification",paymentVerification);

module.exports=router;
