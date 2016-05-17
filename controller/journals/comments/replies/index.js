/**
 * Created by Obscurity on 2016/5/17.
 */

exports.create = function *(next) {
    var Comment = global.database.models.comment;
    var comment = yield Comment.findById(this.params.comment_id);
    comment.replies.push({content: this.request.body.content});
    comment.save();
    this.redirect(this.app.url("journals-detail", {journal_id: this.params.journal_id}));
};