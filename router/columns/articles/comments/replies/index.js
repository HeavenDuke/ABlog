"use strict";
/**
 * Created by Obscurity on 2016/5/17.
 */


let replies_controller = require('../../../../../controller').columns.articles.comments.replies;
let authentication = require('../../../../../middlewares/authentication');
let visit_recorder = require('../../../../../middlewares/visit_recorder');
let Router = require('koa-router');
let router = new Router({
    prefix: "/replies"
});

router.post('columns-articles-comments-replies-create', '/', visit_recorder, authentication.cross_auth, replies_controller.create);

module.exports = router;