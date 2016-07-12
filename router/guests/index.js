/**
 * Created by heavenduke on 16-7-12.
 */

var guests_controller = require('../../controller').guests;

var guest_authentication = require('../../middlewares/guest_authentication');
var visit_recorder = require('../../middlewares/visit_recorder');

var password_router = require('./passwords');
var session_router = require('./sessions');
var sms_router = require('./sms');

module.exports = function (app) {

    app.get('guest-init', '/guests/new', visit_recorder, guest_authentication, guests_controller.init);

    app.post('guest-create', '/guests', visit_recorder, guest_authentication, guests_controller.create);

    app.get('guest-edit', '/guests/edit', visit_recorder, guest_authentication, guests_controller.edit);

    app.put('guest-update', '/guests', visit_recorder, guest_authentication, guests_controller.update);

    password_router(app);
    session_router(app);
    sms_router(app);

};