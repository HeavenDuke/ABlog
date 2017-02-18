"use strict";
/**
 * Created by Obscurity on 2016/5/28.
 */

exports.show = function *(next) {
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let Attitude = global.database.models.attitude;
    let Guest = global.database.models.guest;
    let User = global.database.models.user;
    let setReadSession = function (session, article) {
        if (!session.read_history) {
            session.read_history = {};
        }
        article.read_count += 1;
        article.save();
        session.read_history[article._id] = true;
    };
    let article = yield Article.findById(this.params.article_id);
    let articles = yield Article.find({column_id: this.params.column_id}).sort({order: 1});
    if (!this.session.read_history || !this.session.read_history[article._id]) {
        setReadSession(this.session, article);
    }
    let attitude = this.session.guest ? yield Attitude.findOne({
        guest_id: this.session.guest._id,
        journal_id: this.params.journal_id
    }) : null;
    let likes = yield Attitude.count({like: true, journal_id: this.params.journal_id});
    let dislikes = yield Attitude.count({like: false, journal_id: this.params.journal_id});
    let comments = yield Comment.find({article_id: article._id}).sort({created_at: 1});
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
    let guests = yield Guest.find({_id: {"$in": guest_ids}}), user = null;
    let json_guests = {};
    guests.forEach(function (guest) {
        json_guests[guest._id] = {
            _id: guest._id,
            username: guest.username,
            head: guest.head
        };
    });
    if (user_id) {
        user = yield User.findById(user_id);
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

exports.init = function *(next) {
    let Column = global.database.models.column;
    let column = yield Column.findById(this.params.column_id);
    this.render('./columns/articles/new', {
        "title": "写专栏文章",
        current_module: this.current_module,
        current_guest: this.session.guest,
        current_user: this.session.user,
        column: column,
        redirect_url: this.request.url
    }, true);
};

exports.create = function *(next) {
    let Article = global.database.models.article;
    let Column = global.database.models.column;
    let article = new Article();
    let column = yield Column.findById(this.params.column_id);
    article.title = this.request.body.title;
    article.order = this.request.body.order;
    article.column_id = this.params.column_id;
    article.content = !this.request.body.content ? "" : this.request.body.content;
    article.save();
    column.updated_at = Date.now();
    column.save();
    this.redirect(this.app.url("columns-articles-show", {column_id: this.params.column_id, article_id: article._id}));
};

exports.edit = function *(next) {
    let Article = global.database.models.article;
    let article = yield Article.findById(this.params.article_id);
    this.render('./columns/articles/edit', {
        "title": "编辑博客",
        article: article,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

exports.update = function *(next) {
    let Article = global.database.models.article;
    let Column = global.database.models.column;
    let article = yield Article.findById(this.params.article_id);
    let column = yield Column.findById(this.params.column_id);
    article.title = this.request.body.title;
    article.content = !this.request.body.content ? "" : this.request.body.content;
    article.order = this.request.body.order;
    article.column_id = this.params.column_id;
    article.updated_at = Date.now();
    article.save();
    column.updated_at = Date.now();
    column.save();
    this.redirect(this.app.url('columns-articles-show', {column_id: this.params.column_id, article_id: article._id}));
};

exports.destroy = function *(next) {
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let article = yield Article.findById(this.params.article_id);
    yield Comment.remove({journal_id: article._id});
    article.remove();
    this.redirect(this.app.url('columns-show', {column_id: this.params.column_id}));
};

exports.comments = require('./comments');
exports.likes = require('./likes');