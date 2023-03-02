'use strict';

const { Controller } = require('egg');
const childProcess = require("child_process");
const spawn = require('cross-spawn');
var shell = require('shelljs');

class HomeController extends Controller {
  async transfer() {
    const { logger, ctx, config, service } = this;
    try {
        logger.debug('请求参数：%j', ctx.request.body);
       
        /**
         * address 接收地址
         * type 接收类型 all unibi unusd
         * amount 接收次数 每次"10000000unibi","100000000000unusd
         */
        let {address,type, amount, enable} = ctx.request.body;
        //校验通过
        let result = await service.nibiru.transfer(address,type, amount, enable);
        ctx.body = result;
    } catch (error) {
        logger.error(error);

        return
    }
  }

  async getTransferStatus() {
    const { logger, ctx, config, service } = this;
    try {
    
        /**
         * address 接收地址
         * type 接收类型 all unibi unusd
         * amount 接收次数 每次"10000000unibi","100000000000unusd
         */
        //校验通过
        ctx.body = this.config.transferStatus;
    } catch (error) {
        logger.error(error);
        return
    }
  }
}

module.exports = HomeController;
