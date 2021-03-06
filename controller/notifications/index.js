/**
 * Created by heavenduke on 16-7-11.
 */
"use strict";

exports.index = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Article = global.database.models.article;
    let Comment = global.database.models.comment;
    let comments = await Comment.find({"$or": [{is_checked: false}, {'replies.is_checked': false}]});
    let article_ids = [];
    let journal_ids = [];
    comments.forEach(function (comment) {
        if (comment.article_id) {
            article_ids.push(comment.article_id);
        }
        else {
            journal_ids.push(comment.journal_id);
        }
    });
    let notifications = {
        articles: await Article.find({_id: {"$in": article_ids}}),
        journals: await Journal.find({_id: {"$in": journal_ids}})
    };
    ctx.body = JSON.stringify(notifications);
};