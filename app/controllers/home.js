const path = require('path')

class Home {
  index(ctx) {
    ctx.body = 'home'
  }

  upload (ctx) {
    const file = ctx.request.files.file;
    const basename = path.basename(file.path);
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` };
  }
}

module.exports = new Home();