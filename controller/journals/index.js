/**
 * Created by Obscurity on 2016/3/20.
 */

var Router = require('koa-router');

var index = function *(next) {
    var Journal = global.database.models.journal;
    var total_journal_count = yield Journal.count({});
    var total_page = Math.ceil(total_journal_count / global.conf.pagination.journal);
    var current_page_index = parseInt(this.request.query.page) == 0 || isNaN(parseInt(this.request.query.page)) ? 1 : parseInt(this.request.query.page);
    var offset = (current_page_index - 1) * global.conf.pagination.journal;
    var journals = yield Journal.find({}).sort({"updated_at": -1}).skip(offset).limit(global.conf.pagination.journal);
    var pagination = {
        total_page: total_page,
        current_index: current_page_index
    };
    this.render('./journals/index',{"title":"文章列表", current_user: this.session.user, journals: journals, pagination: pagination}, true);
};

var show = function *(next) {
    var Journal = global.database.models.journal;
    var journal = yield Journal.findById(this.params.journal_id);
    this.render('./journals/show',{"title":"koa demo", journal: journal, current_user: this.session.user}, true);
};

var init = function *(next) {
    this.render('./journals/new',{"title":"koa demo", current_user: this.session.user}, true);
};

var create = function *(next) {
    var Journal = global.database.models.journal;
    var journal = new Journal();
    journal.title = this.request.body.title;
    journal.content = this.request.body.content;
    journal.save();
    this.redirect(this.app.url("journals-detail", {journal_id: journal._id}));
};

var edit = function *(next) {
    var Journal = global.database.models.journal;
    var journal = yield Journal.findById(this.params.journal_id);
    this.render('./journals/edit',{"title":"koa demo", journal: journal, current_user: this.session.user}, true);
};

var update = function *(next) {
    var Journal = global.database.models.journal;
    var journal = yield Journal.findById(this.params.journal_id);
    journal.title = this.request.body.title;
    journal.content = this.request.body.content;
    journal.save();
    this.redirect(this.app.url('journals-update', {journal_id: journal._id}));
};

var destroy = function *(next) {
    var Journal = global.database.models.journal;
    var journal = yield Journal.findById(this.params.journal_id);
    journal.remove();
    this.redirect(this.app.url('journals-list'));
};

module.exports = {
    index: index,
    show: show,
    init: init,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
    categories: require('./categories')
};