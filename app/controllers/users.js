const User = require('../model/users')
const jswebtoken = require('jsonwebtoken')
const { secret } = require('../config')

class Users {

  // 关注 取消关注是 判断用户是否存在
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if(!user) {
      ctx.throw(404, '用户不存在！')
    }
    await next();
  }

  async index(ctx) {
    let { fileds = '', pre_page = 5} = ctx.query;
    let page = Math.max(ctx.query.page * 1, 1) - 1;
    let prePage = Math.max(pre_page * 1, 1);
    let seleteFileds = fileds.split(';').filter(k => k).map(k => '+' + k);
    let toal = await User.find({name: new RegExp(ctx.query.q)}).count();
    let data = await User.find({name: new RegExp(ctx.query.q)}).limit(prePage).skip(prePage*page).select(seleteFileds);

    ctx.body = {
      toal,
      page: page+1,
      pre_page: prePage,
      result: data
    }
  }

  async getById(ctx) {
    let { fileds = '' } = ctx.query;

    let seleteFileds = fileds.split(';').filter(k => k).map(k => '+' + k);

    let user = await User.findById(ctx.params.id).select(seleteFileds)
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
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
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
    const token = jswebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = { token }
  }

  // 特定用户的 关注者
  async followingList(ctx) {
    let user = await User.findById(ctx.params.id).select('+following').populate('following')
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.body = user.following;
  }

  // 粉丝 列表
  async listFollowers(ctx) {
    const users = await User.find({following: ctx.params.id})
    ctx.body = users;
  }
  
  // 关注一个人
  async following(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    if(!me.following.map(k => k.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204;
  }

  // 取消关注 一个人
  async unfollowing (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following.map(k => k.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204;
  }
}

module.exports = new Users();