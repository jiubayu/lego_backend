const {appendFileSync} = require('fs');
const logger = (options, app) => {
  return async (ctx, next) => {
    const startTime = Date.now();
    const requestTime = new Date();
    await next();
    const ms = Date.now() - startTime;
    const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
    if(options.allowedMethod.includes(ctx.method)) {
       appendFileSync('./logger.txt', logTime + '\n');
    }
  }
}
module.exports = logger;