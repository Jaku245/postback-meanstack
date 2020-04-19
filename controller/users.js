const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

exports.createUser = (req, res, next)=> {
  bcrypt.hash(req.body.password,10)
  .then(hash => {
    const user = new User({
      email : req.body.email,
      password : hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: 'User Created Successfully',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message : "Invalid authentication credentials!!"
      });
    });
  });
}

exports.userLogin = (req,res,next)=> {
  let fetchedUser;
  User.findOne({ email: req.body.email}).then(user => {
    if(!user){
      return res.status(401).json({
        message: "Invalid authentication credentials!!"
      });
    }
      fetcheduser=user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result){
        return res.status(401).json({
          message: "Invalid authentication credentials!!"
        });
      }
      const token = jwt.sign({emai: fetcheduser.email, userId: fetcheduser._id }, "secret_this_should_be_longer" ,{expiresIn: '10h'});
      res.status(200).json({
        token : token,
        expiresIn : 3600,
        userId: fetcheduser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message : "Invalid authentication credentials!!"
      });
    });
  }
