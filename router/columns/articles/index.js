/**
 * Created by Obscurity on 2016/5/29.
 */

var articles_controller = require('../../../controller').columns.articles;
var comment_router = require('./comments');
var likes_router = require('./likes');
var authentication = require('../../../middlewares/authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');
var set_redirection = require('../../../middlewares/set_redirection');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "column";
        yield next;
    };

    app.get('articles-new', '/columns/:column_id/articles/new', visit_recorder, set_redirection, current_module, authentication.admin_only, articles_controller.init);

    app.get('articles-detail', '/columns/:column_id/articles/:article_id', visit_recorder, set_redirection, current_module, articles_controller.show);

    app.get('articles-edit', '/columns/:column_id/articles/:article_id/edit', visit_recorder, set_redirection, current_module, authentication.admin_only, articles_controller.edit);

    app.post('articles-create', '/columns/:column_id/articles', visit_recorder, current_module, authentication.admin_only, articles_controller.create);

    app.put('articles-update', '/columns/:column_id/articles/:article_id', visit_recorder, current_module, authentication.admin_only, articles_controller.update);

    app.del('articles-destroy', '/columns/:column_id/articles/:article_id', visit_recorder, current_module, authentication.admin_only, articles_controller.destroy);

    comment_router(app);

    likes_router(app);

};