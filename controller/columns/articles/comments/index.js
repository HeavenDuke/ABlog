/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = function *(next) {
    let article_id = this.params.article_id;
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let comment = new Comment();
    let article = yield Article.findById(article_id);
    comment.content = this.request.body.content;
    comment.article_id = article_id;
    if (this.session.guest) {
        comment.guest_id = this.session.guest._id;
    }
    else {
        comment.user_id = this.session.user._id;
    }
    comment.save();
    article.comment_count += 1;
    article.save();
    this.redirect(this.app.url("articles-detail", {
        column_id: this.params.column_id,
        article_id: this.params.article_id
    }));
};

exports.destroy = function *(next) {
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let comment = yield Comment.findById(this.params.comment_id);
    let article_id = comment.article_id;
    let article = yield Article.findById(article_id);
    comment.remove();
    article.comment_count -= 1;
    article.save();
    this.redirect(this.app.url("articles-detail", {
        column_id: this.params.column_id,
        article_id: this.params.article_id
    }));
};

exports.replies = require('./replies');