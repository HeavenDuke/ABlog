/**
 * Created by Obscurity on 2016/3/20.
 */

var projects_controller = require('../../controller').projects;
var authentication = require('../../middlewares/authentication');
var set_redirection = require('../../middlewares/set_redirection');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "project";
        yield next;
    };

    app.get("projects-list", '/projects', visit_recorder, set_redirection, current_module, projects_controller.index);

    app.get("projects-new", '/projects/new', visit_recorder, set_redirection, authentication.admin_only, current_module, projects_controller.init);

    app.get("projects-detail", '/projects/:project_id', visit_recorder, set_redirection, current_module, projects_controller.show);

    app.get("projects-edit", '/projects/:project_id/edit', visit_recorder, set_redirection, authentication.admin_only, current_module, projects_controller.edit);

    app.post("projects-create", '/projects', visit_recorder, authentication.admin_only, current_module, projects_controller.create);

    app.put("projects-update", '/projects/:project_id', visit_recorder, authentication.admin_only, current_module, projects_controller.update);

    app.del("projects-destroy", '/projects/:project_id', visit_recorder, authentication.admin_only, current_module, projects_controller.destroy);

};