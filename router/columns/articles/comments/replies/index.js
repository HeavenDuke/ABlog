"use strict";
/**
 * Created by Obscurity on 2016/5/17.
 */


let replies_controller = require('../../../../../controller').columns.articles.comments.replies;
let authentication = require('../../../../../middlewares/authentication');
let visit_recorder = require('../../../../../middlewares/visit_recorder');

module.exports = function(app) {

    app.post('columns-articles-comments-replies-create', '/columns/:column_id/articles/:article_id/comments/:comment_id/replies', visit_recorder, authentication.cross_auth, replies_controller.create);

};