const axios = require('axios');
const HttpsProxyAgent = require("https-proxy-agent");

// 隧道域名和端口
let tunnelHost = 'http-dynamic-S02.xiaoxiangdaili.com'
let tunnelPort = '10030'

const data = {
    "address":"nibi1emw7sqzrdufg0x7emgk0ujfwn6379pq3sqzkjf",
    "coins":["10000000unibi","100000000000unusd"]
}
// 配置用户名和密码
let username = '911860910896074752';
let password = 'mEPDDTvL';



(async () => {
    const res = await axios({
        url: 'https://faucet.testnet-1.nibiru.fi/',
        method: "post",
        data: data,
        httpAgent: new HttpsProxyAgent(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`),
        httpsAgent: new HttpsProxyAgent(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`),
    })
    console.log(res)
})();
