const Router = require('koa-router')
const router = new Router()

const {index, add} = require('../controllers/users')

router.get('/users', index)

router.post('/users', add)

module.exports = router;