var controller = require('../controller');
var userRouter = require('./users');
var contestRouter = require('./contests');
var paperRouter = require('./papers');
var projectRouter = require('./projects');
var journalRouter = require('./journals');
var diaryRouter = require('./diaries');
var columnRouter = require('./columns');
var rssRouter = require('./rss');

var visit_recorder = require('../middlewares/visit_recorder');

module.exports = function(app){
    //首页
    app.get('home', '/', visit_recorder, controller.home.index);

    userRouter(app);
    contestRouter(app);
    paperRouter(app);
    projectRouter(app);
    journalRouter(app);
    diaryRouter(app);
    columnRouter(app);
    rssRouter(app);
};