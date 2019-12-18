/**
 * Created by heavenduke on 16-5-5.
 */
"use strict";

global.Promise = require('bluebird');
let debug = require('debug')('ablog');
let Koa = require('koa');
let flash = require('koa-flash');
//配置文件
let config = require('../config/config')(__dirname);
//log记录
let Logger = require('mini-logger');
let onerror = require('koa-onerror');
let override = require('koamethodoverride');
let koaPug = require('koa-pug');
let session = require('koa-generic-session');
let redisStore = require('koa-redis');
let bodyParser = require('koa-bodyparser');
let staticCache = require('koa-static-cache');
let koaStatic = require('koa-static');
let marked = require('marked');
let astepback = require('astepback');
//路由
let validator = require('koa-validator');
let converter = require('koa-convert');

let routers = require('../router');
let routerUtils = require('../libs/routerUtil');
let path = require('path');
let fs = require('fs');
let mongoose = require('mongoose');

function Server(option) {
    this.opts = option || {};
}

Server.prototype = new Koa();

Server.prototype.create_folders = function () {
    if (!fs.existsSync(path.join(config.baseDir, "backups"))) {
        fs.mkdirSync(path.join(config.baseDir, "backups"));
    }
    if (!fs.existsSync(path.join(config.baseDir, "database"))) {
        fs.mkdirSync(path.join(config.baseDir, "database"));
    }
    if (!fs.existsSync(path.join(config.baseDir, "log"))) {
        fs.mkdirSync(path.join(config.baseDir, "log"));
    }
};

Server.prototype.start = function () {

    let logger = Logger({
        dir: config.logDir,
        categories: ['router', 'model', 'controller', 'job'],
        format: 'YYYY-MM-DD-[{category}][.log]'
    });

    let port = this.opts.port || 3000;

    this.use(converter(session({
        store: redisStore({})
    })));
    this.keys = ['heavenduke'];
    this.use(converter(astepback()));
    this.use(converter(flash({})));

    this.context.logger = logger;

    onerror(this);

    new koaPug({
        viewPath: './view',
        debug: false,
        pretty: true,
        compileDebug: false,
        app: this
    });

    this.use(converter(bodyParser({
        formLimit: "100mb",
        jsonLimit: "100mb",
        textLimit: "100mb"
    })));
    this.use(converter(override()));

    this.use(converter(validator()));

    //静态文件cache
    let staticDir = config.staticDir;

    this.use(converter(koaStatic(path.join(staticDir, 'uploads'))));

    this.use(converter(staticCache(staticDir)));
    this.use(converter(staticCache(path.join(staticDir, 'uploads'))));
    this.use(converter(staticCache(path.join(staticDir, 'dist'))));
    this.use(converter(staticCache(path.join(staticDir, 'img'))));
    this.use(converter(staticCache(path.join(staticDir, 'fonts'))));

    this.use(async (ctx, next) => {
        try{
            await next();
        } catch(e) {
            if (process.env.NODE_ENV != 'test') {
                console.log(e.message);
                console.log(e);
                logger.error(e);
            }
            ctx.render('./error');
        }
    });

    routerUtils.mount(this, routers);

    this.listen(port);
    
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
    global.router = routers;
    global.utils.markdown.setOptions({
        renderer: (function () {
            let renderer = new marked.Renderer();
            renderer.image = function(href, title, text) {
                let out = '<img style="width: 100%;" src="' + href + '" alt="' + text + '"';
                if (title) {
                    out += ' title="' + title + '"';
                }
                out += this.options.xhtml ? '/>' : '>';
                return out;
            };
            return renderer;
        }()),
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
    schedule.scheduleJob('* * * * *', function () {
        require('../jobs').RemoveRedundantImageJob(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("redundant images removed");
            }
        });
    });

    /*schedule.scheduleJob('0 0 * * *', function () {
        require('../jobs').BackupDatabaseJob(function (err, reply) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("database backup uploaded");
            }
        });
    });*/
};

module.exports = Server;

