const http = require('http')
const url = require("url");

const data = {
    "address":"nibi1emw7sqzrdufg0x7emgk0ujfwn6379pq3sqzkjf",
    "coins":["10000000unibi","100000000000unusd"]
}
const dataString = JSON.stringify(data);


//代理ip
const targetUrl = "https://faucet.testnet-1.nibiru.fi/";
const urlParsed = url.parse(targetUrl);

// 隧道域名
const proxy_host = "http-dynamic-S02.xiaoxiangdaili.com";  // 隧道服务器域名
const proxy_port = "10030"; // 端口号

const app_key = "911860910896074752";
const app_secret = "mEPDDTvL";
const base64 = new Buffer.from(app_key + ":" + app_secret).toString("base64");
pm2 del 
const options = {
    host: proxy_host,
    port: proxy_port,
    path: targetUrl,
    method: "POST",
    json:true,
    headers: {
        "Host": urlParsed.hostname,
        "Proxy-Authorization": "Basic " + base64,
        "Content-Length": dataString.length,
        "Content-Type":"application/json"
    },
    body:data
};

const req = http.request(options, (res)=> {
    console.log(res)
    console.log("got response: " + res.statusCode);
    res.on('data', (d)=> {
        process.stdout.write(d)
    })

    res.on('error',(error)=> {
        console.log(error);
    })
})
req.write(dataString)
req.end()