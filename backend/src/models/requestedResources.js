const mongoose = require('mongoose');
const { Schema } = mongoose;
const ResourceTypeEnum = {
    'Clothes': 0,
    'Water': 1,
    'Shelter': 2,
    'Life jackets': 3,
    'Medical supplies': 4,
    'Power': 5,
    'Transport': 6,
    'Special needs': 7
}

const RequestedResourcesSchema = new Schema({
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
    type: {
        type: Number,
        enum: [].concat(Object.values(ResourceTypeEnum)),
        default: ResourceTypeEnum.Clothes,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
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
mongoose.model('RequestedResources', RequestedResourcesSchema)
