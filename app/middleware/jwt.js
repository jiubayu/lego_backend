const {verify} = require('jsonwebtoken');
const {userErrorMessage} = require('../errorMessages');
function getTokenValue(ctx) {
  // JWT Header 格式
  // Authorization：Bearer tokenxxx
  const {authorization} = ctx.header;
  if (!authorization) {
    return false;
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    if (parts.length === 2) {
      const schema = parts[0];
      const credentials = parts[1];
      if (/^Bearer$/i.test(schema)) {
        return credentials;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
module.exports = (options) => {
  return async (ctx, next) => {
    const token = getTokenValue(ctx);
    if (!token) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['loginvalidateFailInfo'],
      });
    }
    const {secret} = options;
    // 判断secret是否存在
    if (!secret) {
      throw new Error('secret not provided');
    }
    try {
      const decoded = verify(token, secret);
      ctx.state.user = decoded;
      await next();
    } catch (e) {
      return ctx.helper.error({
        ctx,
        errorType: userErrorMessage['loginvalidateFailInfo'],
      });
    }
  };
};
