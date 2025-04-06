const mongoose = require('mongoose');
const Staffs = mongoose.model('Staffs');
const responseHandler = require('@helpers/responseHandler');
const bcrypt = require('bcryptjs');
module.exports = async (req, res) => {
    const {name,age,gender,departmentName,password,expirence,userName} = req.body;
    const { lat, lng } = req.userLocation || {};
    console.log(req.userLocation)
    const staff = await Staffs.findOne({userName});
    if(staff) {
        return res.status(400).json({message:'User already exists'})
    }
    const location={
        lat:lat?lat:0,
        lng:lng?lng:0
    }

    console.log("location",location)
    // for password use bscrypt to hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStaff = new Staffs({
        name,
        age,
        gender,
        departmentName,
        password:hashedPassword,
        expirence,
        location,
        isAdmin:true,
        userName
    }); 
    await newStaff.save();
    return responseHandler.handleSuccessResponse(res, 'Staff created successfully');
}


