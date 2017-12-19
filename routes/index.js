var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const listData = [
    {
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

  res.render('index', { listData: listData });
});

module.exports =  router;
