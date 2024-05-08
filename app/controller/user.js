const { Controller } = require('egg');
const { userErrorMessage } = require('../errorMessages');
const userValidateRules = {
  username: 'email',
  password: {type: 'password', min: 8},
};
const userCellphoneValidateRules = {
  phoneNumber: 'string',
  veriCode: {type: 'string', min: 4},
};
const sendCodeRules = {
  phoneNumber: {
    type: 'string',
    format: /^1[3-9]\d{9}$/,
    message: '手机号码格式错误',
  },
};
class UserController extends Controller {
  async createByEmail() {
    const {ctx, service, app} = this;
    const errors = app.validator.validate(userValidateRules, ctx.request.body);
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['uservalidateFail'],
        errors,
      });
    }
    const {username} = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['createUserAlreadyExists'],
      });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ctx, res: userData});
  }
  validateInputUserInfo(rules) {
    const {ctx, app} = this;
    return app.validator.validate(rules, ctx.request.body);
  }
  async loginByEmail() {
    const { ctx, app } = this;
    const errors = this.validateInputUserInfo( userValidateRules);
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['uservalidateFail'],
        errors,
      });
    }
    const {username, password} = ctx.request.body;
    const user = await ctx.service.user.findByUsername(username);
  
    // 1 检用户是否存在
    if (!user) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['loginCheckFailInfo'],
      });
    }
    // 2 验证密码是否正确
    const varified = ctx.compare(password, user.password);
    if (!varified) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['loginCheckFailInfo'],
      });
    }
    // ctx.cookies.set('username', user.username, {encrypt: true});
    // ctx.session.username = user.username;
    // token 组成部分 1 Registered claims 注册相关信息  
    // 2 Public claims 公共信息：should be unique  like username，email or phoneNumber
    const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret, {expiresIn: 60 * 60});
    ctx.helper.success({ctx, res: {token}, msg: '登陆成功'});
  }
  async loginByCellPhone() {
    const { ctx, app } = this;
    const { phoneNumber,veriCode } = ctx.request.body;
    const errors = this.validateInputUserInfo(userCellphoneValidateRules);
    if (errors) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['uservalidateFail'],
        errors,
      });
    }
    // 验证码是否正确
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (veriCode !== preVeriCode) {
       return ctx.helper.error({
         ctx,
         errorType: userErrorMessage['loginVerifyCodeIncorrectFailInfo'],
         errors,
       });
    }
    const token = await ctx.service.user.loginByCellPhone(phoneNumber);
    ctx.helper.success({ctx, res: {token}, msg: '登陆成功'});
  }
  async show() {
    const { ctx} = this;
    // const username = ctx.cookies.get('username', {encrypt: true});
    // const userData = await service.user.findById(ctx.params.id);
    // const { username } = ctx.session;
    const userData = await ctx.service.user.findByUsername(ctx.state.user.username);
    ctx.helper.success({ctx, res: userData.toJSON()});  
  }
  // 发送验证码
  async sendVerifyCode() {
    const { ctx, app } = this;
    const {phoneNumber } = ctx.request.body;
    const errors = this.validateInputUserInfo(sendCodeRules);
    if (errors) {
          return ctx.helper.error({
            ctx,
            errorType: userErrorMessage['uservalidateFail'],
            errors,
          }); 
    }
    // 获取redis数据
    // phoneVeriCode-13323452345
    const preVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    // 判断是否存在
    if (preVeriCode) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['sendVerifyCodeFrequentlyFailInfo'],
        errors,
      });
    }
    // 随机四位数
    // [0-1)*9000 -> [0,9000)+1000  -> [1000, 10000)
    const veriCode = (Math.floor(Math.random() * 9000 + 1000)).toString();
    // 发送短信
    // 判断是否为生产环境
    if (app.config.env === 'prod') {
       const resp = await ctx.service.user.sendSMS(phoneNumber, veriCode);
       if (resp.body.code !== 'OK') {
         return ctx.helper.error({
           ctx,
           errorType: userErrorMessage['sendVerifyCodeError'],
         });
       }
    }
    // console.log(app.config.aliCloudConfig, 'aliCloudConfig--')
    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    ctx.helper.success({ ctx, meg: '验证码发送成功', res: app.config.env === 'local'? {veriCode} : null })
  }
}
module.exports = UserController;
