"use strict";
/**
 * Created by heavenduke on 16-7-12.
 */

let sessions_controller = require('../../../controller').guests.sessions;

let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');
let Router = require('koa-router');
let router = new Router({
    prefix: "/sessions"
});

router.get('guests-sessions-new', '/new', visit_recorder, authentication.auth_none, sessions_controller.init);

router.post('guests-sessions-create', '/', visit_recorder, authentication.auth_none, sessions_controller.create);

router.delete('guests-sessions-destroy', '/', visit_recorder, authentication.guest_only, sessions_controller.destroy);

module.exports = router;