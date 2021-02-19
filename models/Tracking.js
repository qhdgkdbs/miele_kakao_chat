const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
    tracking: {
        type:String,
    },
    name: {
        type:String,
    },
    number : {
        type:String,
    },
    addr : {
        type:String
    },
    mall : {
        type:String
    }
})



const Tracking = mongoose.model('Tracking', trackingSchema);

module.exports = { Tracking }