/**
 * Created by Obscurity on 2016/3/20.
 */

var index = function *(next) {
    var Project = global.database.models.project;
    var projects = yield Project.find({});
    this.render('./projects/index',{"title":"项目列表", current_user: this.session.user, current_module: this.current_module, projects: projects}, true);
};

var init = function *(next) {
    this.render('./projects/new',{"title":"新增项目", current_user: this.session.user, current_module: this.current_module}, true);
};

var create = function *(next) {
    var Project = global.database.models.project;
    var project = new Project();
    project.name = this.request.body.name;
    project.content = this.request.body.content;
    project.save();
    this.redirect(this.app.url("projects-list"));
};

var edit = function *(next) {
    var Project = global.database.models.project;
    var project = yield Project.findById(this.params.project_id);
    this.render('./projects/edit',{"title":"编辑项目信息", current_user: this.session.user, current_module: this.current_module, project: project}, true);
};

var update = function *(next) {
    var Project = global.database.models.project;
    var project = yield Project.findById(this.params.project_id);
    project.name = this.request.body.name;
    project.content = this.request.body.content;
    project.save();
    this.redirect(this.app.url("projects-list"));
};

var destroy = function *(next) {
    var Project = global.database.models.project;
    var project = yield Project.findById(this.params.project_id);
    project.remove();
    this.redirect(this.app.url("projects-list"));
};

module.exports = {
    index: index,
    init: init,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy
};