"use strict";
/**
 * Created by Obscurity on 2016/5/29.
 */

let columns_controller = require('../../controller').columns;
let article_router = require('./articles');
let authentication = require('../../middlewares/authentication');
let visit_recorder = require('../../middlewares/visit_recorder');
let set_redirection = require('../../middlewares/set_redirection');
let module_naming = require('../../middlewares/module_naming');
let routerUtils = require('../../libs/routerUtil');

let Router = require('koa-router');
let router = new Router({
    prefix: "/columns"
});

router.use(module_naming("column"));

router.get('columns-index', '/', visit_recorder, set_redirection, columns_controller.index);

router.get('columns-new', '/new', visit_recorder, set_redirection, authentication.admin_only, columns_controller.init);

router.get('columns-show', '/:column_id', visit_recorder, set_redirection, columns_controller.show);

router.get('columns-edit', '/:column_id/edit', visit_recorder, set_redirection, authentication.admin_only, columns_controller.edit);

router.post('columns-create', '/', visit_recorder, authentication.admin_only, columns_controller.create);

router.put('columns-update', '/:column_id', visit_recorder, authentication.admin_only, columns_controller.update);

router.del('columns-destroy', '/:column_id', visit_recorder, authentication.admin_only, columns_controller.destroy);

routerUtils.stack(router, "/:column_id", article_router);

module.exports = router;