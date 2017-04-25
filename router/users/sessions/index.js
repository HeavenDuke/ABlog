"use strict";
/**
 * Created by Obscurity on 2016/7/12.
 */

let sessions_controller = require('../../../controller').users.sessions;
let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');

let Router = require('koa-router');
let router = new Router({
    prefix: "/sessions"
});

router.get('users-sessions-new', '/new', visit_recorder, authentication.auth_none, sessions_controller.init);

router.post('users-sessions-create', '/', visit_recorder, authentication.auth_none, sessions_controller.create);

router.del('users-sessions-destroy', '/', visit_recorder, authentication.admin_only, sessions_controller.destroy);

module.exports = router;