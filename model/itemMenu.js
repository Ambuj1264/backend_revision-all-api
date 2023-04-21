const mongoose=require("mongoose")

const schemaModel=new mongoose.Schema({
        dinner:{
            type:String
        },
        breakfast:String,
        itemDetails:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"items"
        }
})
module.exports=mongoose.model("itemMenu", schemaModel)