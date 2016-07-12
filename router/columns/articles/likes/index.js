/**
 * Created by Obscurity on 2016/5/29.
 */

var likes_controller = require("../../../../controller").columns.articles.likes;
var authentication = require('../../../../middlewares/authentication');
var visit_recorder = require('../../../../middlewares/visit_recorder');

module.exports = function (app) {
    app.post('columns-articles-likes-create', '/columns/:column_id/articles/:articles/likes', visit_recorder, authentication.guest_only, likes_controller.create);
};