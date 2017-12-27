var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/blog');
var db = mongoose.connection;
//用户注册信息
var User = mongoose.Schema({
  name: String,
  password: String,
});
//发送文章信息
var article = mongoose.Schema({
  title: String,
  brief: String,
  content: String
})
var myModel = mongoose.model('users', User);
var myPost = mongoose.model('posts', article);



module.exports = function (app) {
  // let listData;
  //首页
  app.get('/', function (req, res, next) {
    //session
    // if(!req.session.user){
    //   res.redirect('/login');
    // }
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

  //注册页面
  app.get('/register', function (req, res, next) {
    res.render('register');
  });
  app.post('/register', function (req, res, next) {
    if (!req.body.name) {
      req.flash('error', '账号不能为空');
      res.redirect('/register');
      return;
    } else if (!req.body.password || !req.body['password-repeat']) {
      req.flash('error', '密码不能为空');
      res.redirect('/register');
      return;
    } else if (req.body.password != req.body['password-repeat']) {
      req.flash('error', '两次输入的密码不一致，请确认后再输入！');
      res.redirect('/register');
      return;
    }
    myModel.findOne({
      name: req.body.name
    }, function (err, user) {
      if (!user) {
        var newUser = new myModel({
          name: req.body.name,
          password: req.body.password
        })
        newUser.save(function (err, data) {
          if (data) {
            req.flash('info', '注册成功');
            res.redirect('/login');
          }
        })
      } else {
        req.flash('error', '用户已经存在！');
        res.redirect('/register');
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
          var userInfo = {
            'userName': user
          };
          // req.session.user = userInfo;
          res.redirect('/');
        } else {
          req.flash('error', '密码错误，请确认后登录！');
          res.redirect('/login');
        }
      } else {
        req.flash('error', '用户不存在，请先注册！');
        res.redirect('/register');
      }
    })
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
    var newPost = new myPost({
      title: req.body.title,
      brief: req.body.brief,
      content: req.body.content
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
          console.log(posts[i]);
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