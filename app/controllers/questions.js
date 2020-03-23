const Qusetions = require('../model/question');

class QusetionCtl {

  async checkQuestionExist(ctx, next) {
    const question = await Qusetions.findById(ctx.params.id).select('+questioner');
    if(!question) {
      ctx.throw(404, '问题不存在！')
    }
    ctx.state.question = question;
    await next();
  }

  async find(ctx) {
    let { fileds = '', pre_page = 5} = ctx.query;
    let page = Math.max(ctx.query.page * 1, 1) - 1;
    let prePage = Math.max(pre_page * 1, 1);
    const q = new RegExp(ctx.query.q);

    let question = await Qusetions
      .find({ $or: [{ title: q }, { description: q }] })
      .limit(prePage).skip(page * prePage);
    let toal = await Qusetions.find({ $or: [{ title: q }, { description: q }] }).count();

    ctx.body = {
      toal,
      page: page + 1,
      pre_page: prePage, 
      result: question
    }
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const question = 
      await Qusetions
        .findById(ctx.params.id)
        .select(selectFields)
        .populate('questioner topics');
    ctx.body = question;
  }

  async create (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true},
      description: {type: 'string', required: false}
    })
    const question = 
      await new Qusetions({...ctx.request.body, questioner: ctx.state.user._id}).save();
    ctx.body = question;
  }

  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    console.log(question)
    if (question.questioner.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限'); }
    await next();
  }

  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
    });
    await ctx.state.question.update(ctx.request.body);
    ctx.body = ctx.state.question;
  }

  async delete(ctx) {
    await Qusetions.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new QusetionCtl();