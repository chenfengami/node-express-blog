var Db = {
    setting(){ //数据库基础配置
        var mongoose = require('mongoose');
        // mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://127.0.0.1:27017/blog');
        var db = mongoose.connection;
        return mongoose;
    }
}


module.exports = Db;