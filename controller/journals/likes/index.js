/**
 * Created by Obscurity on 2016/5/11.
 */

exports.create = function *() {
    var Journal = global.database.models.journal;
    var type = this.request.query.type == "dislike" ? "dislikes_count" : "likes_count";
    var journal = yield Journal.findById(this.params.journal_id);
    journal[type] += 1;
    journal.save();
    this.redirect('/journals/' + journal._id);
};