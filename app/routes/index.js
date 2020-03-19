const fs = require('fs')

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if(file == 'index.js') {return;}
    let route = require(`./${file}`)
    app.use(route.routes())
    app.use(route.allowedMethods())
  })
}