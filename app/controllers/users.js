const User = require('../model/users')
const jswebtoken = require('jsonwebtoken')
const { screat } = require('../config')

class Users {

  async index(ctx) {
    ctx.body = await User.find().select('+')
  }

  async getById(ctx) {
    console.log(ctx)
    let user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  async add(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    let { name } = ctx.request.body;
    let repetedUser = await User.findOne({ name })
    if (repetedUser) { ctx.throw(409, '用户名已经被占用') }

    let data = await new User(ctx.request.body).save();
    ctx.body = data;
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
    })

    let user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) { ctx.throw(409, '用户名已存在') }
    ctx.body = user;
  }

  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) { ctx.throw(403, '没有权限'); }
    await next();
  }

  async del(ctx) {
    let user = await User.findByIdAndDelete(ctx.params.id)
    if (!user) { ctx.throw(204, '用户不存在') }
    ctx.body = user;
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })

    const user = await User.findOne(ctx.request.body)
    if (!user) { ctx.throw(401, '用户名或密码不正确') }
    const { name, _id } = user
    // 主体 密码 过期时间
    const token = jswebtoken.sign({ _id, name }, screat, { expiresIn: '1d' })
    ctx.body = { token }
  }
}

module.exports = new Users();