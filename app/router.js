/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // const logger = app.middleware.mylogger({
  //   allowedMethod: ['GET']
  // }, app);
  // const jwt = app.middleware.jwt({
  //   secret: app.config.jwt.secret,
  // });
  router.get('/', controller.home.index);
  // router.get('/test/:id', controller.test.index);
  // router.post('/test/:id', controller.test.index);
  router.post('/api/users/current',app.jwt, controller.user.show);
  router.post('/api/users/create', controller.user.createByEmail);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
   router.post('/api/users/loginByPhoneNumber', controller.user.loginByCellPhone);
  router.post('/api/users/genVerifyCode', controller.user.sendVerifyCode);
};
