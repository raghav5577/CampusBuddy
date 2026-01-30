const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add outlet name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add description']
    },
    image: {
        type: String, // URL to image
        default: 'no-photo.jpg'
    },
    location: {
        type: String,
        required: [true, 'Please add location (e.g., Block A)']
    },
    openingTime: {
        type: String,
        required: true
    },
    closingTime: {
        type: String,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    averagePrepTime: {
        type: Number, // in minutes
        default: 15
    },
    categories: {
        type: [String],
        default: []
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

// Reverse populate with virtuals when fetching outlets to get their menu items
outletSchema.virtual('menuItems', {
    ref: 'MenuItem',
    localField: '_id',
    foreignField: 'outletId',
    justOne: false
});

module.exports = mongoose.model('Outlet', outletSchema);
