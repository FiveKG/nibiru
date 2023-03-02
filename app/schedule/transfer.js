const Subscription = require('egg').Subscription;
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

class Transfer extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
      return {
        interval: '3s', // 1 分钟间隔
        type: 'worker', // 指定所有的 worker 都需要执行
        disable: true,
        immediate: true
      };
    }
  
    // subscribe 是真正定时任务执行时被运行的函数
    

    async subscribe() {
        try {
        let transferConfig = this.config.transferStatus;
        console.log("===============锁状态",this.config.transferIsOk)

        if (!transferConfig.enable) {
            return
        }

        //每次执行一次发送命令，上次未完成下次需等待
        if (!this.config.transferIsOk) {
            console.log("需要等待",this.config.transferIsOk)
            return 
        }

        //加锁
        this.config.transferIsOk = false;
        // await this.ctx.helper.sleep(10000);
        
        //发送b
        if(transferConfig.type == "unibi") {
            let selectSql = `SELECT * FROM faucet WHERE status != 1 limit 1;`;
            let one = await this.app.mysql.query(selectSql);
            if (one.length < 1 )
                return
            
            let tx = await this.ctx.helper.transferB(one[0].name, this.config.transferStatus.address);
            // if(tx) {
            //     const updatebStatusSql = `UPDATE faucet SET status=1 WHERE id = :id;`;
            //     await this.app.mysql(updatebStatusSql, {id: one[0].id});

            //     let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) 
            //             VALUES
            //             (:faucetId, :tx, :type, :create_time);`;
            //     //transfer记录
            //     await this.app.mysql.query(insertSql, {faucetId:one[0].id, tx, type:1, create_time: this.ctx.helper.getNow()});
            // }
        }

        //发送u
        if(transferConfig.type == "unusd") {
            let selectSql = `SELECT * FROM faucet WHERE status != 2 limit 1;`;
            let one = await this.app.mysql.query(selectSql);
            if (one.length < 1 )
                return
            
            let tx = await this.ctx.helper.transferU(one[0].name, this.config.transferStatus.address);
            if(tx) {
                const updatebStatusSql = `UPDATE faucet SET status=2 WHERE id = :id;`;
                await this.app.mysql(updatebStatusSql, {id: one[0].id});

                let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) 
                        VALUES
                        (:faucetId, :tx, :type, :create_time);`;
                //transfer记录
                await this.app.mysql.query(insertSql, {faucetId:one[0].id, tx, type:2, create_time: this.ctx.helper.getNow()});
            }
        }

        //全部发送
        if(transferConfig.type == "all") {
            let selectSql = `SELECT * FROM faucet WHERE status = 0 limit 1;`;
            let one = await this.app.mysql.query(selectSql);
            if (one.length < 1 )
                return
            let updateStatus = 0;
            
            //transfer B
            let txB = await this.ctx.helper.transferB(one[0].name, this.config.transferStatus.address);
            console.log('==============txB=',txB)
            if(txB) {
                let txB = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
                updateStatus = 1;
                let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) 
                        VALUES
                        (:faucetId, :tx, :type, :create_time);`;
                //transfer记录
                await this.app.mysql.query(insertSql, {faucetId:one[0].id, tx:txB, type:1, create_time: this.ctx.helper.getNow()});
            }

            //transfer U
            let txU = await this.ctx.helper.transferU(one[0].name, this.config.transferStatus.address);
            console.log('==============txU=',txU)
            if(txU) {
                let txU = output.slice(output.indexOf("txhash:")+"txhash:".length).trim();
                updateStatus = 1;
                let insertSql = `INSERT INTO transfer (faucetId, tx, type, create_time) 
                        VALUES
                        (:faucetId, :tx, :type, :create_time);`;
                //transfer记录
                await this.app.mysql.query(insertSql, {faucetId:one[0].id, tx:txU, type:2, create_time: this.ctx.helper.getNow()});
            }

            console.log('==============updateStatus=',updateStatus)

            if(updateStatus!== 0) {
                const updatebStatusSql = `UPDATE faucet SET status=:status WHERE id = :id;`;
                await this.app.mysql(updatebStatusSql, {id: one[0].id,status: updateStatus});
            }
            
        }

        /**
         * amount执行次数，为0则停止执行，允许执行定时器
         */
        transferConfig.amount -= 1;
        if(transferConfig.amount === 0)
            transferConfig.enable = false;

        this.config.transferStatus = transferConfig;
        this.config.transferIsOk = true; //解锁

        } catch (error) {
            console.error(error)
            this.config.transferIsOk = true;
        }
    }
  }
  
  module.exports = Transfer;