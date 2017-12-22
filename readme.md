# 简介
基于express搭建的微信网页微信授权和网页jssdk使用的一些后端接口。

## 运行
```bash
#安装依赖
npm install

#运行
npm start
```

## 微信验证接口
接口名称：`/token/wxJssdk`

## 网页微信授权
跳转地址接口地址：`/token/wx_login`

## 网页jssdk
获取配置项：`/token/getWxConfig?url=xxx`

- `url` : 配置地址


# 引用资源
推荐使用的自己机子上使用到域名调试微信，`ngrok`（[官网地址](https://ngrok.com/)）
