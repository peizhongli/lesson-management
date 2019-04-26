//login & register
const express = require('express');
const bcrypt = require('bcrypt');
// const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const keys = require('../../config/keys');
const passport = require('passport');
const multer = require('multer');

const router = express.Router();
const storage = multer.diskStorage({
  destination: `public/avatar/`,
  filename: function (req, file, cb) {
    cb(null, `${new Date().valueOf()}.${file.mimetype.split('/')[1]}`)
  },
  path: function (req, file, cb) {
    cb(null, `${new Date().valueOf()}.${file.mimetype.split('/')[1]}`)
  },
})
const upload = multer({ storage })

// $route GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get('/test',(req,res) => {
  res.json({msg:'login works'});
});

// $route POST api/users/register
// @desc 返回的请求的json数据
// @access public
router.post('/register', (req,res)=>{
  console.log(req.body);
  // 查询数据库中是否存在
  User.findOne({email:req.body.email})
    .then((user)=>{
      if(user){
        return res.status(400).json('邮箱已被注册');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar: 'http://localhost:5000/assets/img/avatar.png',
          identity: req.body.identity,
          password: req.body.password
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, (err, hash)=> {
            // Store hash in your password DB.
            if(err) {
              console.log(err);
            } else {
              newUser.password = hash;
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            }
          });
        });
      }
    })
});

// $route POST api/users/login
// @desc 返回token jwt passport
// @access public
router.post('/login',(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  // 查询数据库
  User.findOne({email})
    .then(user => {
      if(!user) {
        return res.status(404).json('用户不存在');
      } else {
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            const rule = {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
              identity: user.identity
            };
            // 规则 加密名字 过期时间 箭头函数
            jwt.sign(rule,keys.secretOrKey,{expiresIn:36000},(err, token) => {
              if(err) throw err
              res.json({
                success: true,
                token: 'Bearer ' + token,
                name: user.name
              });
            })
          } else {
            return res.status(400).json('密码错误');
          }
        });
    }
  });
})

// $route POST api/users/update
// @desc 修改个人信息
// @access private
router.put('/update/:id', passport.authenticate('jwt', { session: false }), upload.single('avatar'), (req, res, next) => {
  console.log(req.body)
  console.log(req.file)
  let avatar = ''
  if (req.file !== undefined) {
    avatar = `http://localhost:5000/${req.file.destination}${req.file.filename}`
  } else {
    avatar = req.body.avatar
  }
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: {
      name: req.body.name,
      email: req.body.email,
      avatar: avatar
    }},
    { new: true }
  ).then(user => res.json('更新个人信息成功'))
})

// $route GET api/users/current
// @desc return current user
// @access private
router.get('/current', passport.authenticate('jwt',{session:false}), (req, res)=>{
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity,
    avatar: req.user.avatar
  });
})

module.exports = router;
