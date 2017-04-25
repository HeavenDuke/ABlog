"use strict";
/**
 * Created by heavenduke on 16-7-12.
 */

let passwords_controller = require('../../../controller').guests.passwords;

let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');
let Router = require('koa-router');
let router = new Router({
    prefix: "/passwords"
});

router.get('guests-passwords-new', '/new', visit_recorder, authentication.auth_confirmation_token, passwords_controller.init);

router.post('guests-passwords-create', '/', visit_recorder, passwords_controller.create);

router.get('guests-passwords-edit', '/edit', visit_recorder, authentication.guest_only, passwords_controller.edit);

router.put('guests-passwords-update', '/', visit_recorder, authentication.guest_only, passwords_controller.update);

module.exports = router;