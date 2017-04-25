"use strict";
/**
 * Created by heavenduke on 16-7-11.
 */

let notifications_controller = require('../../controller').notifications;
let authentication = require('../../middlewares/authentication');
let visit_recorder = require('../../middlewares/visit_recorder');
let Router = require('koa-router');
let router = new Router({
    prefix: "/notifications"
});

router.get('notifications-index', '/', visit_recorder, authentication.cross_auth, notifications_controller.index);

module.exports = router;