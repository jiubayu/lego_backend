module.exports = {
  success({ctx, res, msg}) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      msg: msg || '请求成功',
    };
    ctx.status = 200;
  },
  error({ ctx, errorType, errors }) {
    const { errorno, message } = errorType;
    ctx.body = {
      errorno,
      message,
      errors,
    };
    ctx.status = 200; 
  },
};