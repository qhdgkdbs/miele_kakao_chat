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



    var sendText;


    const userReqData = new UserReq(toSaveData);

    userReqData.save((err, doc) => {
        console.log("doc", doc)
        if (err) {
            //에러가 있을경우
            sendText =  [   
                            { simpleText: {text : "성함 : " + userName +"\n연락처 : "+userCall +"\n문의내용 : "+ userReq} },
                            { simpleText: {text : "문의 저장에 실패 하였습니다. 고객센터로 연락부탁드립니다." } } 
                        ]
            console.log(err)
            // return res.status(200).send(responseBody);
        }else{
            //에러가 없을 경우
            sendText =  [   
                            { simpleText: {text : "성함 : " + doc.name +"\n연락처 : "+doc.call +"\n문의내용 : "+ doc.userReq} },
                            { simpleText: {text : "문의 저장에 성공하였습니다." } } 
                        ]
        }

        var responseBody = {
            version: "2.0",
            template: {
                outputs: 
                    sendText,
                quickReplies: [
                    {
                        "messageText": "첫 화면으로 돌아가기",
                        "action": "message",
                        "label": "첫 화면으로 돌아가기"
                    }
                ]
            }
          };


        return res.status(200).send(responseBody);
    });
      
  });

  module.exports = router;