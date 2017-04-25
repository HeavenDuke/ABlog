/**
 * Created by heavenduke on 17-1-13.
 */
"use strict";

exports.create = async (ctx, next) => {
    let Link = global.database.models.link;
    let link = new Link();
    link.name = ctx.request.body.name;
    link.url = ctx.request.body.url;
    link.save();
    ctx.redirect("/");
};

exports.destroy = async (ctx, next) => {
    let Link = global.database.models.link;
    let link = await Link.findById(ctx.params.link_id);
    link.remove();
    ctx.redirect("/");
};
