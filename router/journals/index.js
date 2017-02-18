"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

let journals_controller = require('../../controller').journals;
let comment_router = require('./comments');
let likes_router = require('./likes');
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');
let visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    let current_module = function *(next) {
        this.current_module = "journal";
        yield next;
    };

    app.get('journals-index', '/journals', visit_recorder, set_redirection, current_module, journals_controller.index);

    app.get('journals-new', '/journals/new', visit_recorder, set_redirection, current_module, authentication.admin_only, journals_controller.init);

    app.get('journals-show', '/journals/:journal_id', visit_recorder, set_redirection, current_module, journals_controller.show);

    app.get('journals-edit', '/journals/:journal_id/edit', visit_recorder, set_redirection, current_module, authentication.admin_only, journals_controller.edit);

    app.post('journals-create', '/journals', visit_recorder, current_module, authentication.admin_only, journals_controller.create);

    app.put('journals-update', '/journals/:journal_id', visit_recorder, current_module, authentication.admin_only, journals_controller.update);

    app.del('journals-destroy', '/journals/:journal_id', visit_recorder, current_module, authentication.admin_only, journals_controller.destroy);

    comment_router(app);

    likes_router(app);

};