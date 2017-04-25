"use strict";
/**
 * Created by Obscurity on 2016/5/11.
 */

exports.create = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Attitude = global.database.models.attitude;
    let type = ctx.request.query.type == "dislike" ? "dislikes_count" : "likes_count";
    let journal = await Journal.findById(ctx.params.journal_id);
    if (journal) {
        let attitude = await Attitude.findOne({guest_id: ctx.session.guest._id, journal_id: ctx.params.journal_id});
        let action = ctx.request.query.action;
        if (action == 'post') {
            if (!attitude) {
                attitude = new Attitude();
            }
            attitude.like = (ctx.request.query.attitude == "like");
            attitude.guest_id = ctx.session.guest._id;
            attitude.journal_id = ctx.params.journal_id;
            attitude.save();
        }
        else {
            if (attitude) {
                attitude.remove();
            }
        }
    }
    ctx.redirect("/journals/" + ctx.params.journal_id);
};