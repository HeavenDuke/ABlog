/**
 * Created by Obscurity on 2016/3/20.
 */

var commentsController = require('../../../controller').journal.comments;
var authentication = require('../../../middlewares/authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');
var repliesRouter = require('./replies');

module.exports = function(app) {

    app.post('comment-create', '/journals/:journal_id/comments', visit_recorder, commentsController.create);

    app.del('comment-destroy', '/journals/:journal_id/comments/:comment_id', visit_recorder, authentication, commentsController.destroy);

    repliesRouter(app);

};