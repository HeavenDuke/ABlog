"use strict";
/**
 * Created by heavenduke on 16-7-7.
 */

let writings_controller = require('../../controller').writings;
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');
let visit_recorder = require('../../middlewares/visit_recorder');
let module_naming = require('../../middlewares/module_naming');
let Router = require('koa-router');
let router = new Router({
    prefix: "/writings"
});

router.use(module_naming("writing"));

router.get('writings-index', '/', visit_recorder, set_redirection, authentication.admin_only, writings_controller.index);

router.get('writings-show', '/:date', visit_recorder, authentication.admin_only, writings_controller.show);

router.put('writings-update', '/', visit_recorder, authentication.admin_only, writings_controller.update);

module.exports = router;