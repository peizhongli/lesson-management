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
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', profileSchema);
