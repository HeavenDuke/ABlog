"use strict";
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
let routerUtils = require('../libs/routerUtil');

let visit_recorder = require('../middlewares/visit_recorder');
let set_redirection = require('../middlewares/set_redirection');

let Router = require('koa-router');
let router = new Router();

router.get('home', '/', visit_recorder, set_redirection, home_controller.index);

router.post('updataHshare', "/hshare", function *(next) {
    this.response.set("Access-Control-Allow-Origin", "*");
    this.body = {message: "success"};
});

router.get('loadHshare', "/hshare", function *(next) {
    this.response.set("Access-Control-Allow-Origin", "*");
    this.body = {stat: 1000};
});

// routerUtils.mount(app, user_router);
// routerUtils.mount(app, guest_router);
// routerUtils.mount(app, project_router);
// routerUtils.mount(app, journal_router);
routerUtils.mount(router, diary_router);
// routerUtils.mount(app, column_router);
// routerUtils.mount(app, image_router);
// routerUtils.mount(app, writing_router);
// routerUtils.mount(app, notification_router);
// routerUtils.mount(app, photo_router);
// routerUtils.mount(app, link_router);
// routerUtils.mount(app, share_router);
routerUtils.mount(router, profile_router);

module.exports = router;