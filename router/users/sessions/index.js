"use strict";
/**
 * Created by Obscurity on 2016/7/12.
 */

let sessions_controller = require('../../../controller').users.sessions;
let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function(app) {

    app.get('users-sessions-new', '/users/sessions/new', visit_recorder, authentication.auth_none, sessions_controller.init);

    app.post('users-sessions-create', '/users/sessions', visit_recorder, authentication.auth_none, sessions_controller.create);

    app.del('users-sessions-destroy', '/users/sessions', visit_recorder, authentication.admin_only, sessions_controller.destroy);

};