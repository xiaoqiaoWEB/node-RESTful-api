const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const jwt = require('koa-jwt');
const { secret } = require('../config')

const {
  find, create, findById, updata, listFollowers, checkTopicExist,
  listQuestion
} = require('../controllers/topics')

const auth = jwt({ secret })

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, checkTopicExist, updata)
router.get('/:id/followers', checkTopicExist, listFollowers);
router.get('/:id/question', listQuestion);

module.exports = router;