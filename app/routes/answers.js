const Router = require('koa-router');
const router = new Router({ prefix: '/questions/:questionsId/answers' });
const jwt = require('koa-jwt');
const { secret } = require('../config');

const auth = jwt({ secret });

const {
  create, find, findById, checkAnswerExist, checkAnserer, update,
  delete: del
} = require('../controllers/answers');

router.get('/', find);
router.post('/', auth, checkAnswerExist, create);
router.get('/:id', checkAnswerExist, findById);
router.patch('/:id', auth, checkAnswerExist, checkAnserer, update);
router.delete('/:id', auth, checkAnswerExist, checkAnserer, del);

module.exports = router;