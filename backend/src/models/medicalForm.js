const mongoose = require('mongoose');
const { Schema } = mongoose;

const disasterTypeEnum = {
    'none': 0,
    'Flood': 1,
    'Tornado': 2,
    'Hurricane': 3,
    'Earthquake': 4,
    'Wildfire': 5,
    'Other': 6
}
const medicalResourceTypeEnum = {
    'none': 0,
    'Tablets': 1,
    'First Aid Kit': 2,
    'Life jackets': 3,
    'Vaccines': 4,
    'Insulin': 5,
    'Other': 6
}

const MedicalFormSchema = new Schema({
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
    patientCount: {
        type: Number,
        required: true
    },
    criticalCount: {
        type: Number,
        required: true
    },
    disasterType: {
        type: Number,
        enum: [].concat(Object.values(disasterTypeEnum)),
        default: disasterTypeEnum.none,
        required: true
    },
    medicalResourceType:{
        type: Number,
        enum: [].concat(Object.values(medicalResourceTypeEnum)),
        default: medicalResourceTypeEnum.none,
        required: true
    },

    message: {
        type: String,
        required: false
    },
    crisisId: {
        type: String,
        refs: 'Crisis',
        required: true
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
mongoose.model('MedicalForm', MedicalFormSchema)