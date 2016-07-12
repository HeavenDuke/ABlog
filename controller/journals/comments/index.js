/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = function *(next) {
    var Journal = global.database.models.journal;
    var Comment = global.database.models.comment;
    var comment = new Comment();
    var journal = yield Journal.findById(this.params.journal_id);
    comment.content = this.request.body.content;
    if (this.session.guest) {
        comment.guest_id = this.session.guest._id;
    }
    else {
        comment.user_id = this.session.user._id;
    }
    comment.journal_id = this.params.journal_id;
    comment.save();
    journal.comment_count += 1;
    journal.save();
    this.redirect(this.app.url('journals-detail', {journal_id: this.params.journal_id}));
};

exports.destroy = function *(next) {
    var Journal = global.database.models.journal;
    var Comment = global.database.models.comment;
    var comment = yield Comment.findById(this.params.comment_id);
    var journal = yield Journal.findById(comment.journal_id);
    comment.remove();
    journal.comment_count -= 1;
    journal.save();
    this.redirect(this.app.url('journals-detail', {journal_id: comment.journal_id}));
};

exports.replies = require('./replies');