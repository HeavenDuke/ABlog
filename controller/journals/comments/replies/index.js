/**
 * Created by Obscurity on 2016/5/17.
 */

exports.create = function *(next) {
    let Comment = global.database.models.comment;
    let comment = yield Comment.findById(this.params.comment_id);
    let reply = {content: this.request.body.content};
    if (this.session.guest) {
        reply.guest_id = this.session.guest._id;
    }
    else {
        reply.user_id = this.session.user._id;
    }
    comment.replies.push(reply);
    comment.save();
    this.redirect(this.app.url("journals-show", {journal_id: this.params.journal_id}));
};