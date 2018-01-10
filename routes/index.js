const mongo = require('../db/setting')();
var markdown = require('markdown').markdown;
var article = mongo.Schema({
  title: String,
  brief: String,
  content: String,
  timeStamp: String
})
var myPost = mongo.model('posts', article);
module.exports = function (app) {
  //首页
  app.get('/', function (req, res, next) {
    myPost.find(function (err, posts) {
      posts.forEach((e, i) => {
        e.url = '/detail/' + e.title;
      })
      listData = posts;
    })
    res.render('index', {
      listData: listData
    });
  });

  //列表页面 分页
  app.get('/page/:num', function(req, res, next){
    myPost.find(function (err, posts) {
      posts.forEach((e, i) => {
        e.url = '/detail/' + e.title;
      })
      listData = posts;
    })
    res.render('page', {
      listData: listData
    });    
  })

  //发布文章
  app.get('/post', function (req, res, next) {
    res.render('post');
  })
  app.post('/post', function (req, res, next) {
    if (!req.body.title) {
      req.flash('error', '标题不能为空');
      res.redirect('/post');
      return;
    } else if (!req.body.content) {
      req.flash('error', '文章内容不能为空');
      res.redirect('/post');
      return;
    }
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month >= 10 ? month : '0' + month;
    day = day >=10 ? day : '0' + day;
    var timeStamp = year + '-' + month + '-' + day; 
    var newPost = new myPost({
      title: req.body.title,
      brief: req.body.brief,
      //将markdown格式转换为html格式
      content: markdown.toHTML(req.body.content),
      timeStamp: timeStamp
    })
    newPost.save(function (err, data) {
      if (data) {
        res.redirect('/');
      }else{
        res.redirect('/post');        
      }
    })
  })

  //详情页面
  app.get('/detail/:id', function (req, res, next) {
    myPost.find(function (err, posts) {
      posts.forEach((e, i) => {
        if(req.params.id == e.title){
          res.render('detail', {posts: posts[i]});
        }
      })
    })
  });

  //404
  app.get('*', function (req, res, next) {
    res.status(404);
    res.render('404');
  })
}