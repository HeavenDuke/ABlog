var debug = require('debug')('ablog');
var koa = require('koa');
//配置文件
var config = require('./config/config');
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

var appRouter = require('./router');
var path = require('path');

var app = koa();

app.use(function *(next){
    //config 注入中间件，方便调用配置信息
    if(!this.config){
        this.config = config;
    }
    yield next;
});

var logger = Logger({
    dir: config.logDir,
    categories: ['router', 'model', 'controller', 'job'],
    format: 'YYYY-MM-DD-[{category}][.log]'
});

//router use : this.logger.error(new Error(''))
app.context.logger = logger;


onerror(app);

//xtemplate对koa的适配
//xtemplate模板渲染
var jade = new koaJade({
    viewPath: './view',
    debug: false,
    pretty: true,
    compileDebug: false,
    app: app
})

app.use(session(app));

//post body 解析
app.use(bodyParser());
app.use(override());

//数据校验
app.use(validator());

//静态文件cache
var staticDir = config.staticDir;
app.use(staticCache(path.join(staticDir, 'js')));
app.use(staticCache(path.join(staticDir, 'css')));
app.use(staticCache(path.join(staticDir, 'fonts')));
app.use(staticCache(path.join(staticDir, 'bower_components')));

app.use(router(app));

appRouter(app);

app.on('error', function(err, ctx) {
    if (process.env.NODE_ENV != 'test') {
        console.log(err.message);
        console.log(err);
        logger.error(err);
    }
});

app.listen(config.port);
console.log('listening on port %s',config.port);

module.exports = app;

