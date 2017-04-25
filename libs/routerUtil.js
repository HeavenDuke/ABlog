/**
 * Created by heavenduke on 17-4-25.
 */

exports.mount = function (app, router) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};