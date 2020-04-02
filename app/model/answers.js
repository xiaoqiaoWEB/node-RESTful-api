const mongose = require('mongoose');
const {Schema, model} = mongose;

const AnswerSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  content: {
    type: String,
    required: true
  },
  answerer: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  questionsId: {
    type: String,
    required: true
  },
  voteCount: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = new model('answers', AnswerSchema)