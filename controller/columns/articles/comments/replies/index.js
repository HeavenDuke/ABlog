/**
 * Created by Obscurity on 2016/5/17.
 */

exports.create = function *(next) {
    var Comment = global.database.models.comment;
    var comment = yield Comment.findById(this.params.comment_id);
    var reply = {content: this.request.body.content};
    if (this.session.guest) {
        reply.guest_id = this.session.guest._id;
    }
    else {
        reply.user_id = this.session.user._id;
    }
    comment.replies.push(reply);
    comment.save();
    this.redirect(this.app.url("articles-detail", {column_id: this.params.column_id, article_id: this.params.article_id}));
};