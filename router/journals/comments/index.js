/**
 * Created by Obscurity on 2016/3/20.
 */

var comments_controller = require('../../../controller').journals.comments;
var authentication = require('../../../middlewares/authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');
var replies_router = require('./replies');

module.exports = function(app) {

    app.post('comment-create', '/journals/:journal_id/comments', visit_recorder, authentication.cross_auth, comments_controller.create);

    app.del('comment-destroy', '/journals/:journal_id/comments/:comment_id', visit_recorder, authentication.admin_only, comments_controller.destroy);

    replies_router(app);

};