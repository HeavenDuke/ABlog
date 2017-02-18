/**
 * Created by Obscurity on 2016/5/28.
 */

exports.index = function*(next) {
    let Column = global.database.models.column;
    let columns = yield Column.find({}).sort({updated_at: -1});
    this.render("./columns/index", {
        title: "专栏目录",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        columns: columns,
        redirect_url: this.request.url
    });
};

exports.show = function*(next) {
    let Column = global.database.models.column;
    let Article = global.database.models.article;
    let column = yield Column.findById(this.params.column_id);
    let columns = yield Column.find({}).sort({updated_at: -1});
    let articles = yield Article.find({column_id: this.params.column_id}).sort({order: 1});
    this.render("./columns/show", {
        title: column.name,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        columns: columns,
        column: column,
        articles: articles,
        redirect_url: this.request.url
    });
};

exports.init = function*(next) {
    this.render("./columns/new", {
        title: "添加专栏",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    });
};

exports.create = function*(next) {
    let Column = global.database.models.column;
    let _tags = JSON.parse(this.request.body.tags);
    let tags = [];
    _tags.forEach(function (tag) {
        tags.push({name: tag});
    });
    let column = yield Column.create({
        name: this.request.body.name,
        introduction: this.request.body.introduction,
        tags: tags
    });
    this.redirect(this.app.url("columns-detail", {"column_id": column._id}));
};

exports.edit = function*(next) {
    let Column = global.database.models.column;
    let column = yield Column.findById(this.params.column_id);
    this.render("./columns/edit", {
        title: "编辑专栏信息",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        column: column,
        redirect_url: this.request.url
    });
};

exports.update = function*(next) {
    let Column = global.database.models.column;
    let column = yield Column.findById(this.params.column_id);
    let tags = JSON.parse(this.request.body.tags);
    column.name = this.request.body.name;
    column.introduction = this.request.body.introduction;
    column.updated_at = Date.now();
    column.tags = [];
    tags.forEach(function (tag) {
        column.tags.push({name: tag});
    });
    yield column.save();
    this.redirect(this.app.url("columns-detail", {"column_id": column._id}));
};

exports.destroy = function*(next) {
    let Column = global.database.models.column;
    let Article = global.database.models.article;
    yield Column.findByIdAndRemove(this.params.column_id);
    yield Article.remove({column_id: this.params.column_id});
    this.redirect(this.app.url("columns-list"));
};

exports.articles = require('./articles');