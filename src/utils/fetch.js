var fetch = require('node-fetch')
var url = require('url')
var querystring = require('querystring')
var iconv = require('iconv-lite')
var crypto = require('crypto')
var uuidV1 = require('uuid/v1')

const {
    baseMethod,
    baseHost,
    basePort,
    baseQuery,
    basePathname,
    apiUrl,
    apiKey,
    secretKey,
    apiMethod,
    apiVersion,
    timeout,
} = require('../../config/config.js')


module.exports = function ({
                               host = baseHost,
                               port = basePort,
                               query = baseQuery,
                               pathname = basePathname,
                           }, {
                               method = baseMethod,
                               headers = {},
                               body = '',
                               sendTimeout = timeout
                           }) {

    // 获取时间
    var apiTime = new Date().getTime()
    // 获取uuid
    var apiUniqueId = uuidV1()

    // 请求的query
    var sendQuery = querystring.stringify(query)
    // key字符串
    var payload = `${method}\n${apiUrl}\n${pathname}\n${sendQuery}\nAPI-KEY: ${apiKey}\nAPI-SIGNATURE-METHOD: ${apiMethod}\nAPI-SIGNATURE-VERSION: ${apiVersion}\nAPI-TIMESTAMP: ${apiTime}\nAPI-UNIQUE-ID: ${apiUniqueId}\n${body && JSON.stringify(body)}`
    // 生成签名
    var signature = crypto.createHmac('sha256', secretKey).update(iconv.encode(payload, 'utf8')).digest('hex')

    // 对header进行修改
    headers['API-SIGNATURE-METHOD'] = headers['API-SIGNATURE-METHOD'] || apiMethod
    headers['API-SIGNATURE-VERSION'] = headers['API-SIGNATURE-VERSION'] || apiVersion
    headers['API-TIMESTAMP'] = headers['API-TIMESTAMP'] || apiTime
    headers['API-UNIQUE-ID'] = headers['API-UNIQUE-ID'] || apiUniqueId
    headers['API-SIGNATURE'] = headers['API-SIGNATURE'] || signature
    headers['API-KEY'] = headers['API-KEY'] || apiKey
    headers['Content-Type'] = 'multipart/form-data'


    // 发送参数
    var options = {
        method,
        headers
    }
    // 如果是POST，有body则添加body
    body && (options['body'] = JSON.stringify(body))


    let timeover = false
    let setTime = null
    // 返回fetch对象，可以接.then
    return Promise.race([fetch(url.format({
        host,
        port,
        query,
        pathname,
    }), options), new Promise(function (resolve, reject) {
        setTime = setTimeout(() => {
            timeover = true
            reject('time out')
        }, sendTimeout || 15000)
    })]).then(res => {
        setTime && clearTimeout(setTime)
        if (timeover) Promise.reject('time out')
        return res.text()
    })

}
