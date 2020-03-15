const Koa = require('koa')
const app = new Koa()
//const bodyparser  = require('koa-bodyparser')
const routing = require('./routes');
const mongoose = require('mongoose');
const koaBody = require('koa-body')
const path = require('path')
const koaStatic = require('koa-static')

mongoose.connect('mongodb://localhost/zhihu', { useUnifiedTopology: true }, () => {
  console.log('数据库启动成功')
});

// 静态服务
app.use(koaStatic(path.join(__dirname, 'public')))

// 错误处理
const error = require('koa-json-error')

// 参数校验
const parameter = require('koa-parameter');

// 错误处理
app.use(error({
  postFormat: (e, {stack, ...rest}) =>  process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))

// 配置上传文件的 中间件
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true, // 保留文件的 后缀名
  }
}))

// 批量注册路由
routing(app);
app.use(parameter(app))

app.listen(3000, () => {console.log('程序已经启动了  port: 3000')})