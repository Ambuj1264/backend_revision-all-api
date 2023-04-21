const mongoose=require("mongoose")
const schemaModel=new mongoose.Schema({
    itemName:{
        type:String
    },
    itemValue:{
        type:String
    },
    paid:{
        type:Boolean
    }

},{timestamps:true})
module.exports=mongoose.model("items", schemaModel)
