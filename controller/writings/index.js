"use strict";
/**
 * Created by heavenduke on 16-7-7.
 */

exports.index = async (ctx, next) => {
    ctx.render('writings/index', {
        title: "每日码字统计",
        current_module: ctx.current_module,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user
    })
};

exports.show = async (ctx, next) => {
    let Writing = global.database.models.writing;
    let date = new Date(ctx.params.date);
    date.setHours(0, 0, 0);
    let writing = await Writing.findOne({date: date});
    ctx.body = writing ? writing.count : 0;
};

exports.update = async (ctx, next) => {
    let Writing = global.database.models.writing;
    let date = new Date(ctx.request.body.date);
    date.setHours(0, 0, 0);
    let writing = await Writing.findOne({date: date});
    if (!writing) {
        writing = new Writing();
        writing.date = date;
    }
    writing.count = parseInt(ctx.request.body.count);
    writing.save();
    ctx.redirect(ctx.app.url('writings-index'));
};