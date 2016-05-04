/**
 * Created by Obscurity on 2016/3/20.
 */

var index = function *(next) {
    this.render('./projects/index',{"title":"koa demo"}, true);
};

var init = function *(next) {
    this.render('./projects/new',{"title":"koa demo"}, true);
};

var create = function *(next) {

};

var edit = function *(next) {
    this.render('./projects/edit',{"title":"koa demo"}, true);
};

var update = function *(next) {

};

var destroy = function *(next) {

};

module.exports = {
    index: index,
    init: init,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy
}