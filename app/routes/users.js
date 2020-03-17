const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jsonwebtoken = require('jsonwebtoken')
const jwt = require('koa-jwt');
const { secret } = require('../config')

const { index, add, getById, update, del, login, checkOwner, followingList, checkUserExist, following, unfollowing, listFollowers} = require('../controllers/users')

// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header;
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jsonwebtoken.verify(token, secret);
//     ctx.state.user = user;
//   } catch (error) {
//     ctx.throw(401, error.message)
//   }
//   await next();
// }

const auth = jwt({ secret })

router.get('/', index)
router.post('/', add)
router.get('/:id', getById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, del)
router.post('/login', login)
router.get('/:id/following', followingList)
router.get('/:id/followers', listFollowers)
router.put('/following/:id', auth, checkUserExist, following)
router.delete('/following/:id', auth, checkUserExist, unfollowing)

module.exports = router;