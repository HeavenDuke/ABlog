"use strict";
/**
 * Created by Obscurity on 2017/2/17.
 */

let profiles_controller = require('../../controller').profiles;
let visit_recorder = require('../../middlewares/visit_recorder');
let set_redirection = require('../../middlewares/set_redirection');
let authentication = require('../../middlewares/authentication').admin_only;

let Router = require('koa-router');
let router = new Router({
    prefix: "/profile"
});

router.get('profiles-show', "/", visit_recorder, set_redirection, profiles_controller.show);

router.get('profiles-edit', "/edit", visit_recorder, set_redirection, authentication, profiles_controller.edit);

router.put('profiles-update', "/", visit_recorder, authentication, profiles_controller.update);

module.exports = router;