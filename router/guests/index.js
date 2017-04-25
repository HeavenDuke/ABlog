"use strict";
/**
 * Created by heavenduke on 16-7-12.
 */

let guests_controller = require('../../controller').guests;

let authentication = require('../../middlewares/authentication');
let visit_recorder = require('../../middlewares/visit_recorder');

let password_router = require('./passwords');
let session_router = require('./sessions');
let sms_router = require('./sms');
let head_router = require('./heads');
let path = require('path');
let config = require('../../config/config')();
let routerUtils = require('../../libs/routerUtil');

let Router = require('koa-router');
let router = new Router({
    prefix: "/guests"
});

router.get('guests-new', '/new', visit_recorder, authentication.auth_none, guests_controller.init);

router.post('guests-create', '/', visit_recorder, authentication.auth_none, guests_controller.create);

router.get('guests-edit', '/edit', visit_recorder, authentication.guest_only, guests_controller.edit);

router.put('guests-update', '/', visit_recorder, authentication.guest_only, guests_controller.update);

routerUtils.stack(router, "/", password_router);

routerUtils.stack(router, "/", session_router);

routerUtils.stack(router, "/", sms_router);

routerUtils.stack(router, "/", head_router);

module.exports = router;