/**
 * Created by heavenduke on 17-4-25.
 */

exports.mount = function (app, router) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};

exports.stack = function (parent, prefix, child) {
    if (prefix != "/") {
        parent.use(prefix, child.routes());
        parent.use(child.allowedMethods());
    }
    else {
        exports.mount(parent, child);
    }
};