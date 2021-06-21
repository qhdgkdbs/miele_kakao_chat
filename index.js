const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require("./config/dev");

var helmet = require('helmet')

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
	{
	  useNewUrlParser: true, useUnifiedTopology: true,
	  useCreateIndex: true, useFindAndModify: false
	})
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

	
app.use(helmet())
app.set('trust proxy', 1) // trust first proxy

app.disable('x-powered-by')
app.use(logger('dev', {}));
app.use(bodyParser.json());

// 운송장 관련조회
app.use('/api/getMyTracking', require('./router/getMyTracking'));
// 문의 저장 부분
app.use('/api/saveReq', require('./router/saveReq'));
// 사용자 이벤트 정보 저장 부분
app.use('/api/event', require('./router/saveEvent'));




app.listen(8602, function() {
    console.log('Example skill server listening on port 8602!');
});