const auth = require("../middlewire/auth");
const admin = require("../middlewire/admin")
const router = require("express").Router();
const { User } = require("../Models/UserModel");
const {Task , validate} = require("../Models/Tasks");
const validObjectId = require("../middlewire/validObjectId");



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


//update status of task for specific user 
router.put("/:id" , [auth , validObjectId] , (req,res)=>{
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send({ message: error.details[0].message });
    Task.findByIdAndUpdate(req.params.id, {$set:req.body},{new:true}).then((task)=>{
        res.status(200).send({data:task})
      })
} )


// get all task for specific user
router.get("/" , auth , (req,res)=>{
    Task.find({assignedTo:req.user._id}).populate('assignedBy', 'name')
    .populate('assignedTo', 'name')
    .exec().then((tasks)=>{
        res.status(200).send({data: tasks})
    })
})


//get all task of every user

router.get("/" , [auth,admin] , (req,res)=>{
    Task.find().then((tasks)=>{
        res.status(200).send({data: tasks})
    })
})


//update tasks by admin 

router.put("/:id" , [auth , admin] , (req,res)=>{
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send({ message: error.details[0].message });
    Task.findByIdAndUpdate(req.params.id, {$set:req.body},{new:true}).then((task)=>{
        res.status(200).send({data:task})
      })
})




module.exports = router;