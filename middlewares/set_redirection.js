"use strict";
/**
 * Created by Obscurity on 2016/7/14.
 */

module.exports = async (ctx, next) => {
    ctx.asb = ctx.request.url;
    await next();
};