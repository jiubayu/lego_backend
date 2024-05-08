/* eslint valid-jsdoc: "off" */
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const dotenv = require("dotenv");
dotenv.config();
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1714474759014_1234';

  // add your middleware config here
  config.middleware = ['customError'];
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    }
  }
  config.mongoose = {
    url: 'mongodb://localhost:27017/lego',
  };
  config.bcrypt = {
    saltRounds: 10,
  }
  config.session = {
    encrypt: false
  }
  config.jwt = {
    secret: '1234567890',
  };
  const aliCloudConfig = {
    accessKeyId: process.env.ALC_ACCESS_KEY,
    accessKeySecret: process.env.ALC_ACCESS_SECRET,
    endpoint: `dysmsapi.aliyuncs.com`,
  };
  const bizConig = {
    mylogger: {
      allowedMethod: ['POST'],
    },
    aliCloudConfig, 
    // jwt: {
    //   secret: '1234567890',
    // },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    ...bizConig,
  };
};
