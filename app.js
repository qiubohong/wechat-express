var express = require('express');
var app = express();

//初始化全局变量
(function(){
	process.env.ACCESSTOKEN = ""; //微信 access_token
	process.env.JSTICKET = ""; //微信js ticket
})();

app.get('/', function (req, res) {
  res.send('Hello World!');
});


var tokenRouter = require('./route/token.js')
app.use('/token', tokenRouter);

app.use(express.static('www'));

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});