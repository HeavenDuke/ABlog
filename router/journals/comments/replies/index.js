/**
 * Created by Obscurity on 2016/5/17.
 */


var repliesController = require('../../../../controller').journals.comments.replies;
var authentication = require('../../../../middlewares/authentication');
var visit_recorder = require('../../../../middlewares/visit_recorder');

module.exports = function(app) {

    app.post('reply-create', '/journals/:journal_id/comments/:comment_id/replies', visit_recorder, repliesController.create);
};