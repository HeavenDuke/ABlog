/**
 * Created by Obscurity on 2017/2/17.
 */

let profile_controller = require('../../controller').profiles;
let visit_recorder = require('../../middlewares/visit_recorder');
let set_redirection = require('../../middlewares/set_redirection');
let authentication = require('../../middlewares/authentication').admin_only;

module.exports = function (app) {

    app.get('profile-detail', "/profile", visit_recorder, set_redirection, profile_controller.show);

    app.get('profile-edit', "/profile/edit", visit_recorder, set_redirection, authentication, profile_controller.edit);

    app.put('profile-update', "/profile", visit_recorder, authentication, profile_controller.update);

};