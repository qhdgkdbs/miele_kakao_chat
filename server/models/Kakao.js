const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const kakaoSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50,
        trim:true,
    },
    phone: {
        type:String,
        trim:true,
    },
    cat: {
        type: String,
        minglength: 5
    },
    contents: {
        type:String,
        maxlength : 5000,
    },
    reqDate : {
        type:Date,
        default: Date.now
    },
    resId : {
        type: String,
        maxlength:50
    },
    resDate :{
        type: Date,
    }
})


const Kakao = mongoose.model('Kakao', kakaoSchema);

module.exports = { Kakao }