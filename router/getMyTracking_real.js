
const moment = require('moment')
const express = require('express');
const router = express.Router();
const https = require('https');
const { Tracking } = require("../models/Tracking"); 


router.post('/', function(req, res) {
	var userName = req.body.action.params.name
	var middleCall = req.body.action.params.middleCall

    var sendText;

    var trackingNumber =""
    var addr = ""
    var name =""
    
    Tracking.findOne({ name: userName , number : middleCall}, (err, data) => {
      if(err) return res.json(err)

      if (data) {
        console.log(data)
        trackingNumber = data.tracking
        addr = data.addr
        name = data.name

        var trackingUrl = "https://apis.tracker.delivery/carriers/kr.cjlogistics/tracks/" + trackingNumber

        https.get(trackingUrl, (resp) => {
          let data = '';
    
          // A chunk of data has been received.
          resp.on('data', (chunk) => {
          data += chunk;
          });
    
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            console.log("data Recieved")
            var receivedData = JSON.parse(data)
            console.log(receivedData)
    
                  //에러가 여기로 오네...ㅜㅜㅜㅜㅜ
    
            if(!receivedData.progresses){ sendMsg(trackingNumber, shippingData, receivedData.message )  }
           
            if(!receivedData.message){
              
              var shippingData = "받는 분 :" + name + "\n배송지 : " +addr+ "\n현재 상황 : " + receivedData.state.text + "\n배송 위치 : "+ receivedData.progresses[receivedData.progresses.length - 1].description
      
              sendMsg(trackingNumber, shippingData)
              // console.log("현재 상황 : " + receivedData.state.text + "\n배송 위치 : "+ receivedData.progresses[receivedData.progresses.length - 1].description );
            }
            
          });
           
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            sendMsg("trackingNumber", "shippingData", err.message)
        });


      }else{
          // 데이터 조회 실패
        console.log("nodata")

        const responseBody = {
          version: "2.0",
          template: {
          outputs: [
            {
            simpleText: { text: "죄송합니다. 고객님의 배송 조회가 불가능합니다. 주문 데이터가 없거나, 상품 준비 중일수 있습니다." }
            },
            {
            simpleText: { text: "고객센터 혹은 챗봇에 문의 남기기 기능을 이용하여 문의를 남겨주세요." }
            }
          ],
                  quickReplies: [
                      {
                          "messageText": "첫 화면으로 돌아가기",
                          "action": "message",
                          "label": "첫 화면으로 돌아가기"
                      }
                  ]
          }
                
        }
        
        res.status(200).send(responseBody);
      }
  })

  
	

	const sendMsg = (trackingNumber, shippingData, err = null) => {
    console.log("err",err)
		if(err){

      sendText = {
          outputs: [
              {
                simpleText: { text: "죄송합니다. 에러가 발생했습니다." }
              },
              {
                simpleText: { text: "고객센터 혹은 챗봇에 문의 남기기 기능을 이용하여 문의를 남겨주세요."  }
              }
            ],
            quickReplies: [
              {
                  "messageText": "첫 화면으로 돌아가기",
                  "action": "message",
                  "label": "첫 화면으로 돌아가기"
              }
          ]
        }
			
		}else{
			sendText = {
                outputs: [
                      {
                        simpleText: { text: "<<고객님의 상품의 배송 번호>> \nCJ대한통운 : " + trackingNumber + "\n\n"+shippingData }
                      },
                      {
                        basicCard: { 
                            "title" : "배송조회",
                            "description": "CJ대한통운 배송 조회 페이지",
                            "buttons": [
                                {
                                    "action":  "webLink",
                                    "label": "CJ 배송 조회 페이지",
                                    "webLinkUrl": "https://www.cjlogistics.com/ko/tool/parcel/tracking"
                                }
                            ]
                        }
                      }
                  ],
                  quickReplies: [
                    {
                        "messageText": "첫 화면으로 돌아가기",
                        "action": "message",
                        "label": "첫 화면으로 돌아가기"
                    }
                ]
              }
		}

        var responseBody = {
            version: "2.0",
            template: sendText
          };

        res.status(200).send(responseBody);

	}
    
  });

  router.get("/del", (req, res) => {
    Tracking.deleteMany({
      created : { $lte: moment().subtract(1, 'years').format('YYYYMMDD') }
  }, (err, docs)=>{
      if (err){ 
          console.log(err) 
          return res.send({err})
      } 
      else{ 
          return res.send({
              success : true,
              deletedData : docs
          })
      } 
  })
  })

  module.exports = router;