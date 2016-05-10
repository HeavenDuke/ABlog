/**
 * Created by Obscurity on 2016/3/20.
 */

var journalsController = require('../../controller').journal;
var commentRouter = require('./comments');
var likesRouter = require('./likes');
var authentication = require('../../middlewares/authentication');

module.exports = function(app) {

    app.get('journals-list', '/journals', journalsController.index);

    app.get('journals-new', '/journals/new', authentication, journalsController.init);

    app.get('journals-detail', '/journals/:journal_id', journalsController.show);

    app.get('journals-edit', '/journals/:journal_id/edit', authentication, journalsController.edit);

    app.post('journals-create', '/journals', authentication, journalsController.create);

    app.put('journals-update', '/journals/:journal_id', authentication, journalsController.update);

    app.del('journals-destroy', '/journals/:journal_id', authentication, journalsController.destroy);

    commentRouter(app);

    likesRouter(app);

};