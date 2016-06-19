/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = function *(next) {
    var article_id = this.params.article_id;
    var Article = global.database.models.article;
    var Comment = global.database.models.comment;
    var comment = new Comment();
    var article = yield Article.findById(article_id);
    comment.content = this.request.body.content;
    comment.article_id = article_id;
    comment.save();
    article.comment_count += 1;
    article.save();
    this.redirect(this.app.url("articles-detail", {column_id: this.params.column_id, article_id: this.params.article_id}));
};

exports.destroy = function *(next) {
    var Article = global.database.models.article;
    var Comment = global.database.models.comment;
    var comment = yield Comment.findById(this.params.comment_id);
    var article_id = comment.article_id;
    var article = yield Article.findById(article_id);
    comment.remove();
    article.comment_count -= 1;
    article.save();
    this.redirect(this.app.url("articles-detail", {column_id: this.params.column_id, article_id: this.params.article_id}));
};

exports.replies = require('./replies');