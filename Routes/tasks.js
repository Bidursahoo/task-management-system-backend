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
router.put("/:id" , [auth] , (req,res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    Task.findByIdAndUpdate(req.params.id, {$set:req.body},{new:true}).then((task)=>{
        res.status(200).send({data:task})
      })
} )


// get all task by id
router.get("/:id" , auth , (req,res)=>{
    Task.find({assignedTo:req.params.id}).then((tasks)=>{
        res.status(200).send({data: tasks})
    })
})

module.exports = router;