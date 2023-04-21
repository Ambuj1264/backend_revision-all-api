const mongoose=require("mongoose")

const schemaModel= new mongoose.Schema({
    name:{
        type:String
    },
    password:{
        type:String
    },
    mobile:{
        type:String
    },
    email:{
        type:String,
        unique:true
    }

},{timestamps:true})

module.exports= mongoose.model("registers", schemaModel)