const Koa = require('koa')
const app = new Koa()
const bodyparser  = require('koa-bodyparser')
const routing = require('./routes');

// 错误处理
const error = require('koa-json-error')

// 参数校验
const parameter = require('koa-parameter');

// 错误处理
app.use(error({
  postFormat: (e, {stack, ...rest}) =>  process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

// 批量注册路由
routing(app);

app.use(bodyparser())

app.use(parameter(app))

app.listen(3000, () => {console.log('程序已经启动了  port: 3000')})