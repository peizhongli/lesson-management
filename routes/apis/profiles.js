const express = require('express');
const passport = require('passport');
const multer = require('multer');
const Profile = require('../../models/Profile');
const fs = require('fs');

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
  if (req.body.cover !== '') {
    let buffer = Buffer.from(req.body.cover, 'base64')
    let path = `public/covers/${new Date().valueOf()}.png`
    fs.writeFile(path, buffer, function (err) {
      if (err) {
        console.log(err);
      } else {
        let profileFileds = {
          title: req.body.title,
          describe: req.body.describe,
          type: req.body.type,
          author: req.headers.username,
          collections: [],
          likes: [],
          discussion: [],
          subscription: [],
          cover: `http://localhost:5000/${path}`,
          views: 0
        };
        new Profile(profileFileds).save().then(profile => {
          let { _id, title, describe, type, author, cover } = profile
          let newProfile = { id: _id, title, describe, type, author, cover }
          res.json(newProfile);
        })
      }
    })
  } else {
    let profileFileds = {
      title: req.body.title,
      describe: req.body.describe,
      type: req.body.type,
      author: req.headers.username,
      collections: [],
      likes: [],
      discussion: [],
      cover: `http://localhost:5000/assets/img/solved.png`,
      views: 0
    };
    new Profile(profileFileds).save().then(profile => {
      let { _id, title, describe, type, author, cover } = profile
      let newProfile = { id: _id, title, describe, type, author, cover }
      res.json(newProfile);
    })
  }
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

// $route GET api/profiles/
// @desc 获取所有信息
// @access private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  let query = {}
  let limit = 8
  let skip = 0
  let sum = 0
  for (i in req.query) {
    if (i === 'title') {
      query.title = new RegExp(req.query.title, 'i')
    } else if (i === 'pageSize') {
      limit = req.query.pageSize
    } else if (i === 'currentPage') {
      skip = (req.query.currentPage - 1) * req.query.pageSize
    }
    else {
      query[`${i}`] = req.query[i]
    }
  }
  Profile.find(query).countDocuments((err, sum) => {
    if (err) {
      console.log(err)
    } else {
      sum = sum
      Profile.find(query).limit(Number(limit)).skip(Number(skip)).sort({ 'date': -1 })
        .then(profile => {
          if (!profile) {
            return res.status(404).json('没有任何内容');
          }
          let user = req.headers.username
          let newProfile = []
          profile.map(item => {
            let collected = ''
            let liked = ''
            let subscribed = ''
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
            if (item.subscription.indexOf(user) !== -1) {
              subscribed = true
            } else {
              subscribed = false
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
              subscribed,
              date: item.date,
              likes: item.likes,
              discussion: item.discussion,
              views: item.views
            })
          })
          res.json({
            sum,
            data: newProfile
          });
        })
        .catch(err => {
          console.log(err)
          res.status(400).json('查询失败');
        })
    }
  })
})


// $route GET api/profiles/hot
// @desc 获取热门信息
// @access private
router.get('/hot', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.find().limit(Number(8)).sort({ 'views': -1 })
    .then(profile => {
      if (!profile) {
        return res.status(404).json('没有任何内容');
      }
      let newProfile = []
      profile.map(item => {
        newProfile.push({
          id: item.id,
          title: item.title,
          author: item.author,
          cover: item.cover,
          date: item.date,
          likes: item.likes,
          discussion: item.discussion,
          views: item.views
        })
      })
      res.json({
        data: newProfile
      });
    })
    .catch(err => {
      console.log(err)
      res.status(400).json('查询失败');
    })
})

// $route GET api/profiles/:id
// @desc 获取单个信息
// @access private
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndUpdate({ _id: req.params.id }, { $inc: { views: 1 } })
    .then(profile => {
      if (!profile) {
        return res.status(404).json('没有任何内容');
      }
      let user = req.headers.username
      let newProfile = {}
      let collected = ''
      let liked = ''
      console.log(profile.collections.indexOf(user))
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
      if (profile.subscription.indexOf(user) !== -1) {
        subscribed = true
      } else {
        subscribed = false
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
        subscribed,
        date: profile.date,
        likes: profile.likes,
        discussion: profile.discussion,
        views: profile.views,
        articleList: profile.articleList
      }
      res.json(newProfile);
    })
    .catch(err => {
      res.status(400).json(err);
    })
})

