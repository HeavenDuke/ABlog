/**
 * Created by Obscurity on 2016/3/20.
 */

var index = function *(next) {
    var Project = global.database.models.project;
    var projects = yield Project.find({}).sort({"closed_at": -1});
    this.render('./projects/index',{"title":"项目列表", current_user: this.session.user, current_module: this.current_module, projects: projects, redirect_url: this.request.url}, true);
};

var show = function *(next) {
    var Project = global.database.models.project;
    var project = yield Project.findById(this.params.project_id);
    this.render('./projects/show',{"title":project.name, current_user: this.session.user, current_module: this.current_module, project: project, redirect_url: this.request.url}, true);
};

var init = function *(next) {
    this.render('./projects/new',{"title":"新增项目", current_user: this.session.user, current_module: this.current_module, redirect_url: this.request.url}, true);
};

var create = function *(next) {
    var Project = global.database.models.project;
    var project = new Project();
    project.name = this.request.body.name;
    project.introduction = this.request.body.introduction;
    project.started_at = new Date(this.request.body.started_at);
    project.closed_at = this.request.body.closed_at ? new Date(this.request.body.closed_at) : null;
    project.save();
    this.redirect(this.app.url("projects-list"));
};

var edit = function *(next) {
    var Project = global.database.models.project;
    var project = yield Project.findById(this.params.project_id);
    this.render('./projects/edit',{"title":"编辑项目信息", current_user: this.session.user, current_module: this.current_module, project: project, redirect_url: this.request.url}, true);
};

var update = function *(next) {
    var Project = global.database.models.project;
    var project = yield Project.findById(this.params.project_id);
    project.name = this.request.body.name;
    project.introduction = this.request.body.introduction;
    project.started_at = new Date(this.request.body.started_at);
    project.closed_at = this.request.body.closed_at ? new Date(this.request.body.closed_at) : null;
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
    show: show,
    init: init,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy
};