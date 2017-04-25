"use strict";
/**
 * Created by Obscurity on 2016/5/28.
 */

exports.show = async (ctx, next) => {
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let Attitude = global.database.models.attitude;
    let Column = global.database.models.column;
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
    let article = await Article.findById(ctx.params.article_id);
    let articles = await Article.find({column_id: ctx.params.column_id}).sort({order: 1});
    let column = await Column.findById(ctx.params.column_id);
    if (!ctx.session.read_history || !ctx.session.read_history[article._id]) {
        setReadSession(ctx.session, article);
    }
    let attitude = ctx.session.guest ? await Attitude.findOne({
        guest_id: ctx.session.guest._id,
        journal_id: ctx.params.journal_id
    }) : null;
    let likes = await Attitude.count({like: true, journal_id: ctx.params.journal_id});
    let dislikes = await Attitude.count({like: false, journal_id: ctx.params.journal_id});
    let comments = await Comment.find({article_id: article._id}).sort({created_at: 1});
    let user_id = null;
    let guest_ids = [];
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
    let guests = await Guest.find({_id: {"$in": guest_ids}}), user = null;
    let json_guests = {};
    guests.forEach(function (guest) {
        json_guests[guest._id] = {
            _id: guest._id,
            username: guest.username,
            head: guest.head
        };
    });
    if (user_id) {
        user = await User.findById(user_id);
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
    ctx.render('./columns/articles/show', {
        title: article.title,
        likes: likes,
        dislikes: dislikes,
        attitude: attitude,
        column_id: ctx.params.column_id,
        article: article,
        articles: articles,
        comments: json_comments,
        keywords: column.keywords().join(','),
        description: column.keywords().join(','),
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        redirect_url: ctx.request.url
    }, true);
};

exports.init = async (ctx, next) => {
    let Column = global.database.models.column;
    let column = await Column.findById(ctx.params.column_id);
    ctx.render('./columns/articles/new', {
        "title": "写专栏文章",
        current_module: ctx.current_module,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        column: column,
        redirect_url: ctx.request.url
    }, true);
};

exports.create = async (ctx, next) => {
    let Article = global.database.models.article;
    let Column = global.database.models.column;
    let article = new Article();
    let column = await Column.findById(ctx.params.column_id);
    article.title = ctx.request.body.title;
    article.order = ctx.request.body.order;
    article.column_id = ctx.params.column_id;
    article.content = !ctx.request.body.content ? "" : ctx.request.body.content;
    article.save();
    column.updated_at = Date.now();
    column.save();
    ctx.redirect("/columns/" + ctx.params.column_id + "/articles/" + article._id);
};

exports.edit = async (ctx, next) => {
    let Article = global.database.models.article;
    let article = await Article.findById(ctx.params.article_id);
    ctx.render('./columns/articles/edit', {
        "title": "编辑博客",
        article: article,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        redirect_url: ctx.request.url
    }, true);
};

exports.update = async (ctx, next) => {
    let Article = global.database.models.article;
    let Column = global.database.models.column;
    let article = await Article.findById(ctx.params.article_id);
    let column = await Column.findById(ctx.params.column_id);
    article.title = ctx.request.body.title;
    article.content = !ctx.request.body.content ? "" : ctx.request.body.content;
    article.order = ctx.request.body.order;
    article.column_id = ctx.params.column_id;
    article.updated_at = Date.now();
    article.save();
    column.updated_at = Date.now();
    column.save();
    ctx.redirect("/columns/" + ctx.params.column_id + "/articles/" + article._id);
};

exports.destroy = async (ctx, next) => {
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let article = await Article.findById(ctx.params.article_id);
    await Comment.remove({journal_id: article._id});
    article.remove();
    ctx.redirect("/columns/" + ctx.params.column_id);
};

exports.comments = require('./comments');
exports.likes = require('./likes');