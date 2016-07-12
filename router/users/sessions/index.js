/**
 * Created by Obscurity on 2016/7/12.
 */

var sessions_controller = require('../../../controller').users.sessions;
var authentication = require('../../../middlewares/authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function(app) {

    app.get('users-sessions-new', '/users/sessions/new', visit_recorder, sessions_controller.init);

    app.post('users-sessions-create', '/users/sessions', visit_recorder, sessions_controller.create);

    app.del('users-sessions-destroy', '/users/sessions', visit_recorder, authentication, sessions_controller.destroy);

};