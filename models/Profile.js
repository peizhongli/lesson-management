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
  }
});

module.exports = Profile = mongoose.model('profile', profileSchema);
