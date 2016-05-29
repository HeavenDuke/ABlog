/**
 * Created by Obscurity on 2016/5/17.
 */


var repliesController = require('../../../../../controller').column.article.comment.reply;
var authentication = require('../../../../../middlewares/authentication');
var visit_recorder = require('../../../../../middlewares/visit_recorder');

module.exports = function(app) {

    app.post('article-comment-reply-create', '/columns/:column_id/articles/:article_id/comments/:comment_id/replies', visit_recorder, repliesController.create);

};