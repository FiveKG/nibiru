
'use strict';

const Service = require('egg').Service;

class NibiruService extends Service {
    async transfer(address,type, amount, enable) {
        const { logger, ctx, config, service } = this;
        try {
            //init transferStaus
            let insertParam = {
                address:"",
                type: 3,
                amount: 0,
                enable: false,
                create_time: ctx.helper.getNow()
            };
            if (enable == true) {
                insertParam = {address,type, amount, enable, create_time: ctx.helper.getNow()}
            }

            let insertSql = `INSERT INTO request(address, type, amount, enable, create_time) 
            VALUES
            (:address, :type, :amount, :enable, :create_time);`;
            let res = await this.app.mysql.query(insertSql, insertParam);
            return res;

        } catch (error) {
            throw error
        }
    }
}

module.exports = NibiruService;
