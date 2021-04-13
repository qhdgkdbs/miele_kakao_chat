const express = require('express');
const router = express.Router();
var fs = require('fs');
var request = require('request');
const { UserReq } = require("../models/userReq");
const { EmailAddr } = require("../models/email");
var sanitize = require('mongo-sanitize');

var nodemailer = require('nodemailer');
const { GOOGLE_MAIL_PW, GOOGLE_MAIL_EMAIL } = require('../config')

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: GOOGLE_MAIL_EMAIL,
      pass: GOOGLE_MAIL_PW
    }
});
  

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

    var id = sanitize( req.body.action.id  )
	var userName = sanitize( req.body.action.params.name )
	var userCall = sanitize( req.body.action.params.call )
	var userReq = sanitize( req.body.action.params.req )
    var resType = sanitize( req.body.action.params.type )
    var pd_cat = sanitize( req.body.action.params.pd_cat )
    if(!pd_cat){
        pd_cat = "구입 상담"
    }


    var savedImageUrl = []

    var folderPath = "D:/userImage/" + getDate()

    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
    }

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

    setTimeout( () => {
        var toSaveData = {
            name : userName,
            call : userCall,
            userReq : userReq,
            resType : resType,
            reqCreated : getDate(),
            reqCreatedTime : getTime(),
            imgUrl : savedImageUrl,
            pd_cat : pd_cat
        }
        
        console.log(toSaveData)

        var sendText;

        const userReqData = new UserReq(toSaveData);

        userReqData.save((err, doc) => {
            console.log("doc", doc)
            if (err) {
                //에러가 있을경우
                sendText =  [   
                                { simpleText: {text : "성함 : " + userName +"\n연락처 : "+userCall + "\n제품명 : "+pd_cat + "\n문의내용 : "+ userReq} },
                                { simpleText: {text : "문의 저장에 실패 하였습니다. 고객센터로 연락부탁드립니다." } } 
                            ]
                console.log(err)
                // return res.status(200).send(responseBody);
            }else{
                //에러가 없을 경우
                sendText =  [   
                                { simpleText: {text : "성함 : " + doc.name +"\n연락처 : "+doc.call + "\n제품명 : " + doc.pd_cat + "\n문의내용 : "+ doc.userReq} },
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


            // const emailAddr = new EmailAddr({addr : ["qhdgkdbs@gmail.com","miele@miele.com"] });

            // EmailAddr.find((err, data) => {
            //     if(err){
            //         console.log(err)
            //     }
            //     console.log("now", data[0].addr)
            // })

            var mailOptions = {
                from: 'qhdgkdbs@gmail.com',
                to: 'seung-woo.bong@miele.com',
                subject: `${getDate()} :: ${userName}님의 문의`,
                html:  
                    `<h1>${getDate()} :: ${userName}님의 문의</h1>
                    <hr />
                    <div><h4 style="display: inline;">고객명</h4> : ${userName}</div>
                    <div><h4 style="display: inline;">고객 문의 사항</h4> : ${userReq}</div>
                    <div style="height:20px;"></div>
                    <div>고객님의 연락처는 CS페이지에서 확인가능합니다.</div>
                    <div>더 자세한 내용은 http://10.10.0.210:3000/userReq 에서 확인할 수 있습니다.</div>
                    <div style="height:20px;"></div>
                    ${
                        savedImageUrl.length > 0
                        ?
                            
                            savedImageUrl.map((url)=>{
                                var imgTag = "<div> http://10.10.0.210:5050/image/" + url.substring('D:/userImage/'.length) + "</div>" 
                                console.log(imgTag)
                                return "<div style = 'font-weight:1000'>이미지는 회사 내부에서만 접속 가능합니다.</div>" + imgTag
                            })
                        :
                             "<div>이미지가 없습니다.</div>"
                    }
                    
                    <hr />

                    `
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });


            return res.status(200).send(responseBody);
        });
    }, 500)
      
  });

  module.exports = router;