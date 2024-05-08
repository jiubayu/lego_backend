const axios = require('axios');
const Dysmsapi = require('@alicloud/dysmsapi20170525');
const $OpenApi = require('@alicloud/openapi-client');
const AXIOS = Symbol('Application#axios');
const ALCLIENT = Symbol('Application#ALClient');
module.exports = {
  echo(msg) {
    const that = this;
    return `hello${msg}${that.config.name}`;
  },
  get axiosInstance() {
    if (!this[AXIOS]) {
      this[AXIOS] = axios.create({
        baseUrl: 'https://dog.ceo',
        timeout: 5000,
      })
    }
    return this[AXIOS]
  },
  get ALClient() { 
    const that = this;
    const { accessKeyId, accessKeySecret, endpoint } = that.config.aliCloudConfig;
    if (!this[ALCLIENT]) {
      const config = new $OpenApi.Config({
        accessKeyId,
        accessKeySecret,
      });
      config.endpoint = endpoint;
      // console.log(typeof Dysmsapi,Dysmsapi, 'Dysmsapi----')
      this[ALCLIENT] = new Dysmsapi.default(config);
    }
    return this[ALCLIENT];
  }
}