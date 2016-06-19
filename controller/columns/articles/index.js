/**
 * Created by Obscurity on 2016/5/28.
 */

var show = function *(next) {
    var Article = global.database.models.article;
    var Comment = global.database.models.comment;
    var setReadSession = function (session, article) {
        if (!session.read_history) {
            session.read_history = {};
        }
        article.read_count += 1;
        article.save();
        session.read_history[article._id] = true;
    };
    var article = yield Article.findById(this.params.article_id);
    var articles = yield Article.find({column_id: this.params.column_id}).sort({order: 1});
    if (!this.session.read_history || !this.session.read_history[article._id]) {
        setReadSession(this.session, article);
    }
    var comments = yield Comment.find({article_id: article._id}).sort({created_at: 1});
    this.render('./columns/articles/show',{title: article.title, column_id: this.params.column_id, article: article, articles: articles, comments: comments, current_user: this.session.user, current_module: this.current_module, redirect_url: this.request.url}, true);
};

var init = function *(next) {
    var Column = global.database.models.column;
    var column = yield Column.findById(this.params.column_id);
    this.render('./columns/articles/new',{"title":"写专栏文章", current_module: this.current_module, current_user: this.session.user, column: column, redirect_url: this.request.url}, true);
};

var create = function *(next) {
    var Article = global.database.models.article;
    var Column = global.database.models.column;
    var article = new Article();
    var column = yield Column.findById(this.params.column_id);
    article.title = this.request.body.title;
    article.order = this.request.body.order;
    article.column_id = this.params.column_id;
    article.content = !this.request.body.content ? "" : this.request.body.content;
    article.save();
    column.updated_at = Date.now();
    column.save();
    this.redirect(this.app.url("articles-detail", {column_id: this.params.column_id, article_id: article._id}));
};

var edit = function *(next) {
    var Article = global.database.models.article;
    var article = yield Article.findById(this.params.article_id);
    this.render('./columns/articles/edit',{"title": "编辑博客", article: article, current_user: this.session.user, current_module: this.current_module, redirect_url: this.request.url}, true);
};

var update = function *(next) {
    var Article = global.database.models.article;
    var Column = global.database.models.column;
    var article = yield Article.findById(this.params.article_id);
    var column = yield Column.findById(this.params.column_id);
    article.title = this.request.body.title;
    article.content = !this.request.body.content ? "" : this.request.body.content;
    article.order = this.request.body.order;
    article.column_id = this.params.column_id;
    article.updated_at = Date.now();
    article.save();
    column.updated_at = Date.now();
    column.save();
    this.redirect(this.app.url('articles-detail', {column_id: this.params.column_id, article_id: article._id}));
};

var destroy = function *(next) {
    var Article = global.database.models.article;
    var Comment = global.database.models.comment;
    var article = yield Article.findById(this.params.article_id);
    yield Comment.remove({journal_id: article._id});
    article.remove();
    this.redirect(this.app.url('columns-detail', {column_id: this.params.column_id}));
};

module.exports = {
    show: show,
    init: init,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
    comments: require('./comments')
};