/**
 * Created by Obscurity on 2016/3/20.
 */

var journalsController = require('../../controller').journals;
var commentRouter = require('./comments');
var likesRouter = require('./likes');
var authentication = require('../../middlewares/authentication');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "journal";
        yield next;
    };

    app.get('journals-list', '/journals', visit_recorder, current_module, journalsController.index);

    app.get('journals-new', '/journals/new', visit_recorder, current_module, authentication, journalsController.init);

    app.get('journals-detail', '/journals/:journal_id', visit_recorder, current_module, journalsController.show);

    app.get('journals-edit', '/journals/:journal_id/edit', visit_recorder, current_module, authentication, journalsController.edit);

    app.post('journals-create', '/journals', visit_recorder, current_module, authentication, journalsController.create);

    app.put('journals-update', '/journals/:journal_id', visit_recorder, current_module, authentication, journalsController.update);

    app.del('journals-destroy', '/journals/:journal_id', visit_recorder, current_module, authentication, journalsController.destroy);

    commentRouter(app);

    likesRouter(app);

};