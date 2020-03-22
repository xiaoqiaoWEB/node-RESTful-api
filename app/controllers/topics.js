const Topic = require('../model/topics')
const User = require('../model/users')
// const { secret } = require('../config')

class TopicCtl {

  // 关注话题是否存在
  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id);
    if(!topic) {
      ctx.throw(404, '话题不存在！')
    }
    await next();
  }

  async find(ctx) {
    let { fileds = '', pre_page = 5} = ctx.query;
    let page = Math.max(ctx.query.page * 1, 1) - 1;
    let prePage = Math.max(pre_page * 1, 1);
    let seleteFileds = fileds.split(';').filter(k => k).map(k => '+' + k);

    let toal = await Topic.find({name: new RegExp(ctx.query.q)}).count();
    let data = await Topic.find({name: new RegExp(ctx.query.q)}).limit(prePage).skip(prePage*page).select(seleteFileds)

    ctx.body = {
      toal,
      page: page+1,
      pre_page: prePage,
      result: data
    }
  }

  async findById (ctx) {
    let { fileds = '' } = ctx.query;
    let seleteFileds = fileds.split(';').filter(k => k).map(k => '+' + k);
    let data = await Topic.findById(ctx.params.id).select(seleteFileds)

    ctx.body = data;
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })

    let data = await new Topic(ctx.request.body).save()
    ctx.body = data;
  }

  async updata(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })

    let data = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)

    ctx.body = ctx.request.body;
  }

  // 话题的关注用户
  async listFollowers(ctx) {
    const users = await User.find({followingTopics: ctx.params.id})
    ctx.body = users;
  }
}

module.exports = new TopicCtl();