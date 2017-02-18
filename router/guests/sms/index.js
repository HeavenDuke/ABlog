/**
 * Created by heavenduke on 16-7-12.
 */

let smss_controller = require('../../../controller').guests.sms;

let visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('guest-sms-init', '/guests/sms/new', visit_recorder, smss_controller.init);

    app.post('guest-sms-create', '/guests/sms', visit_recorder, smss_controller.create);

    app.put('guest-sms-validate', '/guests/sms', visit_recorder, smss_controller.update);


};