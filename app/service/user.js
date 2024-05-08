const { Service } = require("egg");
const Dysmsapi = require('@alicloud/dysmsapi20170525');
const $Util = require('@alicloud/tea-util');
class UserService extends Service {
  async createByEmail(payload) {
    const {ctx} = this;
    const { username, password } = payload;
    const hash = await ctx.genHash(password);
    const userCreateData = {
      username,
      password: hash,
      email: username,
    };
    return ctx.model.User.create(userCreateData);
  }
  async loginByCellPhone(cellphone) {
    const { ctx, app } = this;
    const user = await this.findByUsername(cellphone);
    // 检查user是否存在
    if (user) {
      // generate token
      const token = await app.jwt.sign({ username: user.username }, app.config.jwt.secret);
      return token;
    }
    // 新建一个用户
    const userCreateData = {
      username: cellphone,
      phoneNumber: cellphone,
      nickName: `乐高${cellphone.slice(-4)}`,
      type: 'cellphone',
    };
    const newUser = await ctx.model.User.create(userCreateData);
    const token = await app.jwt.sign({ username: newUser.username }, app.config.jwt.secret);
    return token;
  }
  async findById(id) {
    return this.ctx.model.User.findById(id);
  }
  async findByUsername(username) {
      return this.ctx.model.User.findOne({username});
  }
  async sendSMS(phoneNumber, veriCode) {
    const { app } = this;
    // 配置参数
    const sendSMSRequest = new Dysmsapi.SendSmsRequest({
      signName: '阿里云短信测试',
      templateCode: 'SMS_154950909',
      phoneNumbers: '13262980717',
      templateParam: `{\"code\":\"${veriCode}\"}`,
    });
      let runtime = new $Util.RuntimeOptions({});
    const resp = await app.ALClient.sendSmsWithOptions(sendSMSRequest, runtime);
    return resp;
  }
}
module.exports = UserService;
