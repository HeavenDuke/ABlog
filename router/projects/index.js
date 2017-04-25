"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

let projects_controller = require('../../controller').projects;
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');
let visit_recorder = require('../../middlewares/visit_recorder');
let module_naming = require('../../middlewares/module_naming');

let Router = require('koa-router');
let router = new Router({
    prefix: "/projects"
});

router.use(module_naming("project"));

router.get("projects-index", '/', visit_recorder, set_redirection, projects_controller.index);

router.get("projects-new", '/new', visit_recorder, set_redirection, authentication.admin_only, projects_controller.init);

router.get("projects-show", '/:project_id', visit_recorder, set_redirection, projects_controller.show);

router.get("projects-edit", '/:project_id/edit', visit_recorder, set_redirection, authentication.admin_only, projects_controller.edit);

router.post("projects-create", '/', visit_recorder, authentication.admin_only, projects_controller.create);

router.put("projects-update", '/:project_id', visit_recorder, authentication.admin_only, projects_controller.update);

router.del("projects-destroy", '/:project_id', visit_recorder, authentication.admin_only, projects_controller.destroy);

module.exports = router;