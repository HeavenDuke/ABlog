/**
 * Created by Obscurity on 2016/5/29.
 */

var articlesController = require('../../../controller').column.article;
var commentRouter = require('./comments');
var likesRouter = require('./likes');
var authentication = require('../../../middlewares/authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "column";
        yield next;
    };

    app.get('articles-new', '/columns/:column_id/articles/new', visit_recorder, current_module, authentication, articlesController.init);

    app.get('articles-detail', '/columns/:column_id/articles/:article_id', visit_recorder, current_module, articlesController.show);

    app.get('articles-edit', '/columns/:column_id/articles/:article_id/edit', visit_recorder, current_module, authentication, articlesController.edit);

    app.post('articles-create', '/columns/:column_id/articles', visit_recorder, current_module, authentication, articlesController.create);

    app.put('articles-update', '/columns/:column_id/articles/:article_id', visit_recorder, current_module, authentication, articlesController.update);

    app.del('articles-destroy', '/columns/:column_id/articles/:article_id', visit_recorder, current_module, authentication, articlesController.destroy);

    commentRouter(app);

    //likesRouter(app);

};