/**
 * Created by Obscurity on 2016/5/11.
 */

exports.create = function *() {
    let Article = global.database.models.article;
    let Attitude = global.database.models.attitude;
    let article = yield Article.findById(this.params.article_id);
    if (article) {
        let attitude = yield Attitude.findOne({guest_id: this.session.guest._id, article_id: this.params.article_id});
        let action = this.request.query.action;
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