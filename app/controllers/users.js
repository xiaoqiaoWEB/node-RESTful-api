class Users {
  index(ctx) {
    ctx.body = 'user'
  }

  add(ctx) {
    ctx.verifyParams({
      name: {type: 'string'}
    })
    console.log(ctx.request.body)
    ctx.body = '123'
  }
}

module.exports = new Users();