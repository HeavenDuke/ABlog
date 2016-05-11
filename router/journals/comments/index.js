/**
 * Created by Obscurity on 2016/3/20.
 */

var commentsController = require('../../../controller').journal.comments;
var authentication = require('../../../middlewares/authentication');

module.exports = function(app) {

    app.post('comment-create', '/journals/:journal_id/comments', commentsController.create);

    app.del('comment-destroy', '/journals/:journal_id/comments/:comment_id', authentication, commentsController.destroy);

};