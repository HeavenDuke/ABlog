"use strict";
/**
 * Created by Obscurity on 2016/5/11.
 */

let diaries_controller = require('../../controller').diaries;
let authentication = require('../../middlewares/authentication');
let path = require('path');
let visit_recorder = require('../../middlewares/visit_recorder');
let set_redirection = require('../../middlewares/set_redirection');
let module_naming = require('../../middlewares/module_naming');

let Router = require('koa-router');
let router = new Router({
    prefix: "/diaries"
});

router.use(module_naming("diary"));

router.get('diaries-index', '/', visit_recorder, set_redirection, diaries_controller.index);

router.post('diaries-create', '/', visit_recorder, authentication.admin_only, diaries_controller.create);

router.put('diaries-update', '/:diary_id', visit_recorder, authentication.admin_only, diaries_controller.update);

router.del('diaries-destroy', '/:diary_id', visit_recorder, authentication.admin_only, diaries_controller.destroy);

module.exports = router;