const {userErrorMessage} = require('../errorMessages');
module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error && error.status === 401) {
        return ctx.helper.error({
          ctx,
          errorType: userErrorMessage['loginvalidateFailInfo'],
        });
      } else {
        throw error;
      }
    }
  };
};
