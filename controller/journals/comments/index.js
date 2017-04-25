"use strict";
/**
 * Created by heavenduke on 16-5-8.
 */

exports.create = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let comment = new Comment();
    let journal = await Journal.findById(ctx.params.journal_id);
    comment.content = ctx.request.body.content;
    if (ctx.session.guest) {
        comment.guest_id = ctx.session.guest._id;
    }
    else {
        comment.user_id = ctx.session.user._id;
    }
    comment.journal_id = ctx.params.journal_id;
    comment.save();
    journal.comment_count += 1;
    journal.save();
    ctx.redirect("/journals/" + ctx.params.journal_id);
};

exports.destroy = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let comment = await Comment.findById(ctx.params.comment_id);
    let journal = await Journal.findById(comment.journal_id);
    comment.remove();
    journal.comment_count -= 1;
    journal.save();
    ctx.redirect("/journals/" + comment.journal_id);
};

exports.replies = require('./replies');