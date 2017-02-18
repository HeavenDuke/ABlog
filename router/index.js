let home_controller = require('../controller').home;
let user_router = require('./users');
let project_router = require('./projects');
let journal_router = require('./journals');
let diary_router = require('./diaries');
let column_router = require('./columns');
let writing_router = require('./writings');
let image_router = require('./images');
let notification_router = require('./notifications');
let guest_router = require('./guests');
let photo_router = require('./photos');
let link_router = require('./links');
let share_router = require('./share');
let profile_router = require('./profile');

let visit_recorder = require('../middlewares/visit_recorder');
let set_redirection = require('../middlewares/set_redirection');

module.exports = function(app){
    //首页
    app.get('home', '/', visit_recorder, set_redirection, home_controller.index);

    app.post('updataHshare', "/hshare", function *(next) {
        this.response.set("Access-Control-Allow-Origin", "*");
        this.body = {message: "success"};
    });

    app.get('loadHshare', "/hshare", function *(next) {
        this.response.set("Access-Control-Allow-Origin", "*");
        this.body = {stat: 1000};
    });

    user_router(app);
    guest_router(app);
    project_router(app);
    journal_router(app);
    diary_router(app);
    column_router(app);
    image_router(app);
    writing_router(app);
    notification_router(app);
    photo_router(app);
    link_router(app);
    share_router(app);
    profile_router(app);
    
};