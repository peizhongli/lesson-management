const express = require('express');
const passport = require('passport');
const multer = require('multer');
const Profile = require('../../models/Profile');

const router = express.Router();


const storage = multer.diskStorage({
  destination: `public/covers/`,
  filename: function (req, file, cb) {
    cb(null, `${new Date().valueOf()}.${file.mimetype.split('/')[1]}`)
  },
  path: function (req, file, cb) {
    cb(null, `${new Date().valueOf()}.${file.mimetype.split('/')[1]}`)
  },
})
const upload = multer({ storage })

// $route GET api/profiles/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'profile works' });
});

// $route POST api/profiles/add
// @desc 创建信息接口
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), upload.single('cover'), (req, res) => {
  console.log(req.body)
  console.log(req.file)
  let cover = ''
  if (req.file !== undefined) {
    cover = `http://localhost:5000/${req.file.destination}${req.file.filename}`
  } else {
    cover = 'http://localhost:5000/assets/img/solved.png'
  }
  let profileFileds = {
    title: req.body.title,
    describe: req.body.describe,
    type: req.body.type,
    author: req.headers.username,
    collections: [],
    likes: [],
    discussion: [],
    cover,
  };
  new Profile(profileFileds).save().then(profile => {
    let { title, describe, type, author, cover } = profile
    let newProfile = { title, describe, type, author, cover }
    res.json(newProfile);
  })
})

// $route POST api/profiles/uploadImg
// @desc 上传图片
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), upload.single('cover'), (req, res, next) => {
  console.log(req.file)
  console.log(req.body)
  const url = `/${req.file.destination}${req.file.filename}`
  res.json({
    url,
    success: true,
    mes: '上传成功',
  })
})

// $route GET api/profiles/all
// @desc 获取所有信息
// @access private
router.get('/all', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find().sort({ 'date': -1 })
    .then(profile => {
      if (!profile) {
        return res.status(404).json('没有任何内容');
      }
      let user = req.headers.username
      let newProfile = []
      profile.map(item => {
        let collected = ''
        let liked = ''
        if (item.collections.indexOf(user) !== -1) {
          collected = true
        } else {
          collected = false
        }
        if (item.likes.indexOf(user) !== -1) {
          liked = true
        } else {
          liked = false
        }
        newProfile.push({
          id: item.id,
          title: item.title,
          describe: item.describe,
          type: item.type,
          author: item.author,
          cover: item.cover,
          collected,
          liked,
          date: item.date,
          likes: item.likes,
          discussion: item.discussion,
        })
      })
      res.json(newProfile);
    })
    .catch(err => {
      res.status(404).json(err);
    })
})

// $route GET api/profiles/:author
// @desc 获取某作者的所有信息
// @access private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find({ 'author': req.headers.username })
    .then(profile => {
      if (!profile) {
        return res.status(404).json('没有任何内容');
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(err);
    })
})

// $route GET api/profiles/:id
// @desc 获取单个信息
// @access private
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ _id: req.params.id })
    .then(profile => {
      if (!profile) {
        return res.status(404).json('没有任何内容');
      }
      let user = req.headers.username
      let newProfile = {}
      let collected = ''
      let liked = ''
      if (profile.collections.indexOf(user) !== -1) {
        collected = true
      } else {
        collected = false
      }
      if (profile.likes.indexOf(user) !== -1) {
        liked = true
      } else {
        liked = false
      }
      newProfile = {
        id: profile.id,
        title: profile.title,
        describe: profile.describe,
        type: profile.type,
        author: profile.author,
        cover: profile.cover,
        collected,
        liked,
        date: profile.date,
        likes: profile.likes,
        discussion: profile.discussion,
      }
      res.json(newProfile);
    })
    .catch(err => {
      res.status(404).json(err);
    })
})

// $route POST api/profiles/edit/:id
// @desc 编辑信息接口
// @access private
router.put('/edit/:id', passport.authenticate('jwt', { session: false }), upload.single('cover'), (req, res) => {
  console.log(req.body)
  console.log(req.file)
  let cover = ''
  if (req.file !== undefined) {
    cover = `http://localhost:5000/${req.file.destination}${req.file.filename}`
  } else {
    cover = req.body.cover
  }
  let profileFileds = {
    title: req.body.title,
    describe: req.body.describe,
    type: req.body.type,
    author: req.headers.username,
    collections: [],
    likes: [],
    discussion: [],
    cover,
  };

  Profile.findOneAndUpdate(
    { _id: req.params.id },
    { $set: profileFileds },
    { new: true }
  ).then(profile => res.json(profile))
})

// $route POST api/profiles/collect/:id
// @desc 收藏信息接口
// @access private
router.post('/collect/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.body.status)
  if (req.body.status === 1) {
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { collections: req.headers.username } },
      { new: true }
    ).then(profile => res.json(profile))
  } else if (req.body.status === 0) {
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { collections: req.headers.username } }
    ).then(
      profile => {
        console.log(res)
        res.json(profile)
      })
  }
})

// $route POST api/profiles/like/:id
// @desc 点赞信息接口
// @access private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.body.status)
  console.log(req.params.id)
  if (req.body.status === 1) {
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { likes: req.headers.username } },
      { new: true }
    ).then(profile => res.json(profile))
  } else if (req.body.status === 0) {
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: req.headers.username } }
    ).then(
      profile => {
        console.log(res)
        res.json(profile)
      })
  }
})

// $route POST api/profiles/delete/:id
// @desc 删除信息接口
// @access private
router.delete('/delete/:id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOneAndRemove({ _id: req.params.id })
    .then(profile => {
      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json('删除失败'))
})

module.exports = router;
