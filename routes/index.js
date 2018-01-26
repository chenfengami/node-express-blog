var markdown = require('markdown').markdown;
var fs = require('fs');
var multer = require('multer');

var Db = require('../db/setting.js'); //引入数据库配置文件
var Utils = require('../utils/Utils'); //引入工具类

/**
 * 创建数据库-发布文章表字段和对应的格式
 * 
 */
var article = Db.setting().Schema({
  title: String,
  brief: String,
  content: String,
  timeStamp: String
})
var myPost = Db.setting().model('posts', article);

var totalPage; //总页数
var upload = Utils.upload(); //定制上传文件格式

module.exports = function (app) {
  //首页
  app.get('/', function (req, res, next) {
    myPost.find(function (err, posts) {
      totalPage = Math.ceil(posts.length / 5);
      posts.forEach((e, i) => {
        e.url = '/detail/' + e.title;
      })
      listData = posts;
    })
    res.render('index', {
      listData: listData,
      currentPage: 1,
      totalPage: totalPage
    });
  });
  //列表页面 分页
  app.get('/page/:num', function (req, res, next) {
    // console.log(req.params.num);
    myPost.find(function (err, posts) {
      totalPage = Math.ceil(posts.length / 5);
      posts.forEach((e, i) => {
        e.url = '/detail/' + e.title;
      })
      listData = posts;
    })
    res.render('page', {
      listData: listData,
      currentPage: req.params.num,
      totalPage: totalPage
    });
  })

  //发布文章页面
  app.get('/post', function (req, res, next) {
    res.render('post');
  })

  //上传md文件
  app.post('/upload', upload.single('mdFile'), function (req, res, next) {
    var path = req.file.path; //读取上传文件路径
    if (!req.body.title) {
      req.flash('error', '标题不能为空');
      res.redirect('/post');
      return;
    } else if (!req.body.brief) {
      req.flash('error', '简介不能为空');
      res.redirect('/post');
      return;
    }

    var contentMd = fs.readFileSync(path, 'utf-8'); //获取上传文件的内容
    var newPost = new myPost({
      title: req.body.title,
      brief: req.body.brief,
      //将markdown格式转换为html格式
      content: markdown.toHTML(contentMd),
      timeStamp: Utils.getDate()
    })

    newPost.save(function (err, data) {
      if (data) {
        res.redirect('/');
      } else {
        res.redirect('/post');
      }
    })
  })

  //详情页面
  app.get('/detail/:id', function (req, res, next) {
    myPost.find(function (err, posts) {
      posts.forEach((e, i) => {
        if (req.params.id == e.title) {
          res.render('detail', {
            posts: posts[i]
          });
        }
      })
    })
  });

  //归档页面
  app.get('/archives', function(req, res, next){
    res.render('archives');
  })

  //404
  app.get('*', function (req, res, next) {
    res.status(404);
    res.render('404');
  })
}