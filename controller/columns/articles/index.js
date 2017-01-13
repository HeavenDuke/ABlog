/**
 * Created by Obscurity on 2016/5/28.
 */

var show = function *(next) {
    var Article = global.database.models.article;
    var Comment = global.database.models.comment;
    var Attitude = global.database.models.attitude;
    var Guest = global.database.models.guest;
    var User = global.database.models.user;
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
    var attitude = this.session.guest ? yield Attitude.findOne({
        guest_id: this.session.guest._id,
        journal_id: this.params.journal_id
    }) : null;
    var likes = yield Attitude.count({like: true, journal_id: this.params.journal_id});
    var dislikes = yield Attitude.count({like: false, journal_id: this.params.journal_id});
    var comments = yield Comment.find({article_id: article._id}).sort({created_at: 1});
    var user_id = null;
    var guest_ids = [];
    var ctx = this;
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
    var guests = yield Guest.find({_id: {"$in": guest_ids}});
    var json_guests = {};
    guests.forEach(function (guest) {
        json_guests[guest._id] = {
            _id: guest._id,
            username: guest.username,
            head: guest.head
        };
    });
    if (user_id) {
        var user = yield User.findById(user_id);
    }
    var json_comments = [];
    comments.forEach(function (comment) {
        var json_comment = {
            _id: comment._id,
            journal_id: comment.journal_id,
            content: comment.content,
            created_at: comment.created_at,
            replies: []
        };
        comment.replies.forEach(function (reply) {
            var json_reply = {
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
    this.render('./columns/articles/show', {
        title: article.title,
        likes: likes,
        dislikes: dislikes,
        attitude: attitude,
        column_id: this.params.column_id,
        article: article,
        articles: articles,
        comments: json_comments,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

var init = function *(next) {
    var Column = global.database.models.column;
    var column = yield Column.findById(this.params.column_id);
    this.render('./columns/articles/new', {
        "title": "写专栏文章",
        current_module: this.current_module,
        current_guest: this.session.guest,
        current_user: this.session.user,
        column: column,
        redirect_url: this.request.url
    }, true);
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
    this.render('./columns/articles/edit', {
        "title": "编辑博客",
        article: article,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
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
    comments: require('./comments'),
    likes: require('./likes')
};