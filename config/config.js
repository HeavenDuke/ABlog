//应用配置文件
var path = require('path');
var local = require('./local');
var _ = require('underscore');

module.exports = function(root) {
    var config = {
        "title":"",
        //默认生产环境
        "env":"production",
        "appName": "Backend",
        //端口号配置
        "port": 3000,
        //模板所在的目录
        "viewDir": path.join(__dirname,'..','view'),
        //log所在的目录
        "logDir": path.join(__dirname,'..', 'log'),
        //静态文件所在的目录
        "staticDir": path.join(__dirname,'..', 'public'),

        "mongodb": 'mongodb://localhost:27017/ablog',

        "smtp": {
            "host": 'heavenduke.com',
            "port": 25,
            "secure": false, // use SSL
            "auth": {
                "user": 'heavenduke',
                "pass": '940815cc.,'
            }
        },

        "pagination": {
            "journal": 6
        },

        "preview": {
            "journal": 200
        }
    };

    //当NODE_ENV环境变量值为local时
    //本地调试环境
    if(process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development'){
        config = _.extend(config,local);
    }

    return config;
};