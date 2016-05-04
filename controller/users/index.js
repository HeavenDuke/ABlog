/**
 * Created by Obscurity on 2016/3/20.
 */

var loginView = function *(next) {
    this.render('./users/login',{"title":"koa demo"}, true);
};

var edit = function *(next) {
    this.render('./users/edit',{"title":"koa demo"}, true);
};

var update = function *(next) {

};

var loginAction = function *(next) {

};

var logoutAction = function *(next) {

};

module.exports = {
    loginView: loginView,
    loginAction: loginAction,
    logoutAction: logoutAction,
    edit: edit,
    update: update
};