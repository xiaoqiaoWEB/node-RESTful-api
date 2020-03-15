const Router = require('koa-router')
const router = new Router({prefix: '/users'})

const {index, add, getById, update, del, login} = require('../controllers/users')

router.get('/', index)

router.post('/', add)

router.get('/:id', getById)

router.patch('/:id', update)

router.delete('/:id', del)

router.post('/login', login)

module.exports = router;