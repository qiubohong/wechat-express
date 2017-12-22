var request = require('request');
var Constant = require('../common/constant.js');
/**
 * @author: qborfy
 * @date:     2017-12-22
 * @describe: 获取微信授权accessToken
 * @return    {[type]}   [description]
 */
function getWxAccessToken() {
    return new Promise((resolve, reject) => {
        if (process.env.ACCESSTOKEN != "") {
            resolve();
        } else {
            var grant_type = "client_credential";
            request({
                url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=" + grant_type + "&appid=" + Constant.AppID + "&secret=" + Constant.AppSecret
            }, function(error, response, body) {
                if (error) {
                    process.env.ACCESSTOKEN = "";
                    console.log(error);
                    reject(error);
                    return;
                }
                try {
                    var access_token = JSON.parse(body).access_token;
                    process.env.ACCESSTOKEN = access_token;
                    resolve();
                } catch (e) {
                    process.env.ACCESSTOKEN = "";
                    console.log(e);
                    reject(e);
                }
            })
        }

    })

}

function getTicket() {
    return new Promise((resolve, reject) => {
        if (process.env.JSTICKET != "") {
            resolve();
        } else {
            if (process.env.ACCESSTOKEN != "") {
                var access_token = process.env.ACCESSTOKEN;
                request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi',
                    function(error, response, body) {
                        if (error) {
                            process.env.JSTICKET = "";
                            console.log(error);
                            reject(error);
                            return;
                        }
                        try {
                            var jsapi_ticket = JSON.parse(body).ticket;
                            process.env.JSTICKET = jsapi_ticket;
                            resolve();
                        } catch (error) {
                            process.env.JSTICKET = "";
                            console.log(error);
                            reject(error);
                        }
                    });
            } else {
                //获取token再执行
                getWxAccessToken().then(function() {
                    getTicket().then(resolve).catch(reject);
                }).catch(reject)
            }
        }
    });
}



module.exports = {
    getWxAccessToken: getWxAccessToken,
    getTicket: getTicket
}