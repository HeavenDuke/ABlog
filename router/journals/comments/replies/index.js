"use strict";
/**
 * Created by Obscurity on 2016/5/17.
 */


let replies_controller = require('../../../../controller').journals.comments.replies;
let authentication = require('../../../../middlewares/authentication');
let visit_recorder = require('../../../../middlewares/visit_recorder');

module.exports = function(app) {

    app.post('journals-comments-replies-create', '/journals/:journal_id/comments/:comment_id/replies', visit_recorder, authentication.cross_auth, replies_controller.create);
};