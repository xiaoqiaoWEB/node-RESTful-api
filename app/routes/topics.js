const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const jwt = require('koa-jwt');
const { secret } = require('../config')

const {find, create, findById, updata } = require('../controllers/topics')

const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, updata)

module.exports = router;