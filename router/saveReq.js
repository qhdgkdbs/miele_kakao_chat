const express = require('express');
const router = express.Router();
const { UserReq } = require("../models/userReq");


router.post('/', function(req, res) {
	var userName = req.body.action.params.name
	var userCall = req.body.action.params.call
	var userReq = req.body.action.params.req
	var tempType = req.body.action.params.type
    var isItisItReq = false
    var isItVoucher = false

    if(tempType == "req") {isItisItReq = true}
    if(tempType == "voucher") {isItVoucher = true}


    var toSaveData = {
        name : userName,
        call : userCall,
        userReq : userReq,
        isItReq : isItisItReq,
        isItVoucher : isItVoucher
    }
	
	console.log(toSaveData)

    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
			{
				simpleText: {text : "성함 : " + userName +"\n연락처 : "+userCall +"\n문의내용 : "+ userReq}
			},
			{
				simpleText: {text : "위의 내용으로 문의가 저장되었습니다. \n밀레 코리아를 이용해주셔서 감사합니다."}
		  	}
        ]
      }
    };


    const userReqData = new UserReq(toSaveData);

    userReqData.save((err, doc) => {
        if (err) {
            console.log(err)
            return res.status(200).send(responseBody);
        }
        return res.status(200).send(responseBody);
    });
      
  });

  module.exports = router;