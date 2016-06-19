/**
 * Created by Obscurity on 2016/5/28.
 */

var index = function* (next) {
    var Column = global.database.models.column;
    var columns = yield Column.find({}).sort({updated_at: -1});
    this.render("./columns/index", {title: "专栏目录", current_user: this.session.user, current_module: this.current_module, columns: columns, redirect_url: this.request.url});
};

var show = function* (next) {
    var Column = global.database.models.column;
    var Article = global.database.models.article;
    var column = yield Column.findById(this.params.column_id);
    var columns = yield Column.find({}).sort({updated_at: -1});
    var articles = yield Article.find({column_id: this.params.column_id}).sort({order: 1});
    this.render("./columns/show", {title: column.name, current_user: this.session.user, current_module: this.current_module, columns: columns, column: column, articles: articles, redirect_url: this.request.url});
};

var init = function* (next) {
    this.render("./columns/new", {title: "添加专栏", current_user: this.session.user, current_module: this.current_module, redirect_url: this.request.url});
};

var create = function* (next) {
    var Column = global.database.models.column;
    var column = new Column();
    column.name = this.request.body.name;
    column.introduction = this.request.body.introduction;
    column.save();
    this.redirect(this.app.url("columns-detail", {"column_id": column._id}));
};

var edit = function* (next) {
    var Column = global.database.models.column;
    var column = yield Column.findById(this.params.column_id);
    this.render("./columns/edit", {title: "编辑专栏信息", current_user: this.session.user, current_module: this.current_module, column: column, redirect_url: this.request.url});
};

var update = function* (next) {
    var Column = global.database.models.column;
    var column = yield Column.findById(this.params.column_id);
    column.name = this.request.body.name;
    column.introduction = this.request.body.introduction;
    column.updated_at = Date.now();
    column.save();
    this.redirect(this.app.url("columns-detail", {"column_id": column._id}));
};

var destroy = function* (next) {
    var Column = global.database.models.column;
    var Article = global.database.models.article;
    yield Column.findByIdAndRemove(this.params.column_id);
    yield Article.remove({ column_id: this.params.column_id});
    this.redirect(this.app.url("columns-list"));
};

module.exports = {
    index: index,
    show: show,
    init: init,
    edit: edit,
    create: create,
    update: update,
    destroy: destroy,
    articles: require('./articles')
};