"use strict";
/**
 * Created by Obscurity on 2016/5/11.
 */

exports.create = async (ctx, next) => {
    let Article = global.database.models.article;
    let Attitude = global.database.models.attitude;
    let article = await Article.findById(ctx.params.article_id);
    if (article) {
        let attitude = await Attitude.findOne({guest_id: ctx.session.guest._id, article_id: ctx.params.article_id});
        let action = ctx.request.query.action;
        if (action == 'post') {
            if (!attitude) {
                attitude = new Attitude();
            }
            attitude.like = (ctx.request.query.attitude == "like");
            attitude.guest_id = ctx.session.guest._id;
            attitude.article_id = ctx.params.article_id;
            attitude.save();
        }
        else {
            if (attitude) {
                attitude.remove();
            }
        }
    }
    ctx.redirect("/columns/" + ctx.params.column_id + "/articles/" + ctx.params.article_id);
};