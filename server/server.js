/**
 * Created by heavenduke on 16-5-5.
 */

global.Promise = require('bluebird');
var debug = require('debug')('ablog');
var koa = require('koa');
var flash = require('koa-flash');
//配置文件
var config = require('../config/config')(__dirname);
//log记录
var Logger = require('mini-logger');
var onerror = require('koa-onerror');
var override = require('koamethodoverride');
var koaJade = require('koa-jade');
var session = require('koa-session');
var bodyParser = require('koa-bodyparser');
var staticCache = require('koa-static-cache');
var koaStatic = require('koa-static');
var marked = require('marked');
var astepback = require('astepback');
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
    this.use(astepback());
    this.use(flash({}));

    this.context.logger = logger;

    onerror(this);

    var jade = new koaJade({
        viewPath: './view',
        debug: false,
        pretty: true,
        compileDebug: false,
        app: this
    });

    this.use(bodyParser({
        formLimit: "100mb",
        jsonLimit: "100mb",
        textLimit: "100mb"
    }));
    this.use(override());

    this.use(validator());

    //静态文件cache
    var staticDir = config.staticDir;

    this.use(koaStatic(path.join(staticDir, 'uploads')));

    this.use(staticCache(staticDir));
    this.use(staticCache(path.join(staticDir, 'vendors')));
    this.use(staticCache(path.join(staticDir, 'uploads')));
    this.use(staticCache(path.join(staticDir, 'js')));
    this.use(staticCache(path.join(staticDir, 'img')));
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

Server.prototype.initUtils = function () {
    require('../libs/date')();
    require('../libs/random')();
};

Server.prototype.initGlobalVariables = function() {
    global.conf = this.opts;
    global.database = require('../model').loader;
    global.utils = {
        markdown: marked,
        html2plain: require('html2plaintext'),
        journalPreview: require('../libs/journalPreview'),
        urlEncoder: require('../libs/urlEncoder')
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

Server.prototype.launchTasks = function () {
    let schedule = require('node-schedule');
    // schedule.scheduleJob('0 * * * *', function () {
    //     require('../jobs').RSSUpdateJob(function (err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //         else {
    //             console.log("rss updated");
    //         }
    //     });
    // });
    schedule.scheduleJob('0 * * * *', function () {
        require('../jobs').RemoveRedundantImageJob(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("redundant images removed");
            }
        });
    });

    schedule.scheduleJob('0 * * * *', function () {
        require('../jobs').BackupDatabaseJob(function (err, reply) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("database backup uploaded");
            }
        });
    });
};

module.exports = Server;

