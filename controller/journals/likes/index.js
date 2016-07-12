/**
 * Created by Obscurity on 2016/5/11.
 */

exports.create = function *() {
    var Journal = global.database.models.journal;
    var Attitude = global.database.models.attitude;
    var type = this.request.query.type == "dislike" ? "dislikes_count" : "likes_count";
    var journal = yield Journal.findById(this.params.journal_id);
    if (journal) {
        var attitude = yield Attitude.findOne({guest_id: this.session.guest._id, journal_id: this.params.journal_id});
        var action = this.request.query.action;
        if (action == 'post') {
            if (!attitude) {
                attitude = new Attitude();
            }
            attitude.like = (this.request.query.attitude == "like");
            attitude.guest_id = this.session.guest._id;
            attitude.journal_id = this.params.journal_id;
            attitude.save();
        }
        else {
            if (attitude) {
                attitude.remove();
            }
        }
    }
    this.redirect(this.app.url("journals-detail", {journal_id: this.params.journal_id}));
};