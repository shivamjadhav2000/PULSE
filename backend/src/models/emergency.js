const mongoose = require('mongoose');
const { Schema } = mongoose;

const DisasterEnum = {
    'none': 0,
    'Flood': 1,
    'Tornado': 2,
    'Hurricane': 3,
    'Earthquake': 4,
    'Wildfire': 5,
    'Other': 6
}
const severityTypeEnum = {
    'Advisory': 0,
    'Severe': 1,
    'Moderate': 2,
    'Watch': 3,
    'Minor': 4
}
const EmergencySchema = new Schema({
    userId: {
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
    dateTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    disasterType: {
        type: Number,
        enum: [].concat(Object.values(DisasterEnum)),
        default: DisasterEnum.none,
        required: true
    },
    severityType: {
        type: String,
        enum: [].concat(Object.values(severityTypeEnum)),
        default: severityTypeEnum.Advisory,
        required: true
    },
    message: {
        type: String,
        required: true
    }

    })
mongoose.model('Emergency', EmergencySchema)
