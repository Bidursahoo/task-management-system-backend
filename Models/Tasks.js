const mongoose = require("mongoose");
const {Schema} = mongoose;
const joi = require("joi");
const ObjectId = mongoose.Schema.Types.ObjectId;



const taskSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    assignedBy:{
        type:ObjectId,
        ref:"user",
        required:true
    },
    assignedTo:{
        type:ObjectId,
        ref:"user",
        required:true
    },
    status:{
        type:String,
        required:true
    },
    assignedDate:{
        type:Date,
        default:Date.now
    }
})


const validate = (task) =>{
    const schema = joi.object({
        title: joi.string().required(),
        desc: joi.string().required(),
        assignedBy: joi.string().required(),
        assignedTo: joi.string().required(),
        status:joi.string().valid("Assigned" , "In Progress" , "Done").required()
    });
    return schema.validate(task);
}

Task = mongoose.model("task" , taskSchema) 

module.exports = {Task , validate}