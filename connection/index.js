const mongoose= require("mongoose");

mongoose.connect("mongodb://localhost:27017/mydb",{useNewUrlParser:true,useUnifiedTopology: false,}).then(response=>{
    console.log("db is connected ")
}).catch(err=>{
    console.log(err.message)
})