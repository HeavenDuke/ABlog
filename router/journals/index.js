"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

let journals_controller = require('../../controller').journals;
let comment_router = require('./comments');
let likes_router = require('./likes');
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');
let visit_recorder = require('../../middlewares/visit_recorder');
let module_naming = require('../../middlewares/module_naming');
let routerUtils = require('../../libs/routerUtil');

let Router = require('koa-router');
let router = new Router({
    prefix: "/journals"
});

router.use(module_naming("journal"));

router.get('journals-index', '/', visit_recorder, set_redirection, journals_controller.index);

router.get('journals-new', '/new', visit_recorder, set_redirection, authentication.admin_only, journals_controller.init);

router.get('journals-show', '/:journal_id', visit_recorder, set_redirection, journals_controller.show);

router.get('journals-edit', '/:journal_id/edit', visit_recorder, set_redirection, authentication.admin_only, journals_controller.edit);

router.post('journals-create', '/', visit_recorder, authentication.admin_only, journals_controller.create);

router.put('journals-update', '/:journal_id', visit_recorder, authentication.admin_only, journals_controller.update);

router.del('journals-destroy', '/:journal_id', visit_recorder, authentication.admin_only, journals_controller.destroy);

routerUtils.mount(router, comment_router);

routerUtils.mount(router, likes_router);

module.exports = router;