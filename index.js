const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require("./config/dev");

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
	{
	  useNewUrlParser: true, useUnifiedTopology: true,
	  useCreateIndex: true, useFindAndModify: false
	})
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

app.use(logger('dev', {}));
app.use(bodyParser.json());

app.use('/api/getMyTracking', require('./router/getMyTracking'));
app.use('/api/saveReq', require('./router/saveReq'));


app.listen(8602, function() {
    console.log('Example skill server listening on port 8602!');
});