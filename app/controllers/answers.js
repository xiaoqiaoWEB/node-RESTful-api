const Answer = require('../model/answers')

class AnswerCtl {

  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer');
    if(!answer) {
      ctx.throw(404, '问题不存在！')
    }
    if(answer.questionId != ctx.params.questionId) {
      ctx.throw(404, '该问题下没有这个 答案！')
    }
    ctx.state.answer = answer;
    await next();
  }

  async checkAnserer(ctx, next) {
    const { answer } = ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限'); }
    await next();
  }

  async find (ctx) {
    let { fileds = '', pre_page = 5} = ctx.query;
    let page = Math.max(ctx.query.page * 1, 1) - 1;
    let prePage = Math.max(pre_page * 1, 1);
    const q = new RegExp(ctx.query.q);

    let answer = await Answer
      .find({content: q, questionId: ctx.params.questionId})
      .limit(prePage).skip(page * prePage);
    
    ctx.body = answer;
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
    const answer = 
      await Answer
        .findById(ctx.params.id)
        .select(selectFields)
        .populate('answerer');
    ctx.body = answer;
  }

  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true}
    })
    let answerer = ctx.state.user._id;
    let questionsId = ctx.params.questionsId;
    const answer = 
      await new Answer({...ctx.request.body, answerer, questionsId}).save();
    ctx.body = answer;
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    });
    await ctx.state.answer.update(ctx.request.body);
    ctx.body = ctx.state.answer;
  }

  async delete(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new AnswerCtl();