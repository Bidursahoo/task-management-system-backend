const router = require("express").Router();
const { User, validate } = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const auth = require("../middlewire/auth");
const admin = require("../middlewire/admin")
const validObjectId = require("../middlewire/validObjectId")


// create user
router.post("/", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  User.findOne({ email: req.body.email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send({ message: "User with given email already exists!! \n Please LogIn" });
      } else {
        bcrypt
          .genSalt(Number(process.env.SALT))
          .then((salt) => {
            return bcrypt.hash(req.body.password, salt);
          })
          .then((hashedPassword) => {
            const newUser = new User({
              ...req.body,
              password: hashedPassword,
            });
            return newUser.save();
          })
          .then((savedUser) => {
            savedUser.password = undefined;
            savedUser.__v = undefined;
            res.status(200).send({
              data: savedUser,
              message: "Account created successfully",
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).send({ message: "An error occurred while creating the account." });
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).send({ message: "An error occurred while checking user existence." });
    });
});




//get all users who are not admin

router.get("/",admin,(req,res)=>{
  User.find({ isAdmin: false }).select("-password-__v").then((users)=>{
    res.status(200).send({data:users})
  })
})


//find user by id

router.get("/:id" , auth ,(req,res)=>{
  User.find({ _id:  req.params.id}).select("-password-__v").then((users)=>{
    res.status(200).send({data:users.name})
  })
})


//update user by id

router.put("/:id",[validObjectId,auth], (req,res)=>{
    User.findByIdAndUpdate(req.params.id, {$set:req.body},{new:true}).select("-email-password-__v").then((user)=>{
      res.status(200).send({data:user})
    })
  })


//promote user to admin

router.put("/:id", [validObjectId , auth , admin] , (req,res)=>{
  User.findByIdAndUpdate(req.params.id, {$set:req.body},{new:true}).select("-email-password-__v").then((user)=>{
    res.status(200).send({data:user})
  })
})


//verify authentication token

router.get("/verify" , auth , (req,res)=>{
  if (req.user) {
      res.status(200).json({
        message: "Token verified successfully",
        name: req.user.name
      });
    } else {
      res.status(401).json({
        message: "Token verification failed",
      });
    }
})




module.exports = router;
