/**
 * Created by Obscurity on 2016/3/20.
 */

var commentsController = require('../../../../controller').column.article.comment;
var authentication = require('../../../../middlewares/authentication');
var visit_recorder = require('../../../../middlewares/visit_recorder');
var repliesRouter = require('./replies');

module.exports = function(app) {

    app.post('article-comment-create', '/columns/:column_id/articles/:article_id/comments', visit_recorder, commentsController.create);

    app.del('article-comment-destroy', '/columns/:column_id/articles/:article_id/comments/:comment_id', visit_recorder, authentication, commentsController.destroy);

    repliesRouter(app);

};