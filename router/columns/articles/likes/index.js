/**
 * Created by Obscurity on 2016/5/29.
 */

let likes_controller = require("../../../../controller").columns.articles.likes;
let authentication = require('../../../../middlewares/authentication');
let visit_recorder = require('../../../../middlewares/visit_recorder');

module.exports = function (app) {
    app.post('columns-articles-likes-create', '/columns/:column_id/articles/:article_id/likes', visit_recorder, authentication.guest_only, likes_controller.create);
};