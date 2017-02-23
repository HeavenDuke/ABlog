"use strict";
/**
 * Created by heavenduke on 16-7-12.
 */

let sms_controller = require('../../../controller').guests.sms;

let visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('guests-sms-new', '/guests/sms/new', visit_recorder, sms_controller.init);

    app.post('guests-sms-create', '/guests/sms', visit_recorder, sms_controller.create);

    app.put('guests-sms-update', '/guests/sms', visit_recorder, sms_controller.update);


};