const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 创建Schema
const profileSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  describe: {
    type: String
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  collections: {
    type: Array
  },
  likes: {
    type: Array
  },
  discussion: {
    type: Array
  },
  cover: {
    type: String
  },
  articlePath: {
    type: String
  },
  views: {
    type: Number
  },
  subscription: {
    type: Array
  },
  articleList: {
    type: Array
  }
});

module.exports = Profile = mongoose.model('profile', profileSchema);
