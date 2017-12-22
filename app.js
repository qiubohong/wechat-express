var express = require('express');
var app = express();
var serverPort = 8080;

//初始化全局变量
(function() {
    process.env.ACCESSTOKEN = ""; //微信 access_token
    process.env.JSTICKET = ""; //微信js ticket
})();


var tokenRouter = require('./route/token.js')
app.use('/token', tokenRouter);

app.use(express.static('www'));

var server = app.listen(serverPort, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});


var opn = require('opn');
var os = require('os');

var lacalhost = ''
try {
    var network = os.networkInterfaces()
    localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
    localhost = 'localhost';
}
var uri = 'http://' + localhost + ':' + serverPort;
opn(uri);
