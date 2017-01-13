/**
 * Created by Obscurity on 2016/5/11.
 */

exports.create = function *() {
    var Article = global.database.models.article;
    var Attitude = global.database.models.attitude;
    var article = yield Article.findById(this.params.article_id);
    if (article) {
        var attitude = yield Attitude.findOne({guest_id: this.session.guest._id, article_id: this.params.article_id});
        var action = this.request.query.action;
        if (action == 'post') {
            if (!attitude) {
                attitude = new Attitude();
            }
            attitude.like = (this.request.query.attitude == "like");
            attitude.guest_id = this.session.guest._id;
            attitude.article_id = this.params.article_id;
            attitude.save();
        }
        else {
            if (attitude) {
                attitude.remove();
            }
        }
    }
    this.redirect(this.app.url("articles-detail", {
        column_id: this.params.column_id,
        article_id: this.params.article_id
    }));
};