const mongoose = require('mongoose')
const {Schema, model} = mongoose

const usersSchema = new Schema({
  __v:{
    type: Number,
    select: false
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  status: {
    type: Number,
    default: 0
  }
})

module.exports = model('users', usersSchema);
