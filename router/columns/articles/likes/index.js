"use strict";
/**
 * Created by Obscurity on 2016/5/29.
 */

let likes_controller = require("../../../../controller").columns.articles.likes;
let authentication = require('../../../../middlewares/authentication');
let visit_recorder = require('../../../../middlewares/visit_recorder');
let Router = require('koa-router');
let router = new Router({
    prefix: "/likes"
});

router.post('columns-articles-likes-create', '/likes', visit_recorder, authentication.guest_only, likes_controller.create);

module.exports = router;