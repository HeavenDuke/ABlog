/**
 * Created by Obscurity on 2016/3/20.
 */

var index = function *(next) {
    var Journal = global.database.models.journal;
    var journal_per_page = global.conf.pagination.journal;
    var total_journal_count = null;
    var topped_journal_count = null;
    var current_page_index = null;
    var total_page = null;
    var offset = null;
    var journals = null;
    var journals_not_topped = null;
    if (this.session.user) {
        total_journal_count = yield Journal.count({});
        topped_journal_count = yield Journal.count({"placed_top": true});
        total_page = Math.ceil(total_journal_count / journal_per_page);
        current_page_index = parseInt(this.request.query.page) == 0 || isNaN(parseInt(this.request.query.page)) ? 1 : parseInt(this.request.query.page);
        offset = (current_page_index - 1) * global.conf.pagination.journal;
        journals = yield Journal.find({placed_top: true}).sort({updated_at: -1}).skip(offset).limit(journal_per_page);
        if (journals.length < journal_per_page) {
            journals_not_topped = yield Journal.find({placed_top: false}).sort({updated_at: -1}).skip(offset > topped_journal_count ? offset - topped_journal_count : 0).limit(journal_per_page - journals.length);
            journals = journals.concat(journals_not_topped);
        }
    }
    else {
        total_journal_count = yield Journal.count({is_public: true});
        topped_journal_count = yield Journal.count({"placed_top": true, is_public: true});
        total_page = Math.ceil(total_journal_count / journal_per_page);
        current_page_index = parseInt(this.request.query.page) == 0 || isNaN(parseInt(this.request.query.page)) ? 1 : parseInt(this.request.query.page);
        offset = (current_page_index - 1) * global.conf.pagination.journal;
        journals = yield Journal.find({placed_top: true, is_public: true}).sort({updated_at: -1}).skip(offset).limit(journal_per_page);
        if (journals.length < journal_per_page) {
            journals_not_topped = yield Journal.find({placed_top: false, is_public: true}).sort({updated_at: -1}).skip(offset > topped_journal_count ? offset - topped_journal_count : 0).limit(journal_per_page - journals.length);
            journals = journals.concat(journals_not_topped);
        }
    }
    var pagination = {
        total_page: total_page,
        current_index: current_page_index
    };
    this.render('./journals/index',{"title":"博客列表", current_user: this.session.user, journals: journals, pagination: pagination, current_module: this.current_module, redirect_url: this.request.url}, true);
};

var show = function *(next) {
    var Journal = global.database.models.journal;
    var Comment = global.database.models.comment;
    var setReadSession = function (session, journal_id) {
        if (!session.read_history) {
            session.read_history = {};
        }
        journal.read_count += 1;
        journal.save();
        session.read_history[journal_id] = true;
    };
    var journal = yield Journal.findById(this.params.journal_id);
    if (journal.is_public || this.session.user) {
        if (!this.session.read_history || !this.session.read_history[journal._id]) {
            setReadSession(this.session, journal._id);
        }
        var comments = yield Comment.find({journal_id: journal._id}).sort({created_at: 1});
        if (this.session.user) {
            comments.forEach(function (comment) {
                comment.is_checked = true;
                comment.replies.forEach(function (reply) {
                    reply.is_checked = true;
                });
                comment.save();
            });
        }
        this.render('./journals/show',{"title":journal.title, journal: journal, comments: comments, current_user: this.session.user, current_module: this.current_module, redirect_url: this.request.url}, true);
    }
    else {
        this.redirect(this.app.url('journals-list'));
    }
};

var init = function *(next) {
    this.render('./journals/new',{"title":"写博客", current_user: this.session.user, redirect_url: this.request.url}, true);
};

var create = function *(next) {
    var Journal = global.database.models.journal;
    var journal = new Journal();
    journal.title = this.request.body.title;
    journal.content = !this.request.body.content ? "" : this.request.body.content;
    journal.placed_top = !!this.request.body.placed_top;
    journal.is_public = !!this.request.body.is_public;
    journal.save();
    this.redirect(this.app.url("journals-detail", {journal_id: journal._id}));
};

var edit = function *(next) {
    var Journal = global.database.models.journal;
    var journal = yield Journal.findById(this.params.journal_id);
    this.render('./journals/edit',{"title": "编辑博客", journal: journal, current_user: this.session.user, current_module: this.current_module, redirect_url: this.request.url}, true);
};

var update = function *(next) {
    var Journal = global.database.models.journal;
    var journal = yield Journal.findById(this.params.journal_id);
    journal.title = this.request.body.title;
    journal.content = !this.request.body.content ? "" : this.request.body.content;
    journal.placed_top = !(!this.request.body.placed_top);
    journal.is_public = !!this.request.body.is_public;
    journal.updated_at = Date.now();
    journal.save();
    this.redirect(this.app.url('journals-update', {journal_id: journal._id}));
};

var destroy = function *(next) {
    var Journal = global.database.models.journal;
    var Comment = global.database.models.comment;
    var journal = yield Journal.findById(this.params.journal_id);
    yield Comment.remove({journal_id: journal._id});
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
    comments: require('./comments'),
    likes: require('./likes')
};