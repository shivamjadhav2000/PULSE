const mongoose = require('mongoose');
const { Schema } = mongoose;

const StaffTypeIdEnum = {
    'none': 0,
    'Manager': 1,
    'Nurse': 2,
    'Critical care': 3,
    'Risk Manager': 4}
const StaffSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    staffTypeId: {
        type: Number,
        enum: [].concat(Object.values(StaffTypeIdEnum)),
        default: StaffTypeIdEnum.none,
        required: true
    },
    departmentName:{
        type: String,
        required: true
    },
    expirence:{
        type: Number,
        required: true,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})
mongoose.model('Staffs', StaffSchema)
