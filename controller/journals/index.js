/**
 * Created by Obscurity on 2016/3/20.
 */

let index = function *(next) {
    let Journal = global.database.models.journal;
    let journal_per_page = global.conf.pagination.journal;
    let total_journal_count = null;
    let topped_journal_count = null;
    let current_page_index = null;
    let total_page = null;
    let offset = null;
    let journals = null;
    let journals_not_topped = null;
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
        journals = yield Journal.find({
            placed_top: true,
            is_public: true
        }).sort({updated_at: -1}).skip(offset).limit(journal_per_page);
        if (journals.length < journal_per_page) {
            journals_not_topped = yield Journal.find({
                placed_top: false,
                is_public: true
            }).sort({updated_at: -1}).skip(offset > topped_journal_count ? offset - topped_journal_count : 0).limit(journal_per_page - journals.length);
            journals = journals.concat(journals_not_topped);
        }
    }
    let pagination = {
        total_page: total_page,
        current_index: current_page_index
    };
    this.render('./journals/index', {
        "title": "博客列表",
        current_guest: this.session.guest,
        current_user: this.session.user,
        journals: journals,
        pagination: pagination,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

let show = function *(next) {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let Attitude = global.database.models.attitude;
    let Guest = global.database.models.guest;
    let User = global.database.models.user;
    let setReadSession = function (session, journal_id) {
        if (!session.read_history) {
            session.read_history = {};
        }
        journal.read_count += 1;
        journal.save();
        session.read_history[journal_id] = true;
    };
    let journal = yield Journal.findById(this.params.journal_id);
    let attitude = this.session.guest ? yield Attitude.findOne({
        guest_id: this.session.guest._id,
        journal_id: this.params.journal_id
    }) : null;
    let likes = yield Attitude.count({like: true, journal_id: this.params.journal_id});
    let dislikes = yield Attitude.count({like: false, journal_id: this.params.journal_id});
    if (journal.is_public || this.session.user) {
        if (!this.session.read_history || !this.session.read_history[journal._id]) {
            setReadSession(this.session, journal._id);
        }
        let comments = yield Comment.find({journal_id: journal._id}).sort({created_at: 1});
        let user_id = null;
        let guest_ids = [];
        let ctx = this;
        comments.forEach(function (comment) {
            if (ctx.session.user) {
                comment.is_checked = true;
            }
            comment.replies.forEach(function (reply) {
                if (ctx.session.user) {
                    reply.is_checked = true;
                }
                if (reply.user_id) {
                    user_id = reply.user_id;
                }
                if (reply.guest_id) {
                    guest_ids.push(reply.guest_id);
                }
            });
            if (comment.user_id) {
                user_id = comment.user_id;
            }
            if (comment.guest_id) {
                guest_ids.push(comment.guest_id);
            }
            comment.save();
        });
        let guests = yield Guest.find({_id: {"$in": guest_ids}});
        let json_guests = {};
        guests.forEach(function (guest) {
            json_guests[guest._id] = {
                _id: guest._id,
                username: guest.username,
                head: guest.head
            };
        });
        if (user_id) {
            let user = yield User.findById(user_id);
        }
        let json_comments = [];
        comments.forEach(function (comment) {
            let json_comment = {
                _id: comment._id,
                journal_id: comment.journal_id,
                content: comment.content,
                created_at: comment.created_at,
                replies: []
            };
            comment.replies.forEach(function (reply) {
                let json_reply = {
                    _id: reply._id,
                    content: reply.content,
                    created_at: reply.created_at
                };
                if (reply.user_id) {
                    json_reply.user = user;
                }
                if (reply.guest_id) {
                    json_reply.guest = json_guests[reply.guest_id];
                }
                json_comment.replies.push(json_reply);
            });
            if (comment.user_id) {
                json_comment.user = user;
            }
            if (comment.guest_id) {
                json_comment.guest = json_guests[comment.guest_id];
            }
            json_comments.push(json_comment);
        });
        this.render('./journals/show', {
            "title": journal.title,
            likes: likes,
            dislikes: dislikes,
            attitude: attitude,
            journal: journal,
            comments: json_comments,
            current_guest: this.session.guest,
            current_user: this.session.user,
            current_module: this.current_module,
            redirect_url: this.request.url
        }, true);
    }
    else {
        this.redirect(this.app.url('journals-list'));
    }
};

let init = function *(next) {
    this.render('./journals/new', {
        "title": "写博客",
        current_guest: this.session.guest,
        current_user: this.session.user,
        redirect_url: this.request.url
    }, true);
};

let create = function *(next) {
    let Journal = global.database.models.journal;
    let journal = new Journal();
    journal.title = this.request.body.title;
    journal.content = !this.request.body.content ? "" : this.request.body.content;
    journal.placed_top = !!this.request.body.placed_top;
    journal.is_public = !!this.request.body.is_public;
    journal.save();
    this.redirect(this.app.url("journals-detail", {journal_id: journal._id}));
};

let edit = function *(next) {
    let Journal = global.database.models.journal;
    let journal = yield Journal.findById(this.params.journal_id);
    this.render('./journals/edit', {
        "title": "编辑博客",
        journal: journal,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

let update = function *(next) {
    let Journal = global.database.models.journal;
    let journal = yield Journal.findById(this.params.journal_id);
    journal.title = this.request.body.title;
    journal.content = !this.request.body.content ? "" : this.request.body.content;
    journal.placed_top = !(!this.request.body.placed_top);
    journal.is_public = !!this.request.body.is_public;
    journal.updated_at = Date.now();
    journal.save();
    this.redirect(this.app.url('journals-update', {journal_id: journal._id}));
};

let destroy = function *(next) {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let journal = yield Journal.findById(this.params.journal_id);
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