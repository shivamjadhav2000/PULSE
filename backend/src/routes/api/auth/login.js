const mongoose = require('mongoose')
const responseHandler = require('@helpers/responseHandler')
const Staffs =mongoose.model('Staffs')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login=async (req, res) => {
  try{
    const checkUserExists=await Staffs.findOne({userName:req.body.userName})
    if(!checkUserExists){
      return responseHandler.handleErrorResponse(res,401,'User does not exists')
    }
    const {userName,password}=req.body
    // use bcrypt to compare the password
    const isMatch=await bcrypt.compare(password,checkUserExists.password)
    if(!isMatch){
      return responseHandler.handleErrorResponse(res,401,'Invalid credentials')
    }
    // create a token using jwt
    const userObj={
      name:checkUserExists.name,
      userName:checkUserExists.userName,
      id:checkUserExists._id,
      departmentName:checkUserExists.departmentName,
      isAdmin:checkUserExists.isAdmin,

    }
    const token=jwt.sign(userObj,process.env.JWT_SECRET,{expiresIn:'24h'})
    // send the token in the response
    const user={
      name:checkUserExists.name,
      userName:checkUserExists.userName,
      id:checkUserExists._id,
      departmentName:checkUserExists.departmentName,
      isAdmin:checkUserExists.isAdmin,
      token
    }
    return responseHandler.handleSuccessObject(res,user)
  }
  catch(err){
    console.log(err)
    responseHandler.handleException(res,err)
  }    
  }
  module.exports=login