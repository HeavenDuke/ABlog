/**
 * Created by Obscurity on 2016/3/20.
 */

var journalsController = require('../../controller').journal;

module.exports = function(app) {

    app.get('journals-list', '/journals', journalsController.index);

    app.get('journals-new', '/journals/new', journalsController.init);

    app.get('journals-detail', '/journals/:journal_id', journalsController.show);

    app.get('journals-edit', '/journals/:journal_id/edit', journalsController.edit);

    app.post('journals-create', '/journals', journalsController.create);

    app.put('journals-update', '/journals/:journal_id', journalsController.update);

    app.del('journals-destroy', '/journals/:journal_id', journalsController.destroy);

};