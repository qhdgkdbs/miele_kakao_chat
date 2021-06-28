const express = require('express');
const router = express.Router();
var fs = require('fs');
var request = require('request');
const { UserEve } = require("../models/Event");
var sanitize = require('mongo-sanitize');

function formatDate() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var month = (date.getMonth()+1) ? '0'+(date.getMonth()+1) : (date.getMonth()+1);

    var day = (date.getDate() < 10) ? '0'+(date.getDate()) : (date.getDate());

    return date.getFullYear()+ "" + month + "" + day;
} 

function formatTime(){
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    hours = hours < 10 ? '0'+hours : hours;
    var strTime = hours + '' + minutes;

    return strTime
}


function getDate(){
    return formatDate();
}

function getTime(){
    return formatTime(); 
}

router.post('/', function(req, res) {
    // console.log(req.body.action)

    var urlArr;

    try{
        var resImage = req.body.action.detailParams.image.origin
        resImage = resImage.slice(5)
        resImage = resImage.slice(0,-1)
        urlArr = resImage.split(",")
    }catch{
        urlArr = []
    }

    // var id = sanitize( req.body.action.id  )
	var userName = sanitize( req.body.action.params.name )
	var userCall = sanitize( req.body.action.params.call )
	var userAddr = sanitize( req.body.action.params.addr )
    var userUrl = sanitize( req.body.action.params.url )
    var userEtc = sanitize( req.body.action.params.etc )

    // 이미지 저장1
    var savedImageUrl = []

    var folderPath = "D:/userImage/" + getDate()

    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }

    // 다수 이미지 저장2    
    urlArr.map((imageUrl) => {
        request({
            url : imageUrl,
            encoding : null,
        }, (err, res, body) => {
            console.log(body instanceof Buffer)

            var fileName = folderPath + "/"+ userName + "_" + Date.now() + ".png"

            fs.writeFile(fileName , body, {
                encoding : null
            }, (err) => {
                if(err)
                    console.log(err)

                savedImageUrl.push(fileName)
                console.log("image saved")
            })

        })
    })

    // 데이터 베이스 저장 with 파일 
    setTimeout( () => {
        var toSaveData = {
            name : userName,
            call : userCall,
            reqCreated : getDate(),
            reqCreatedTime : getTime(),
            imgUrl : savedImageUrl,
            userAddr : userAddr,
            userUrl : userUrl,
            userEtc : userEtc 
        }
        
        console.log(toSaveData)

        var sendText;

        const userReqData = new UserEve(toSaveData);

        userReqData.save((err, doc) => {
            console.log("doc", doc)
            if (err) {
                //에러가 있을경우
                sendText =  [   
                                { simpleText: {text : "성함 : " + userName +"\n연락처 : "+ userCall } },
                                { simpleText: {text : "이벤트 저장에 실패 하였습니다. 다시 시도 해주세요." } } 
                            ]
                console.log(err)
                // return res.status(200).send(responseBody);
            }else{
                //에러가 없을 경우
                sendText =  [   
                                { simpleText: {text : "성함 : " + doc.name + "\n연락처 : " + doc.call + "\n주소 : " + doc.userUrl + "\nURL 주소 : " + doc.userAddr + "\n기타 : " + doc.userEtc} },
                                { simpleText: {text : "이벤트 저장에 성공하였습니다." } } 
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
    }, 500)
      
  });

  module.exports = router;