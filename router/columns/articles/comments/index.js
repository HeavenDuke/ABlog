/**
 * Created by Obscurity on 2016/3/20.
 */

var comments_controller = require('../../../../controller').columns.articles.comments;
var authentication = require('../../../../middlewares/authentication');
var visit_recorder = require('../../../../middlewares/visit_recorder');
var replies_router = require('./replies');

module.exports = function(app) {

    app.post('article-comment-create', '/columns/:column_id/articles/:article_id/comments', visit_recorder, authentication.cross_auth, comments_controller.create);

    app.del('article-comment-destroy', '/columns/:column_id/articles/:article_id/comments/:comment_id', visit_recorder, authentication.admin_only, comments_controller.destroy);

    replies_router(app);

};