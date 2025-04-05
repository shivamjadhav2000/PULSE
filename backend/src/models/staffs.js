const mongoose = require('mongoose');
const { Schema } = mongoose;

const StaffTypeIdEnum = {
    'none': 0,
    'Manager': 1,
    'Nurse': 2,
    'Critical care': 3,
    'Risk Manager': 4}
const StaffSchema = new Schema({
    staffTypeId: {
        type: Number,
        enum: [].concat(Object.values(StaffTypeIdEnum)),
        default: StaffTypeIdEnum.none,
        required: true
    },
    departmentType:{
        type: String,
        required: true
    },
    expirence:{
        type: Number,
        required: true,
        default: 0
    },
})
mongoose.model('Staffs', StaffSchema)
