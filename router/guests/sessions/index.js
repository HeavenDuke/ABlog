/**
 * Created by heavenduke on 16-7-12.
 */

var sessions_controller = require('../../../controller').guests.sessions;

var authentication = require('../../../middlewares/authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('guest-session-init', '/guests/sessions/new', visit_recorder, authentication.auth_none, sessions_controller.init);

    app.post('guest-session-create', '/guests/sessions', visit_recorder, authentication.auth_none, sessions_controller.create);

    app.delete('guest-session-destroy', '/guests/sessions', visit_recorder, authentication.guest_only, sessions_controller.destroy);

};