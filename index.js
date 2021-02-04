const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');

const apiRouter = express.Router();

app.use(logger('dev', {}));
app.use(bodyParser.json());
app.use('/api', apiRouter);

var arr_req = []

apiRouter.post('/getMyTracking', function(req, res) {
	console.log(req.body.action.params.city)
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: req.body.action.params.city + "에 사시는 군요" 
            }
          }
        ]
      }
    };
  
    res.status(200).send(responseBody);
  });

apiRouter.post('/saveReq', function(req, res) {
	var userReq = req.body.action.params.questions
	var userName = req.body.action.params.name
	var userNumber = req.body.action.params.number
	
	console.log(req.body)
    const responseBody = {
      version: "2.0",
      template: {
        outputs: [
			{
				simpleText: {text : "성함 : " + userName +"\n연락처 : "+userNumber +"\n문의내용 : "+ userReq}
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