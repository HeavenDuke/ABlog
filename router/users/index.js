/**
 * Created by Obscurity on 2016/3/20.
 */
let users_controller = require('../../controller').users;
let authentication = require('../../middlewares/authentication');
let visit_recorder = require('../../middlewares/visit_recorder');

let session_router = require('./sessions');

module.exports = function(app) {

    app.get('users-edit', '/users/edit', visit_recorder, authentication.admin_only, users_controller.edit);

    app.put('users-update', '/users', visit_recorder, authentication.admin_only, users_controller.update);

    session_router(app);
};