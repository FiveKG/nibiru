/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1667490341341_7766';

  config.security = {
    // 关闭csrf验证
    csrf: {
        enable: false,
    },
    // 白名单
    domainWhiteList: ['*']
};

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
        credentials: true, 
    };

  // add your middleware config here
  config.middleware = [];
  

  config.requestIsOk = true;

  config.transferisOk = true;

  config.currentWallet = {};

  config.transferStatus = {
      address:"",
      type: "all",
      amount: 0,
      enable: false
  };

  config.transferIsOk = true;
  //sql配置
  config.mysql = {
    // 单数据库信息配置
    client: {
    // host
    host: '127.0.0.1',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: 'Uranus12#$',
    // 数据库名
    database: 'nibiru',
    supportBigNumbers: true, //处理大数字（BIGINT和DECIMAL）时需要启动此项（默认false）
    bigNumberStrings: true //使用supportbignumbers和bignumberstrings时总是返回JavaScript字符串对象（默认false）
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
};


config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'root@Uranus12#$',
      db: 0,
    },
}

config.index = 0;

// [
//     {
//       "name": "string",
//       "address": "string",
//       "pubkey": "string"
//     }
// ]
  config.walletList = [{
      name: "vienajaro02"
  }]; 

  config.receiver = "nibi1cvc238jgjryukxww78u6tnc3g3jfutc7zjrxra"

  
  config.fsIsOk = true;
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
