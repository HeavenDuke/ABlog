/**
 * Created by Obscurity on 2016/5/17.
 */

exports.create = function *(next) {
    var Comment = global.database.models.comment;
    var comment = yield Comment.findById(this.params.comment_id);
    comment.replies.push({content: this.request.body.content});
    comment.save();
    this.redirect(this.app.url("article-detail", {column_id: this.params.column_id, article_id: this.params.article_id}));
};