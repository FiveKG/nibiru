const Subscription = require('egg').Subscription;
const fs = require("fs");
const path = require("path")
let jsonPath = path.join(__dirname, "../../config/isRequestAddr.json")
const http = require("http"); 
const https = require('https')
const url = require("url");
const axios = require('axios');
const HttpsProxyAgent = require("https-proxy-agent");

class Faucet extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
      return {
        interval: '2s', // 2s 间隔
        type: 'all', // 指定所有的 worker 都需要执行
        immediate: true,
        // disable: true
      };
    }
  
    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        if(!await this.ctx.helper.checkNetwork())
          return

        let wallet = await this.ctx.helper.genUser();
        console.log("生成用户:",wallet)

        await this.ctx.helper.sleep(1500)
        let response;
          try {
            response = await this.ctx.helper.faucet(wallet.address);
          } catch (error) {
            console.error(error)
            return
          }
        if (!response || !response.body || response.statusCode != 200) {
            console.log('================请求水失败:',wallet.address)
            console.log('================失败原因:',response)
            return
        }



        let insertParam = {
            address: wallet.address,
            name: wallet.name,
            sk: wallet.sk,
            create_time: this.ctx.helper.getNow()
        }
        let insertSql = `INSERT INTO faucet3 (address, name, sk, create_time) 
                        VALUES
                        (:address, :name, :sk,  :create_time);`;
        await this.app.mysql.query(insertSql, insertParam);

        console.log("领水成功:",wallet.address)

        // //写进文件记录
        // let array = fs.readFileSync(jsonPath, "utf8");
        // let parsedArray = JSON.parse(array);
        // parsedArray.push(wallet);
        // fs.writeFileSync(jsonPath, JSON.stringify(parsedArray, null, 2), 'utf8');
        // await this.app.redis.set(this.config.redisConf.normalPeers, JSON.stringify(normalPeer)); 

        this.config.currentWallet = {};
        // this.config.index += 1;
        // this.config.requestIsOk = true;
    }
  }
  
  module.exports = Faucet;
