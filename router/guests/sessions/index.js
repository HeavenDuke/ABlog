"use strict";
/**
 * Created by heavenduke on 16-7-12.
 */

let sessions_controller = require('../../../controller').guests.sessions;

let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('guests-sessions-new', '/guests/sessions/new', visit_recorder, authentication.auth_none, sessions_controller.init);

    app.post('guests-sessions-create', '/guests/sessions', visit_recorder, authentication.auth_none, sessions_controller.create);

    app.delete('guests-sessions-destroy', '/guests/sessions', visit_recorder, authentication.guest_only, sessions_controller.destroy);

};