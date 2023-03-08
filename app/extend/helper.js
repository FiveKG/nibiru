//@ts-check
'use strict'
const stringRandom = require('string-random');
const childProcess = require("child_process");
const spawn = require('cross-spawn');
const axios = require('axios');
const HttpsProxyAgent = require("https-proxy-agent");
const dateFns = require('date-fns');
const Humanoid = require("humanoid-js");
const { checkServerIdentity } = require('tls');


module.exports = {

    async genUser() {
        const name = stringRandom(8);
        let output = childProcess.execSync(`/root/addAddr.sh ${name}`).toString();
        let addressIndex = output.indexOf("address:");
        let pubkeyIndex = output.indexOf("pubkey:");
        let mnemonicIndex = output.indexOf("mnemonic:");
        let skIndex = output.indexOf("password.");

        let address = output.slice(addressIndex+"address:".length, pubkeyIndex).trim();
        let pubkey = output.slice(pubkeyIndex+"pubkey:".length, mnemonicIndex).trim();
        let sk = output.slice(skIndex+"password.".length).trim();
        this.app.config.newUser = {name, address, pubkey};
        return {name, address, pubkey, isFaucet: false, isSendB: false, isSendU: false, sk:sk};
    },

    async checkNetwork() {
         // 隧道域名和端口
         let tunnelHost = 'http-dynamic-S03.xiaoxiangdaili.com'
         let tunnelPort = '10030'
 
         //curl -X POST -d '{"address": "'"$ADDR"'", "coins": ["11000000unibi","100000000000unusd","100000000000usdt"]}' $FAUCET_URL  100,000,000
        const data = {
            "address":"nibi1cvc238jgjryukxww78u6tnc3g3jfutc7zjrxra",
            "coins":["110000000unibi","1000000000unusd","1000000000uusdt"]
        }
         // 配置用户名和密码
         let username = '948474751868096512';
         let password = 'Qtelb2BV';
             // ... some code
         const headers = {
                 "Accept": "*/*",
                 "Accept-Encoding": "gzip, deflate, br",
                 "Connection": "keep-alive",
                 "Content-Length": Buffer.byteLength(JSON.stringify(data)),
                 "user-agent": "PostmanRuntime/7.31.1",
                 'Content-Type': 'application/json',
             };


        try {
             let humanoid = new Humanoid(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`);
             let response = await humanoid.post("https://faucet.itn-1.nibiru.fi/", JSON.stringify(data), headers)
             // })
             if (response.statusCode === 503 )
                return false
            return true
         } catch (error) {
             throw(error)
         }
    },

         /**
     * @description 返回当前时间
     * @returns {String}}
     */
          getNow() {
            return dateFns.format(new Date(), "yyyy-MM-dd HH:mm:ss");
        },
    

    /**
     * 发送亲贵
     */
    async faucet(address){
        // 隧道域名和端口
        let tunnelHost = 'http-dynamic-S03.xiaoxiangdaili.com'
        let tunnelPort = '10030'

        //curl -X POST -d '{"address": "'"$ADDR"'", "coins": ["11000000unibi","100000000000unusd","100000000000usdt"]}' $FAUCET_URL  100,000,000

        const data = {
            "address":address,
            "coins":["110000000unibi","1000000000unusd","1000000000uusdt"]
        }

        // 配置用户名和密码
        let username = '948474751868096512';
        let password = 'Qtelb2BV';
            // ... some code
        const headers = {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Content-Length": Buffer.byteLength(JSON.stringify(data)),
                "user-agent": "PostmanRuntime/7.31.1",
                'Content-Type': 'application/json',
            };
        try {
            let humanoid = new Humanoid(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`);
            let response = await humanoid.post("https://faucet.itn-1.nibiru.fi/", JSON.stringify(data), headers)

            // console.log(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`)
            // let response = await axios({
            //     headers,
            //     url: 'https://faucet.itn-1.nibiru.fi/',
            //     method: "post",
            //     data: JSON.stringify(data),
            //     httpAgent: new HttpsProxyAgent(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`),
            //     httpsAgent: new HttpsProxyAgent(`http://${username}:${password}@${tunnelHost}:${tunnelPort}`),
            // })
            
            return response
        } catch (error) {
            throw(error)
        }
    },

    async transferB(name, receiver) {
        try {
             //发送b
            //  const outputBuff = spawn.sync("expect", ['/root/echo.sh',name, receiver], {
            //     stdio: 'pipe',
            //     cwd: process.cwd(),
            //     env: process.env,
            //     timeout: 10*1000
            // });
            // console.log('====================stdout',outputBuff.stdout.toString('utf8'));
            // console.log('====================stderr',outputBuff.stderr.toString('utf8'));

            // //超时设计
            // if (outputBuff.signal === 'SIGTERM') {
            //     console.error("执行超时");
            //     return false
            // }
            // let ERROR = Buffer.from([0x1b, 0x5b, 0x39, 0x31, 0x6d, 0x45, 0x52, 0x52, 0x4f, 0x52]);//源码中对'ERROR'的八位字节定义
            // outputBuff.output.forEach(element => {
            //     if (element) {

            //         console.log("==============element.utf8",element.toString('utf8'))
            //         //对于utf8编码格式的字符串提供更好的支持
            //         // let decoder = new StringDecoder('utf8');
            //         //存在错误信息
            //         if( element.indexOf(ERROR) !== -1) {
            //             console.log("执行错误:",{status: 'ERROR', message: element.slice(0, element.indexOf('Error: stack')).toString('base64')})
            //             return false
            //         }
            //     }
            // });  

                // const child = childProcess.execFileSync('/root/sendB.sh', [name, receiver])
                // console.log("child================>",child.toString())
                
　　
            // const exec = childProcess.spawn("nibid", ["tx", "bank", "send", name, receiver, "10000000unibi", "-y", "--chain-id=nibiru-testnet-1"], {
            //     stdio: "pipe"
            //   });
              
            //   exec.stdout.on("data", (data) => {
            //     console.log("stdout", data.toString());
            //     exec.stdin.write("WUgong7758258=-\r");
            //   });
              
            //   exec.stderr.on("data", (data) => {
            //     console.log("stderr", data.toString());
            //     exec.stdin.write("WUgong7758258=-\r");
            //   });
              
            //   exec.on("close", (code) => {
            //     console.log(`exit ${code}`);
            //   });

            //   console.log('==============exec',exec)

            // let outputBuff = childProcess.exec(`nibid tx bank send ${name} ${receiver} 10000000unibi -y --chain-id=nibiru-testnet-1`, function (err, stdout, stderr) {
            //     console.log(stdout);   // 直接查看输出
            //   });
            
            //   outputBuff.send('WUgongxin7758258=-\r');   // 输入
            // outputBuff.stdin.end(); 


            // let outputBuff = childProcess.execSync(`/root/balance.sh ${receiver}`);
//             let outputBuff = childProcess.execSync(`/usr/bin/expect <<-EOF
// set timeout 30
// spawn nibid tx bank send ${name} ${receiver} 10000000unibi -y --chain-id=nibiru-testnet-1
// expect "passphrase:"
// send "WUgong7758258=-\r"
// expect eof
// EOF`);
            //  let output = outputBuff.toString()
            //  let codeIndex = output.indexOf("code: 0");
            //  console.log('===========后==========outputB',output)

            //  //虚拟机交易失败
            //  if(codeIndex == -1) {
            //      console.error("teansfer U EVM task success: false")
            //      return false
            // }
            // let tx = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
            return false

        } catch (error) {
            console.error(error)
            throw error;
        }
    },

    async transferU(name, receiver) {
        try {
             //发送b
             console.log(`/root/sendU.sh ${name} ${receiver}`)
             let outputBuff = childProcess.execSync(`/root/sendU.sh ${name} ${receiver}`);
             let output = outputBuff.toString()
             console.log('=====================outputU',output)
             let codeIndex = output.indexOf("code: 0");
             //虚拟机交易失败
             if(codeIndex == -1) {
                 console.error("transfer B EVM task success: false")
                 return false
            }
            let tx = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
            return tx

        } catch (error) {
            console.error(error)
            throw error;
        }
    },

    sleep(ms) {
        return new Promise(resolve=>setTimeout(resolve, ms))
    }
} 