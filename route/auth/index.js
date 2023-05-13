const express=require("express")
const router=express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const {checkout,paymentVerification}=require('../../controllers/integration/index')
const itemList=require("../../controllers/crudOpration/index")
const isSuperAdmin = require("../../middleware/admin")
router.get("/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);
router.get("/get",async(req,res)=>{
    res.send("nice")
});
router.post("/item/create", itemList.create)
router.post("/item/get", isSuperAdmin, itemList.get)
router.post("/item/getall", itemList.getAll)
router.post("/item/update", itemList.update);
router.post("/item/delete", itemList.delete);
router.post("/item/manager", itemList.manager);
router.post("/item/upload",upload.single('csvfile'),itemList.upload);
router.post("/item/aggregate",itemList.aggregates)
router.post("/item/itemMenu",itemList.itemMenuCreate)
router.post("/item/populates",itemList.population)
router.post("/filter",itemList.filer)
router.post("/checkout",checkout)
router.post("/paymentverification",paymentVerification)

module.exports=router;
