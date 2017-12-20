var crypto = require('crypto'),
    User = require('../models/user.js');
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
    var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
      console.log(password, password_re);
    if (password_re != password) {
      req.flash('error', '两次输入的密码不一致');
      return res.redirect('/register'); //返回注册页面
    }

    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name: name,
      password: password
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
      if (err) {
        //报错 返回首页
        // req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        // req.flash('error', '用户已存在!');
        return res.redirect('/register');
      }
      //如果不存在则新增用户
      newUser.save(function (err, user) {
        if (err) {
          //注册失败返回注册页面
          // req.flash('error', err);
          return res.redirect('/register');
        }
        req.session.user = user; //用户信息存入session
        // req.flash('success', '注册成功!');
        res.redirect('/');
      })
    })
  })

  //登录页面
  app.get('/login', function (req, res, next) {
    res.render('login');
  });

  //详情页面
  app.get('/detail/*', function (req, res, next) {
    res.render('detail');
  });

  //404
  app.get('*', function (req, res, next) {
    res.status(404);
    res.render('404');
  })
}