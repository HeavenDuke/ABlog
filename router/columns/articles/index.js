"use strict";
/**
 * Created by Obscurity on 2016/5/29.
 */

let articles_controller = require('../../../controller').columns.articles;
let comment_router = require('./comments');
let likes_router = require('./likes');
let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');
let set_redirection = require('../../../middlewares/set_redirection');
let routerUtils = require('../../../libs/routerUtil');

let Router = require('koa-router');
let router = new Router({
    prefix: "/articles"
});

router.get('columns-articles-new', '/new', visit_recorder, set_redirection, authentication.admin_only, articles_controller.init);

router.get('columns-articles-show', '/:article_id', visit_recorder, set_redirection, articles_controller.show);

router.get('columns-articles-edit', '/:article_id/edit', visit_recorder, set_redirection, authentication.admin_only, articles_controller.edit);

router.post('columns-articles-create', '/', visit_recorder, authentication.admin_only, articles_controller.create);

router.put('columns-articles-update', '/:article_id', visit_recorder, authentication.admin_only, articles_controller.update);

router.del('columns-articles-destroy', '/:article_id', visit_recorder, authentication.admin_only, articles_controller.destroy);

routerUtils.stack(router, "/:article_id", comment_router);

routerUtils.stack(router, "/:article_id", likes_router);

module.exports = router;