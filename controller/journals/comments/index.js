/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = function *(next) {
    var journalId = this.params.journal_id;
    var Journal = global.database.models.journal;
    var Comment = global.database.models.comment;
    var comment = new Comment();
    var journal = yield Journal.findById(journalId);
    comment.content = this.request.body.content;
    comment.journal_id = journalId;
    comment.save();
    journal.comment_count += 1;
    journal.save();
    this.redirect("/journals/" + journalId);
};

exports.destroy = function *(next) {
    var Journal = global.database.models.journal;
    var Comment = global.database.models.comment;
    var comment = yield Comment.findById(this.params.comment_id);
    var journal = yield Journal.findById(comment.journal_id);
    var journalId = comment.journal_id;
    comment.remove();
    journal.comment_count -= 1;
    journal.save();
    this.redirect("/journals/" + journalId);
};