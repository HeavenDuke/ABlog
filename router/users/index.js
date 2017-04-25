"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */
let users_controller = require('../../controller').users;
let authentication = require('../../middlewares/authentication');
let visit_recorder = require('../../middlewares/visit_recorder');
let session_router = require('./sessions');

let Router = require('koa-router');
let router = new Router({
    prefix: "/users"
});
let routerUtils = require('../../libs/routerUtil');

routerUtils.stack(router, "/", session_router);

router.get('users-edit', '/edit', visit_recorder, authentication.admin_only, users_controller.edit);

router.put('users-update', '/', visit_recorder, authentication.admin_only, users_controller.update);

module.exports = router;