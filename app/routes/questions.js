const Router = require('koa-router');
const router = new Router({ prefix: '/questions' });
const jwt = require('koa-jwt');
const { secret } = require('../config');

const auth = jwt({ secret });

const {
  create, find, findById, checkQuestionExist, checkQuestioner, update,
} = require('../controllers/questions');

router.get('/', find);
router.post('/', auth, create);
router.get('/:id', checkQuestionExist, findById);
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update);
//router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del);

module.exports = router;