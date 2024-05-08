module.exports = class AppBoot {
  constructor(app) {
    this.app = app;
    app.sessionMap = {};
    app.sessionStore = {
      async get(key) {
        app.logger.info('key', key);
        return app.sessionMap[key];
      },
      async set(key, value) {
        app.logger.info('key-value', key, value);
        return app.sessionMap[key] = value;
      },
      async destroy(key) {
        delete app.sessionMap(key); 
      }
    };
  }
  async willReady() {
    // console.log('enable willReady', this.app.config.coreMiddleware);
  }
  async didReady() {
    // console.log('middleware', this.app.middleware);
  }
}
