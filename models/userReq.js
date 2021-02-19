const mongoose = require('mongoose');

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getFullYear()+ "/" + (date.getMonth()+1) + "/" + date.getDate();
} 


function getDate(){
    var d = new Date();
    return formatDate(d);
}

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
        type: String,
    },
    reqCreated: {
        type: String,
        default: getDate()
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