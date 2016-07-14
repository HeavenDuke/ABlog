/**
 * Created by Obscurity on 2016/3/20.
 */

var journals_controller = require('../../controller').journals;
var comment_router = require('./comments');
var likes_router = require('./likes');
var authentication = require('../../middlewares/authentication');
var set_redirection = require('../../middlewares/set_redirection');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "journal";
        yield next;
    };

    app.get('journals-list', '/journals', visit_recorder, set_redirection, current_module, journals_controller.index);

    app.get('journals-new', '/journals/new', visit_recorder, set_redirection, current_module, authentication.admin_only, journals_controller.init);

    app.get('journals-detail', '/journals/:journal_id', visit_recorder, set_redirection, current_module, journals_controller.show);

    app.get('journals-edit', '/journals/:journal_id/edit', visit_recorder, set_redirection, current_module, authentication.admin_only, journals_controller.edit);

    app.post('journals-create', '/journals', visit_recorder, current_module, authentication.admin_only, journals_controller.create);

    app.put('journals-update', '/journals/:journal_id', visit_recorder, current_module, authentication.admin_only, journals_controller.update);

    app.del('journals-destroy', '/journals/:journal_id', visit_recorder, current_module, authentication.admin_only, journals_controller.destroy);

    comment_router(app);

    likes_router(app);

};