const express= require("express")
const app= express();
var logger = require("morgan");

const env=require('dotenv').config()
const port = process.env.PORT || 6000;
const cors= require("cors");
const db=require("./connection/index")
const router=require("./route/index")

app.use(cors())

app.use(logger("dev"))


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(router)

app.listen(port,()=>{
    console.log("listen on the "+ port)
})