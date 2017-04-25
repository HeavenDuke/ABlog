/**
 * Created by heavenduke on 17-4-25.
 */

module.exports = function (name) {
    return async (ctx, next) => {
        ctx.current_module = name;
        await next();
    };
};