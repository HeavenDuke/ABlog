"use strict";
/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = async (ctx, next) => {
    let article_id = ctx.params.article_id;
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let comment = new Comment();
    let article = await Article.findById(article_id);
    comment.content = ctx.request.body.content;
    comment.article_id = article_id;
    if (ctx.session.guest) {
        comment.guest_id = ctx.session.guest._id;
    }
    else {
        comment.user_id = ctx.session.user._id;
    }
    comment.save();
    article.comment_count += 1;
    article.save();
    ctx.redirect(ctx.app.url("columns-articles-show", {
        column_id: ctx.params.column_id,
        article_id: ctx.params.article_id
    }));
};

exports.destroy = async (ctx, next) => {
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let comment = await Comment.findById(ctx.params.comment_id);
    let article_id = comment.article_id;
    let article = await Article.findById(article_id);
    comment.remove();
    article.comment_count -= 1;
    article.save();
    ctx.redirect(ctx.app.url("columns-articles-show", {
        column_id: ctx.params.column_id,
        article_id: ctx.params.article_id
    }));
};

exports.replies = require('./replies');