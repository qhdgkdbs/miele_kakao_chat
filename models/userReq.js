const mongoose = require('mongoose');

const userReqSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    call: {
        type:String,
        trim:true
    },
    userReq : {
        type:String,
    },
    mieleRes : {
        type:String
    },
    mieleResUser : {
        type:String
    },
    resCreated : {
        type: Date
    },
    reqCreated: {
        type: Date,
        default: Date.now
    },
    mieleMemo : {
        type: String
    },
    mieleMemoUser : {
        type: String
    }
})



const UserReq = mongoose.model('UserReq', userReqSchema);

module.exports = { UserReq }