var home_controller = require('../controller').home;
var user_router = require('./users');
var contest_router = require('./contests');
var paper_router = require('./papers');
var project_router = require('./projects');
var journal_router = require('./journals');
var diary_router = require('./diaries');
var column_router = require('./columns');
var rss_router = require('./rss');
var writing_router = require('./writings');
var image_router = require('./images');
var notification_router = require('./notifications');

var visit_recorder = require('../middlewares/visit_recorder');

module.exports = function(app){
    //首页
    app.get('home', '/', visit_recorder, home_controller.index);

    user_router(app);
    contest_router(app);
    paper_router(app);
    project_router(app);
    journal_router(app);
    diary_router(app);
    column_router(app);
    rss_router(app);
    image_router(app);
    writing_router(app);
    notification_router(app);
    
};