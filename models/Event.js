const mongoose = require('mongoose');


const UserEveSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    call: {
        type:String,
        trim:true
    },
    resCreated : {
        type: String,
    },
    reqCreatedTime: {
        type: String,
    },
    imgUrl : [{
        type: String
    }],
    userAddr : {
        type: String

    },
    userUrl : {
        type: String

    },    
    userEtc : {
        type: String

    }
})

const UserEve = mongoose.model('UserEve', UserEveSchema);

module.exports = { UserEve }