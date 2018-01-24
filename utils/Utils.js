var fs = require('fs');
var multer = require('multer');
var Utils = {
    getDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        var timeStamp = year + '-' + month + '-' + day;
        return timeStamp;
    },
    upload() {
        /**
         * 定制上传文件名称
         * destination：设置资源的保存路径。注意，如果没有这个配置项，默认会保存在 /tmp/uploads 下。此外，路径需要自己创建。
         * filename：设置资源保存在本地的文件名。
         */
        var createFolder, uploadFolder, storage, upload;
        createFolder = function (folder) {
            try {
                fs.accessSync(folder);
            } catch (e) {
                fs.mkdirSync(folder);
            }
        }
        uploadFolder = './upload/';
        createFolder(uploadFolder);

        storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, uploadFolder); //保存的路径，需要自己创建
            },
            filename: function (req, file, cb) {
                // 设置保存文件名
                cb(null, file.originalname.split('.')[0] + '-' + Date.now());
            }
        })

        //通过storage选项来对 上传行为 进行定制化
        upload = multer({
            storage: storage
        });

        return upload;
    }
}


module.exports = Utils;