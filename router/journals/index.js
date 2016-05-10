/**
 * Created by Obscurity on 2016/3/20.
 */

var journalsController = require('../../controller').journal;
var commentRouter = require('./comments');
var likesRouter = require('./likes');
var authentication = require('../../middlewares/authentication');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "journal";
        yield next;
    }

    app.get('journals-list', '/journals', current_module, journalsController.index);

    app.get('journals-new', '/journals/new', current_module, authentication, journalsController.init);

    app.get('journals-detail', '/journals/:journal_id', current_module, journalsController.show);

    app.get('journals-edit', '/journals/:journal_id/edit', current_module, authentication, journalsController.edit);

    app.post('journals-create', '/journals', current_module, authentication, journalsController.create);

    app.put('journals-update', '/journals/:journal_id', current_module, authentication, journalsController.update);

    app.del('journals-destroy', '/journals/:journal_id', current_module, authentication, journalsController.destroy);

    commentRouter(app);

    likesRouter(app);

};