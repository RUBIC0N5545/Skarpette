const mongoose = require('mongoose');

const skarpetteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    price2: {
        type: Number,
    },
    vendor_code: {
        type: Number,
        required: true,
        unique: true,
    },
    color: [
        {
            type: String,
            required: true,
        },
    ],
    size: [
        {
            type: String,
            required: true,
        },
    ],
    images_urls: [
        {
            type: String,
            required: true,
        },
    ],
    composition_and_care: {
        composition: {
            type: Map,
            of: Number,
            required: true,
        },
        care: {
            type: String,
            required: true,
        },
    },
    type: {
        type: String,
        required: true,
    },
    style: {
        type: String,
        required: true,
    },
    is_new: {
        type: Boolean,
        default: false,
    },
    is_in_stock: {
        type: Boolean,
        default: true,
    },
});

const Skarpette = mongoose.model('Skarpette', skarpetteSchema);

module.exports = Skarpette;
