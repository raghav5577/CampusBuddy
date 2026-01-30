const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    outletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outlet',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add item name']
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Please add price']
    },
    image: {
        type: String,
        default: 'no-food-photo.jpg'
    },
    category: {
        type: String,
        required: [true, 'Please specify category']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    prepTime: {
        type: Number, // specific prep time for this item in minutes, optional
        default: 10
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
