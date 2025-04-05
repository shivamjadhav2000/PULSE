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
const CrisisSchema = new Schema({
    crisisType: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
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
    type: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date,
        default: null
    }
});
mongoose.model('Crisis', CrisisSchema);
