const auth = require("../middlewire/auth");
const admin = require("../middlewire/admin")
const router = require("express").Router();
const { User } = require("../Models/UserModel");
const {Task , validate} = require("../Models/Tasks")



//create task
router.post("/" , [auth , admin ] , (req,res)=>{
    const { error } = validate({...req.body , assignedBy:req.user._id });
    // console.log(req.user._id)
    if (error) return res.status(400).send({ message: error.details[0].message });
    const task = new Task({
        ...req.body,
        assignedBy:req.user._id
    }).save().then((tas)=>{
        res.status(200).send({
            data:tas,
            message:"Task Added Succesfully"
        })
    }).catch(()=>{
        res.status(400).send({
            message:"Error While Adding Task"
        })
    })
})


//update status of task 
router.put()

module.exports = router;