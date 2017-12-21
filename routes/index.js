var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/blog');
var db = mongoose.connection;
var User = mongoose.Schema({
  name: String,
  password: String,
});
var myModel = mongoose.model('users', User);
module.exports = function (app) {

  //首页
  app.get('/', function (req, res, next) {
    const listData = [{
        'title': 'NodeJs Express 常见问题',
        'brief': 'Express 是一个基于 Express 是一个基于Express 是一个基于Express 是一个基于Express 是一个基于Express 是一个基于Express 是一个基于Node.js 平台的极简、灵活的 web 应用开发框架，它提供一系列强大的特性，帮助你创建各种 Web 和移动设备应用。Express 是一个基于 Express 是一个基于Express 是一个基于Express 是一个基于Express 是一个基于Express 是一个基于Express 是一个基于Node.js 平台的极简、灵活的 web 应用开发框架，它提供一系列强大的特性，帮助你创建各种 Web 和移动设备应用。',
        'url': '/detail/node'
      },
      {
        'title': 'Vue 常见问题',
        'brief': 'Hello Vue',
        'url': '/detail/vue'
      }
    ]
    res.render('index', {
      listData: listData
    });
  });

  //注册页面
  app.get('/register', function (req, res, next) {
    res.render('register');
  });
  app.post('/register', function (req, res, next) {
    myModel.findOne({
      name: req.body.name
    }, function(err, user){
      if(!user){
        var newUser = new myModel({
          name: req.body.name,
          password: req.body.password
        })
        newUser.save(function (err, data) {
          if (data) {
            req.flash('info','注册成功');
            res.redirect('/login');
          }
        })
      }else{
        req.flash('error', '用户已存在，请登录！');
        res.redirect('/login');
      }

      return;
    })

  });
  //登录页面
  app.get('/login', function (req, res, next) {
    res.render('login');
  });
  app.post('/login', function (req, res, next) {
    var password = req.body.password,
      user = req.body.name;
    myModel.findOne({
      name: user
    }, function (err, user) {
      if (user) {
        if (user.password == password) {
          res.redirect('/');
        }else{
          req.flash('error', '密码错误，请确认后登录！');
          res.redirect('/login');
        }
      }else{
        req.flash('error', '用户不存在，请先注册！');
        res.redirect('/register');
      }
    })
  })

  //发布文章
  app.get('/post', function (req, res, next) {
    res.render('post');
  })

  //详情页面
  app.get('/detail/:id', function (req, res, next) {
    res.render('detail');
  });

  //404
  app.get('*', function (req, res, next) {
    res.status(404);
    res.render('404');
  })
}