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
var override = require('koamethodoverride')
var koaJade = require('koa-jade');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var staticCache = require('koa-static-cache');
var marked = require('marked');
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
    this.use(staticCache(staticDir));
    this.use(staticCache(path.join(staticDir, 'js')));
    this.use(staticCache(path.join(staticDir, 'css')));
    this.use(staticCache(path.join(staticDir, 'fonts')));
    this.use(staticCache(path.join(staticDir, 'bower_components')));

    this.use(function *(next) {
        try{
            yield* next;
        } catch(e) {
            if (process.env.NODE_ENV != 'test') {
                console.log(e.message);
                console.log(e);
                logger.error(e);
            }
            this.render('./error');
        }
    });

    this.use(router(this));

    appRouter(this);

    this.listen(port);

    this.on('error', function (err, ctx) {

    });
    
    console.log('listening on port %s',config.port);
};

Server.prototype.connectDb = function () {
    mongoose.connect(this.opts.mongodb, {
        server: {
            poolSize: 12,
            socketOptions: {
                keepAlive: 1
            }
        }
    });
};


Server.prototype.config = function() {};

Server.prototype.initGlobalVariables = function() {
    global.conf = this.opts;
    global.database = require('../model').loader;
    global.utils = {
        markdown: marked,
        html2plain: require('html2plaintext'),
        journalPreview: require('../libs/journalPreview')
    };
    global.utils.markdown.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
};

module.exports = Server;

