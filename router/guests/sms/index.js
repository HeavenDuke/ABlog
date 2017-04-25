"use strict";
/**
 * Created by heavenduke on 16-7-12.
 */

let sms_controller = require('../../../controller').guests.sms;

let visit_recorder = require('../../../middlewares/visit_recorder');
let Router = require('koa-router');
let router = new Router({
    prefix: "/sms"
});

router.get('guests-sms-new', '/new', visit_recorder, sms_controller.init);

router.post('guests-sms-create', '/', visit_recorder, sms_controller.create);

router.put('guests-sms-update', '/', visit_recorder, sms_controller.update);

module.exports = router;