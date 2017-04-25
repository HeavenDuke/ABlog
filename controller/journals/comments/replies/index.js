/**
 * Created by Obscurity on 2016/5/17.
 */
"use strict";

exports.create = async (ctx, next) => {
    let Comment = global.database.models.comment;
    let comment = await Comment.findById(ctx.params.comment_id);
    let reply = {content: ctx.request.body.content};
    if (ctx.session.guest) {
        reply.guest_id = ctx.session.guest._id;
    }
    else {
        reply.user_id = ctx.session.user._id;
    }
    comment.replies.push(reply);
    comment.save();
    ctx.redirect(ctx.app.url("journals-show", {journal_id: ctx.params.journal_id}));
};