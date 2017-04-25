"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

let links_controller = require('../../controller').links;
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');
let visit_recorder = require('../../middlewares/visit_recorder');
let Router = require('koa-router');
let router = new Router({
    prefix: "/links"
});

router.post('links-create', '/', visit_recorder, authentication.admin_only, links_controller.create);

router.del('links-destroy', '/:link_id', visit_recorder, authentication.admin_only, links_controller.destroy);

module.exports = router;