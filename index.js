const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router();

const usersRouter = new Router({prefix: '/users'}) 

router.get('/', (ctx) => {
  ctx.body = 'home'
})

usersRouter.get('/', (ctx) => {
  ctx.body = 'users list'
})

usersRouter.post('/', (ctx) => {
  ctx.body = 'users add'
})

usersRouter.get('/:id', (ctx) => {
  ctx.body = `users add 123`
})


app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

app.use(router.routes())
app.listen(3000)