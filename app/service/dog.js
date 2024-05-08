const {Service} = require('egg');

class DogService extends Service {
  async show() {
    const resp = await  this.ctx.curl('https://dog.ceo/api/breeds/image/random', {
      dataType: 'json',
    })
    return resp.data;
  }
}

module.exports = DogService;