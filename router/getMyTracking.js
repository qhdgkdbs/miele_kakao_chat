
const moment = require('moment')
const express = require('express');
const router = express.Router();
const { Tracking } = require("../models/Tracking");
const Axios = require('axios')
var sanitize = require('mongo-sanitize');


const whereIsMine = (trackingNumber, cb) => {
  Axios.get("https://apis.tracker.delivery/carriers/kr.cjlogistics/tracks/" + trackingNumber)
  .then((res, err) =>{
    // console.log(res.data)
    if(res.data.message) cb(res.data)

    cb(res.data)
  }).catch(err =>{
    console.log(err)
  })

}

router.post('/', (req, res) => {

  var userName = sanitize( req.body.action.params.name  )
  var middleCall = sanitize( req.body.action.params.middleCall )

  Tracking.find({ name:  { $regex : userName} , number : middleCall }, (err, datas) => {
    if(err) return res.json(err)

    if(datas.length > 0) {

      var itemInfo = []

      var index = 0

      datas.forEach(info => {
        var shippingState;
        var shippingDescription
  
        whereIsMine(info.tracking, data => {
          // console.log(data)
          shippingState = data.state.text;
          shippingDescription = data.progresses[data.progresses.length - 1].description
  
          var textData = {
            title: `고객님의 주문 배송 정보 #${index+1}`,
            description: `배송 시작 일 : ${info["created"]}\n받는 분 : ${info["name"]}\n배송지 : ${info["addr"]}\n운송장번호 : ${info["tracking"]}\n배송 상황:${shippingState}\n배송 설명:${shippingDescription}`,
            // thumbnail: {
            //   imageUrl: "http://k.kakaocdn.net/dn/83BvP/bl20duRC1Q1/lj3JUcmrzC53YIjNDkqbWK/i_6piz1p.jpg"
            // },
            buttons: [
              {
                action:  "webLink",
                label: "대한통운",
                webLinkUrl : `https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=` + info["tracking"]
              }
            ]
          }
          index = index +1
          itemInfo.push(textData)

        })
      })

      var data =
        {
            version: `2.0`,
            template : {
              outputs: [
                {
                  carousel: {
                    type: "basicCard",
                    items: itemInfo
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

          console.log(data.template.outputs)
  
          setTimeout(() => {
            return res.json(data)
          }, 500)
    }else{
      var responseBody = {
        version: "2.0",
        template: {
          outputs: [
              {
                simpleText: { text: "죄송합니다. \n고객님의 배송 조회가 불가능합니다.\n주문 데이터가 없거나, \n상품 준비 중일수 있습니다."  }
              },
              {
                simpleText: { text: "고객센터 혹은 챗봇에 \n문의 남기기 기능을 \n이용하여 문의를 남겨주세요."  }
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
      };

    res.status(200).send(responseBody);
    }
  })
})

module.exports = router;