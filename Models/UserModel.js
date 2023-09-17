const mongoose = require("mongoose");
const {Schema} = mongoose;
const jwt = require("jsonwebtoken");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity")



const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

userSchema.methods.generateAuthTocken = ()=>{
    return jwt.sign({_id:this._id ,email:this.email, name:this.name , isAdmin:this.isAdmin} , process.env.JWTKEY,{expiresIn:"7d"})
}

const validate = (user) =>{
    const schema = joi.object({
        name: joi.string().required(),
        email:joi.string().email().required(),
        password: passwordComplexity().required(),
        isAdmin:joi.boolean()
    });
    return schema.validate(user);
}

User = mongoose.model("user" , userSchema) 

module.exports = {User , validate}