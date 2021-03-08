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
    resType : {
        type:String
    },
    resCreated : {
        type: String,
    },
    reqCreated: {
        type: String,
    },
    reqCreatedTime: {
        type: String,
    },
    mieleMemo : {
        type: String
    },
    mieleMemoUser : {
        type: String
    },
    isItMemo : {
        type :Boolean,
        default : false
    },
    isItRes : {
        type :Boolean,
        default : false
    },
    imgUrl : [{
        type: String
    }]
})



const UserReq = mongoose.model('UserReq', userReqSchema);

module.exports = { UserReq }