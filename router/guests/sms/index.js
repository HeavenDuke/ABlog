/**
 * Created by heavenduke on 16-7-12.
 */

var smss_controller = require('../../../controller').guests.sms;

var visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('guest-sms-init', '/guests/sms/new', visit_recorder, smss_controller.init);

    app.post('guest-sms-create', '/guests/sms/create', visit_recorder, smss_controller.create);


};