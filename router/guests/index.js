/**
 * Created by heavenduke on 16-7-12.
 */

var guests_controller = require('../../controller').guests;

var authentication = require('../../middlewares/authentication');
var visit_recorder = require('../../middlewares/visit_recorder');

var password_router = require('./passwords');
var session_router = require('./sessions');
var sms_router = require('./sms');

module.exports = function (app) {

    app.get('guests-init', '/guests/new', visit_recorder, authentication.auth_none, guests_controller.init);

    app.post('guests-create', '/guests', visit_recorder, authentication.auth_none, guests_controller.create);

    app.get('guests-edit', '/guests/edit', visit_recorder, authentication.guest_only, guests_controller.edit);

    app.put('guests-update', '/guests', visit_recorder, authentication.guest_only, guests_controller.update);

    password_router(app);
    session_router(app);
    sms_router(app);

};