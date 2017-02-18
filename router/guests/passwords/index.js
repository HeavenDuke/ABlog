/**
 * Created by heavenduke on 16-7-12.
 */

let passwords_controller = require('../../../controller').guests.passwords;

let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('guests-passwords-new', '/guests/passwords/new', visit_recorder, authentication.auth_confirmation_token, passwords_controller.init);

    app.post('guests-passwords-create', '/guests/passwords', visit_recorder, passwords_controller.create);

    app.get('guests-passwords-edit', '/guests/passwords/edit', visit_recorder, authentication.guest_only, passwords_controller.edit);

    app.put('guests-passwords-update', '/guests/passwords', visit_recorder, authentication.guest_only, passwords_controller.update);
    
};