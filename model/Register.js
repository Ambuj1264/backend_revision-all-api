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
    },
    role:{
        type: String,
        enum:["Admin" ,"SuperAdmin" , "User"]
    }

},{timestamps:true})

module.exports= mongoose.model("registers", schemaModel)
