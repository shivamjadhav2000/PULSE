const mongoose = require('mongoose');
const { Schema } = mongoose;


const DisabilityEnum = {
    'none': 0,
    'Blind': 1,
    'Dumb': 2,
    'Deaf': 3,
    'Injured': 4,
    'Autism': 5,
    'Other': 6
}
const UsersSchema = new Schema({
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
    Disability: {
        type: Number,
        enum: [].concat(Object.values(DisabilityEnum)),
        default: DisabilityEnum.none,
        required: true
    },
    isRegistered: {
        type: Boolean,
        default: false
    },
    isStaff: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    staffId: {
        type: String,
        ref: 'Staffs'
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
mongoose.model('MessageCreds', messageCredSchema);