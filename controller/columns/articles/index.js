/**
 * Created by Obscurity on 2016/5/28.
 */

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
        this.render('./journals/show',{"title":journal.title, journal: journal, comments: comments, current_user: this.session.user, current_module: this.current_module}, true);
    }
    else {
        this.redirect(this.app.url('journals-list'));
    }
};

var init = function *(next) {
    this.render('./journals/new',{"title":"写博客", current_user: this.session.user}, true);
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
    this.render('./journals/edit',{"title": "编辑博客", journal: journal, current_user: this.session.user, current_module: this.current_module}, true);
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
    comments: require('./comments')
};