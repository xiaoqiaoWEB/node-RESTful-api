const mongoose = require('mongoose')
const { Schema, model } = mongoose

const questionSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    select: false
  },
  questioner: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false,
    select: false
  },
  topics: {
    type: [{ type: Schema.Types.ObjectId, ref:'topic'}],
    select: false
  }
})

module.exports = model('questions', questionSchema);
