/**
 * Created by heavenduke on 16-7-12.
 */

var passwords_controller = require('../../../controller').guests.passwords;

var guest_authentication = require('../../../middlewares/guest_authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('guest-password-reset-page', '/guests/passwords/new', visit_recorder, passwords_controller.init);

    app.post('guest-password-reset', '/guests/passwords', visit_recorder, passwords_controller.create);

    app.get('guest-password-edit', '/guests/passwords/edit', visit_recorder, guest_authentication, passwords_controller.edit);

    app.put('guest-password-update', '/guests/passwords', visit_recorder, guest_authentication, passwords_controller.update);
    
};