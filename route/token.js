var express = require('express');
var router = express.Router();
var request = require('request');
var sha1 = require('sha1');

var Constant = require('../common/constant.js');
var Utils = require('../utils/index.js');

/* 微信登陆 */


router.get('/wxJssdk', function(req, res, next) {
    let wx = req.query
    let timestamp = wx.timestamp
    let nonce = wx.nonce
    // 1）将token、timestamp、nonce三个参数进行字典序排序
    let list = [token, timestamp, nonce].sort()

    // 2）将三个参数字符串拼接成一个字符串进行sha1加密
    let str = list.join('')
    let result = sha1(str)
    // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (result === wx.signature) {
        res.send(wx.echostr) // 返回微信传来的echostr，表示校验成功，此处不能返回其它
    } else {
        res.send(false)
    }
});

router.get('/getWxConfig', function(req, res, next) {
	if(!req.query.url){
		res.json({
			error:"请先填写url参数！"
		})
		return;
	}
    Utils.getTicket().then(() => {
        let jsapi_ticket = process.env.JSTICKET;
        let nonce_str = Math.random().toString(36).substr(2); //十一位随机数
        let timestamp = new Date().getTime(); // 时间戳
        let url = req.query.url.split('#')[0]; // 使用接口的url链接，不包含#后的内容
        // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
        let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url;
        // 用sha1加密
        let signature = sha1(str);
        res.json({
            appId: Constant.AppID,
            timestamp: timestamp,
            nonceStr: nonce_str,
            signature: signature,
        });
    }).catch((e) => {
    	console.log(e)
        res.json(e);
    })
})

//wx_login 和 get_wx_access_token 配合获取用户信息
router.get('/wx_login', function(req, res, next) {
    //console.log("oauth - login")

    // 第一步：用户同意授权，获取code
    var router = 'get_wx_access_token';
    // 这是编码后的地址
    var return_uri = "http%3A%2F%2F" + Constant.JSDOMAIN + "%2Ftoken%2F" + router;
    console.log(return_uri)
    var scope = 'snsapi_userinfo';
    res.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Constant.AppID + '&redirect_uri=' + return_uri + '&response_type=code&scope=' + scope + '&state=STATE#wechat_redirect');
});

router.get('/get_wx_access_token', function(req, res, next) {
    console.log("get_wx_access_token")
    console.log("code_return: " + req.query.code)

    // 第二步：通过code换取网页授权access_token
    var code = req.query.code;
    request.get({
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + Constant.AppID + '&secret=' + Constant.AppSecret + '&code=' + code + '&grant_type=authorization_code',
    }, function(error, response, body) {
        if (response.statusCode == 200) {
            // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
            //console.log(JSON.parse(body));
            var data = JSON.parse(body);
            var access_token = data.access_token;
            process.env.ACCESSTOKEN = data.access_token;
            var openid = data.openid;

            request.get({
                url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN',
            }, function(error, response, body) {
                res.json(response)
            });
        } else {
            res.json(response)
            console.log(response.statusCode);
        }
    });
});
module.exports = router;