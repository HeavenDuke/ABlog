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

routerUtils.stack(router, "/", user_router);
routerUtils.stack(router, "/", guest_router);
routerUtils.stack(router, "/", project_router);
routerUtils.stack(router, "/", journal_router);
routerUtils.stack(router, "/", diary_router);
routerUtils.stack(router, "/", column_router);
routerUtils.stack(router, "/", image_router);
routerUtils.stack(router, "/", writing_router);
routerUtils.stack(router, "/", notification_router);
routerUtils.stack(router, "/", photo_router);
routerUtils.stack(router, "/", link_router);
routerUtils.stack(router, "/", share_router);
routerUtils.stack(router, "/", profile_router);

module.exports = router;