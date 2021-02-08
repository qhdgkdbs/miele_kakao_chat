const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const https = require('https');

const apiRouter = express.Router();

app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use('/api', apiRouter);

var arr_req = []
var data = []

apiRouter.post('/getMyTracking', function(req, res) {
	var userName = req.body.action.params.name
	var middleCall = req.body.action.params.middleCall

	var trackingNumber =""
	console.log(userName + middleCall)
	
	
//  이름과 가운데 번호로 데이터 찾기
	
// 	찾은 데이터 대표 제품 정보 반환하기
	if(trackingNumber){console.log("있어요")}else{console.log("없어요")}
	trackingNumber = "637174795180"
	
// 	트래킹 번호가 있으면 받아서 운송장 번호 확인 후 트래킹 번호 출력
	
	if(trackingNumber){
		console.log(trackingNumber)
		console.log(req.body)


		var trackingUrl = "https://apis.tracker.delivery/carriers/kr.cjlogistics/tracks/" + trackingNumber
		console.log(trackingUrl)
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
			console.log(receivedData.message)
			if(!receivedData.message){
				
				var shippingData = "현재 상황 : " + receivedData.state.text + "\n배송 위치 : "+ receivedData.progresses[receivedData.progresses.length - 1].description

				sendMsg(trackingNumber, shippingData)
				// console.log("현재 상황 : " + receivedData.state.text + "\n배송 위치 : "+ receivedData.progresses[receivedData.progresses.length - 1].description );
			}
			  
		  });
		 	
		}).on("error", (err) => {
		  	console.log("Error: " + err.message);
			sendMsg("trackingNumber", "shippingData", err.message)

		});
	}else{
		const responseBody = {
			  version: "2.0",
			  template: {
				outputs: [
				  {
					simpleText: { text: "입력하신 정보의 배송 정보가 없습니다.\n 다시 한번 입력하신 정보를 확인해주세요" }
				  },
				  {
					simpleText: { text: "감사합니다." }
				  }
				]
			  }
			}
			
			res.status(200).send(responseBody);
	}

	const sendMsg = (trackingNumber, shippingData, err = null) => {
		if(err != null){
			const responseBody = {
			  version: "2.0",
			  template: {
				outputs: [
				  {
					simpleText: { text: "고객님의 상품의 배송 번호가 조회가 안됩니다." }
				  },
				  {
					simpleText: { text: "감사합니다." }
				  }
				]
			  }
			}
			
			res.status(200).send(responseBody);

		}else{
			const responseBody = {
			  version: "2.0",
			  template: {
				outputs: [
				  {
					simpleText: { text: "고객님의 상품의 배송 번호:\nCJ대한통운 : " + trackingNumber + "\n\n"+shippingData }
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
				]
			  }
			};
			
			res.status(200).send(responseBody);

		}



	}
    
  });

apiRouter.post('/saveReq', function(req, res) {
	var userName = req.body.action.params.name
	var userCall = req.body.action.params.call
	var userReq = req.body.action.params.req
	
	console.log(req.body)
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
  
    res.status(200).send(responseBody);
  });
  
  apiRouter.post('/showHello', function(req, res) {
    console.log(req.body);
  
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleImage: {
              imageUrl: "https://t1.daumcdn.net/friends/prod/category/M001_friends_ryan2.jpg",
              altText: "hello I'm Ryan"
            }
          }
        ]
      }
    };  
    
    res.status(200).send(responseBody);
});

app.listen(3000, function() {
    console.log('Example skill server listening on port 3000!');
});