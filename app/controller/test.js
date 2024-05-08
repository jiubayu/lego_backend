const {Controller} = require('egg');

class TestController extends Controller {
  async index() {
    const {ctx} = this;
    const {query, body} = ctx.request;
    const {id} = ctx.params;
    const resp = {
      query,
      body,
      params,
    };
    ctx.body = resp;
    ctx.status = 200;
  }
  async getDog() {
    const {service, ctx} = this;
    const resp = await service.dog.show();
    ctx.body = resp.message;
  }
}

module.exports = TestController;
