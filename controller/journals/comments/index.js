/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = function *(next) {
    var journalId = this.params.journal_id;
    var Comment = global.database.models.comment;
    var comment = new Comment();
    comment.content = this.request.body.content;
    comment.journal_id = journalId;
    comment.save();
    this.redirect("/journals/" + journalId);
};

exports.destroy = function *(next) {
    var Comment = global.database.models.comment;
    var comment = yield Comment.findById(this.params.comment_id);
    var journalId = comment.journal_id;
    comment.remove();
    this.redirect("/journals/" + journalId);
};