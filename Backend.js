// require("express-async-errors")
require("dotenv").config()
const express = require("express")
const cors = require("cors");
const app = express();
app.use(cors())
app.use(express.json())
const DataBaseConnect = require("./DataBaseConnectivity")
const userRoutes = require("./Routes/user");
const authRoutes = require("./Routes/auth");
const tasksRoutes = require("./Routes/tasks");
const port = process.env.PORT
// const port = 3005;



app.use("/api/users/" , userRoutes);
app.use("/api/login/" , authRoutes);
app.use("/api/task/" , tasksRoutes);


DataBaseConnect.then(()=>{
    console.log("connected")
}).catch(()=>{
    console.log("error")
})
app.listen(port , ()=>{
    console.log("first")
})