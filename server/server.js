/**
 * Created by heavenduke on 16-5-5.
 */

var debug = require('debug')('ablog');
var koa = require('koa');
var flash = require('koa-flash');
//配置文件
var config = require('../config/config')(__dirname);
//log记录
var Logger = require('mini-logger');
var onerror = require('koa-onerror');
var override = require('koa-override')
var koaJade = require('koa-jade');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var staticCache = require('koa-static-cache');
//路由
var router = require('koa-router');
var validator = require('koa-validator');

var appRouter = require('../router');
var path = require('path');
var mongoose = require('mongoose');

function Server(option) {
    this.opts = option || {};
}

Server.prototype = koa();

Server.prototype.start = function () {

    var logger = Logger({
        dir: config.logDir,
        categories: ['router', 'model', 'controller', 'job'],
        format: 'YYYY-MM-DD-[{category}][.log]'
    });



    var port = this.opts.port || 3000;

    this.use(session(this));
    this.keys = ['heavenduke'];
    this.use(flash());

    this.context.logger = logger;

    onerror(this);

    var jade = new koaJade({
        viewPath: './view',
        debug: false,
        pretty: true,
        compileDebug: false,
        app: this
    });

    this.use(bodyParser());
    this.use(override());

    this.use(validator());

    //静态文件cache
    var staticDir = config.staticDir;
    this.use(staticCacje(staticDir));
    this.use(staticCache(path.join(staticDir, 'js')));
    this.use(staticCache(path.join(staticDir, 'css')));
    this.use(staticCache(path.join(staticDir, 'fonts')));
    this.use(staticCache(path.join(staticDir, 'bower_components')));

    this.use(router(this));

    appRouter(this);



    this.on('error', function(err, ctx) {
        if (process.env.NODE_ENV != 'test') {
            console.log(err.message);
            console.log(err);
            logger.error(err);
        }
    });

    this.listen(port);

    console.log('listening on port %s',config.port);
};

Server.prototype.connectDb = function () {
    mongoose.connect(this.opts.mongodb, {
        server: {
            poolSize: 12,
            socketOptions: {
                keepAlice: 1
            }
        }
    });
};


Server.prototype.config = function() {};

Server.prototype.initGlobalVariables = function() {
    global.conf = this.opts;
    global.database = require('../model').loader;
    global.utils = {
        markdown: require('markdown').markdown,
        html2plain: require('html2plaintext'),
        journalPreview: require('../libs/journalPreview')
    };
};

module.exports = Server;

