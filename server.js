const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

//引入users
const users = require('./routes/apis/users');
const profiles = require('./routes/apis/profiles');
// DB config
const db = require('./config/keys').mongoURI;
// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//connect to mongodb
mongoose.connect(db, {useNewUrlParser: true})
        .then(() => console.log(`mongoDB connected`))
        .catch(err => console.log(err));

//使用routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);

const port = process.env.PORT || 5000;

// passport初始化
app.use(passport.initialize());
require('./config/passport')(passport);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 格式化日期
function dateFormat(date, fmt) {
  if (null == date || undefined == date) return '';
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

Date.prototype.toJSON = function () {
  return dateFormat(this, 'yyyy-MM-dd hh:mm:ss')
}
