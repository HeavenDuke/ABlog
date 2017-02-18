/**
 * Created by Obscurity on 2016/5/29.
 */

let articles_controller = require('../../../controller').columns.articles;
let comment_router = require('./comments');
let likes_router = require('./likes');
let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');
let set_redirection = require('../../../middlewares/set_redirection');

module.exports = function(app) {

    let current_module = function *(next) {
        this.current_module = "column";
        yield next;
    };

    app.get('columns-articles-new', '/columns/:column_id/articles/new', visit_recorder, set_redirection, current_module, authentication.admin_only, articles_controller.init);

    app.get('columns-articles-show', '/columns/:column_id/articles/:article_id', visit_recorder, set_redirection, current_module, articles_controller.show);

    app.get('columns-articles-edit', '/columns/:column_id/articles/:article_id/edit', visit_recorder, set_redirection, current_module, authentication.admin_only, articles_controller.edit);

    app.post('columns-articles-create', '/columns/:column_id/articles', visit_recorder, current_module, authentication.admin_only, articles_controller.create);

    app.put('columns-articles-update', '/columns/:column_id/articles/:article_id', visit_recorder, current_module, authentication.admin_only, articles_controller.update);

    app.del('columns-articles-destroy', '/columns/:column_id/articles/:article_id', visit_recorder, current_module, authentication.admin_only, articles_controller.destroy);

    comment_router(app);

    likes_router(app);

};