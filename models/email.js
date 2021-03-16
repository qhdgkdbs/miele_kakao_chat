const mongoose = require('mongoose');

const emailAddrSchema = mongoose.Schema({
    addr : [{
        type: String
    }]
})



const EmailAddr = mongoose.model('EmailAddr', emailAddrSchema);

module.exports = { EmailAddr }