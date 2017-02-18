/**
 * Created by heavenduke on 16-7-12.
 */

let guests_controller = require('../../controller').guests;

let authentication = require('../../middlewares/authentication');
let visit_recorder = require('../../middlewares/visit_recorder');

let password_router = require('./passwords');
let session_router = require('./sessions');
let sms_router = require('./sms');
let head_router = require('./heads');
let path = require('path');
let config = require('../../config/config')();

module.exports = function (app) {

    app.get('guests-init', '/guests/new', visit_recorder, authentication.auth_none, guests_controller.init);

    app.post('guests-create', '/guests', visit_recorder, authentication.auth_none, guests_controller.create);

    app.get('guests-edit', '/guests/edit', visit_recorder, authentication.guest_only, guests_controller.edit);

    app.put('guests-update', '/guests', visit_recorder, authentication.guest_only, guests_controller.update);

    password_router(app);
    session_router(app);
    sms_router(app);
    head_router(app);

};