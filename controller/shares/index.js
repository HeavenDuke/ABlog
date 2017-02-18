"use strict";
/**
 * Created by heavenduke on 17-1-28.
 */

let urlCoder = require('../../libs/urlEncoder');

exports.show = function *(next) {
    let Share = global.database.models.share;
    let url = urlCoder.url_decode(this.request.query.url);
    let shares = yield Share.find({
        url: url
    });
    let sum = 0;
    for (let i = 0; i < shares.length; i++) {
        sum += shares[i].stat;
    }
    this.body = {stat: sum};
};

exports.update = function *(next) {
    let Share = global.database.models.share;
    let url = urlCoder.url_decode(this.request.body.url);
    let platform = this.request.body.platform;
    let share = yield Share.findOne({
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
    this.body = {message: "success"};
};