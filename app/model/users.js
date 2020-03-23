const mongoose = require('mongoose')
const { Schema, model } = mongoose

const usersSchema = new Schema({
  __v: {
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
  avatar_url: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true
  },
  // 简介
  headline: {
    type: String
  },
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref:'topic' }],
    select: false
  },
  business: {
    type: Schema.Types.ObjectId, 
    ref:'topic',
    select: false
  },
  employments: {
    type: [{ 
      company: { type: Schema.Types.ObjectId, ref:'topic' },
      job: { type: Schema.Types.ObjectId, ref:'topic' }
    }],
    select: false
  },
  educations: {
    type: [
      {
        school: { type: Schema.Types.ObjectId, ref:'topic' },
        major: { type: Schema.Types.ObjectId, ref:'topic' },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graduation_year: { type: Number },
      }
    ],
    select: false
  },
  // 关注
  following: {
    type: [
      { type: Schema.Types.ObjectId, ref: 'users' }
    ],
    select: false,
  },
  // 话题
  followingTopics: {
    type: [
      {type: Schema.Types.ObjectId, ref: 'topics'}
    ],
    select: false
  }
})

module.exports = model('users', usersSchema);
