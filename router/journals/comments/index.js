"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

let comments_controller = require('../../../controller').journals.comments;
let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');
let replies_router = require('./replies');

module.exports = function(app) {

    app.post('journals-comments-create', '/journals/:journal_id/comments', visit_recorder, authentication.cross_auth, comments_controller.create);

    app.del('journals-comments-destroy', '/journals/:journal_id/comments/:comment_id', visit_recorder, authentication.admin_only, comments_controller.destroy);

    replies_router(app);

};