// $route POST api/profiles/edit/:id
// @desc 编辑信息接口
// @access private
router.put('/edit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.body.cover.indexOf('http://localhost:5000/') === -1) {
    let buffer = Buffer.from(req.body.cover, 'base64')
    let path = `public/covers/${new Date().valueOf()}.png`
    fs.writeFile(path, buffer, function (err) {
      if (err) {
        console.log(err);
      } else {
        Profile.findOne({ _id: req.params.id })
          .then(profile => {
            if (profile.cover !== 'http://localhost:5000/assets/img/solved.png') {
              let oldPath = profile.cover.replace('http://localhost:5000/', '')
              fs.unlink(oldPath, err => {
                if (err) {
                  console.log(err)
                } else {
                  Profile.updateOne({ _id: req.params.id }, {
                    $set: {
                      title: req.body.title,
                      describe: req.body.describe,
                      type: req.body.type,
                      cover: `http://localhost:5000/${path}`,
                    }
                  })
                    .then(profile => {
                      res.json({
                        message: '更新成功',
                        data: profile
                      })
                    })
                }
              })
            } else {
              Profile.updateOne({ _id: req.params.id }, {
                $set: {
                  title: req.body.title,
                  describe: req.body.describe,
                  type: req.body.type,
                  cover: `http://localhost:5000/${path}`,
                }
              })
                .then(profile => {
                  res.json({
                    message: '更新成功',
                    data: profile
                  })
                })
            }
          })
      }
    })
  } else {
    Profile.updateOne({ _id: req.params.id }, {
      $set: {
        title: req.body.title,
        describe: req.body.describe,
        type: req.body.type,
        cover: 'http://localhost:5000/assets/img/solved.png',
      }
    })
      .then(profile => {
        res.json({
          message: '更新成功',
          data: profile
        })
      })
  }
})

// $route POST api/profiles/save/:id
// @desc 保存文章接口
// @access pr9ivate
router.post('/save/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  let filePath = `public/article/${new Date().valueOf()}.txt`
  let index = req.body.index
  fs.writeFile(filePath, req.body.data, err => {
    if (err) {
      console.log(err)
    } else {
      Profile.findOne({ _id: req.params.id })
        .then(profile => {
          if (profile.articleList[index]) {
            let path = profile.articleList[index].path
            console.log(path)
            fs.unlink(path, err => {
              if (err) {
                console.log(err)
              } else {
                Profile.updateOne({ _id: req.params.id }, {
                  $set: {
                    ['articleList.' + index]: {
                      path: filePath,
                      title: req.body.title,
                    }
                  }
                })
                  .then(profile => {
                    res.json('修改成功')
                  })
              }
            })
          } else {
            Profile.updateOne({ _id: req.params.id }, {
              $set: {
                ['articleList.' + index]: {
                  path: filePath,
                  title: req.body.title,
                  date: new Date().toLocaleString()
                }
              }
            })
              .then(profile => {
                res.json('创建成功')
              })
          }
        })
    }
  });
})

// $route GET api/profiles/edit/:id
// @desc 读取文章接口
// @access pr9ivate
router.get('/edit/:id/:index', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ _id: req.params.id })
    .then(profile => {
      let path = profile.articleList[req.params.index].path
      if (profile.articleList[req.params.index]) {
        fs.readFile(path, 'utf-8', (err, data) => {
          if (err) {
            console.log(err)
          } else {
            res.json({
              title: profile.articleList[req.params.index].title,
              content: data,
              date: profile.articleList[req.params.index].date
            })
          }
        })
      } else {
        res.json('没有找到相关内容')
      }
    })
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
        res.json({ data: profile })
      })
  }
})

// $route POST api/profiles/comment/:id
// @desc 评论信息接口
// @access private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(Date.now())
  Profile.findOneAndUpdate(
    { _id: req.params.id },
    {
      $addToSet: {
        discussion: {
          name: req.headers.username,
          content: req.body.content,
          time: new Date().toLocaleString()
        }
      }
    },
    { new: true }
  ).then(profile => res.json(profile))
})

// $route POST api/profiles/subscribe/:id
// @desc 订阅信息接口
// @access private
router.post('/subscribe/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.body.status === 1) {
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { subscription: req.headers.username } },
      { new: true }
    ).then(profile => res.json(profile))
  } else if (req.body.status === 0) {
    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { subscription: req.headers.username } }
    ).then(
      profile => {
        console.log(res)
        res.json({ data: profile })
      })
  }
})

// $route POST api/profiles/like/:id
// @desc 点赞信息接口
// @access private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.body.status)
  console.log(req.params.id)
  console.log(req.headers.username)
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
