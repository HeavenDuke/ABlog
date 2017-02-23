"use strict";
/**
 * Created by Obscurity on 2017/2/17.
 */

let profiles_controller = require('../../controller').profiles;
let visit_recorder = require('../../middlewares/visit_recorder');
let set_redirection = require('../../middlewares/set_redirection');
let authentication = require('../../middlewares/authentication').admin_only;

module.exports = function (app) {

    app.get('profiles-show', "/profile", visit_recorder, set_redirection, profiles_controller.show);

    app.get('profiles-edit', "/profile/edit", visit_recorder, set_redirection, authentication, profiles_controller.edit);

    app.put('profiles-update', "/profile", visit_recorder, authentication, profiles_controller.update);

};