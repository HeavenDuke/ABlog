"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

let comments_controller = require('../../../../controller').columns.articles.comments;
let authentication = require('../../../../middlewares/authentication');
let visit_recorder = require('../../../../middlewares/visit_recorder');
let replies_router = require('./replies');
let routerUtils = require('../../../../libs/routerUtil');

let Router = require('koa-router');
let router = new Router({
    prefix: "/comments"
});

router.post('columns-articles-comments-create', '/', visit_recorder, authentication.cross_auth, comments_controller.create);

router.del('columns-articles-comments-destroy', '/:comment_id', visit_recorder, authentication.admin_only, comments_controller.destroy);

routerUtils.stack(router, "/:comment_id",  replies_router);

module.exports = router;