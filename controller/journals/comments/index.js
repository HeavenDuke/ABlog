"use strict";
/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = function *(next) {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let comment = new Comment();
    let journal = yield Journal.findById(this.params.journal_id);
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
    this.redirect(this.app.url('journals-show', {journal_id: this.params.journal_id}));
};

exports.destroy = function *(next) {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let comment = yield Comment.findById(this.params.comment_id);
    let journal = yield Journal.findById(comment.journal_id);
    comment.remove();
    journal.comment_count -= 1;
    journal.save();
    this.redirect(this.app.url('journals-show', {journal_id: comment.journal_id}));
};

exports.replies = require('./replies');