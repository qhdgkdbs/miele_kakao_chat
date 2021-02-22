const mongoose = require('mongoose');

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var month = (date.getMonth()+1) ? '0'+(date.getMonth()+1) : (date.getMonth()+1);
    return date.getFullYear()+ "" + month + "" + date.getDate();
} 

function formatTime(date){
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + '' + minutes

    return strTime
}


function getDate(){
    var d = new Date();
    return formatDate(d);
}

function getTime(){
    var d = new Date();
    return formatTime(d)   
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
    reqCreatedTime: {
        type: String,
        default: getTime()
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