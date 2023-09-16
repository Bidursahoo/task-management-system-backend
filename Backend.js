// require("express-async-errors")
require("dotenv").config()
const express = require("express")
const cors = require("cors");
const app = express();

app.listen(3004 , ()=>{
    console.log("first")
})