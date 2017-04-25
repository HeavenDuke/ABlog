"use strict";
/**
 * Created by heavenduke on 17-1-28.
 */

let urlCoder = require('../../libs/urlEncoder');

exports.show = async (ctx, next) => {
    let Share = global.database.models.share;
    let url = urlCoder.url_decode(ctx.request.query.url);
    let shares = await Share.find({
        url: url
    });
    let sum = 0;
    for (let i = 0; i < shares.length; i++) {
        sum += shares[i].stat;
    }
    ctx.body = {stat: sum};
};

exports.update = async (ctx, next) => {
    let Share = global.database.models.share;
    let url = urlCoder.url_decode(ctx.request.body.url);
    let platform = ctx.request.body.platform;
    let share = await Share.findOne({
        url: url,
        platform: platform
    });
    if (!share) {
        share = new Share();
        share.url = url;
        share.platform = platform;
        share.stat = 0;
    }
    share.stat += 1;
    share.save();
    ctx.body = {message: "success"};
};