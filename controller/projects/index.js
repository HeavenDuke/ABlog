"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

exports.index = function *(next) {
    let Project = global.database.models.project;
    let projects = yield Project.find({}).sort({"closed_at": -1});
    this.render('./projects/index', {
        "title": "项目列表",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        projects: projects,
        redirect_url: this.request.url
    }, true);
};

exports.show = function *(next) {
    let Project = global.database.models.project;
    let project = yield Project.findById(this.params.project_id);
    this.render('./projects/show', {
        "title": project.name,
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        project: project,
        redirect_url: this.request.url
    }, true);
};

exports.init = function *(next) {
    this.render('./projects/new', {
        "title": "新增项目",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        redirect_url: this.request.url
    }, true);
};

exports.create = function *(next) {
    let Project = global.database.models.project;
    let project = new Project();
    project.name = this.request.body.name;
    project.introduction = this.request.body.introduction;
    project.started_at = new Date(this.request.body.started_at);
    project.closed_at = this.request.body.closed_at ? new Date(this.request.body.closed_at) : null;
    project.save();
    this.redirect(this.app.url("projects-index"));
};

exports.edit = function *(next) {
    let Project = global.database.models.project;
    let project = yield Project.findById(this.params.project_id);
    this.render('./projects/edit', {
        "title": "编辑项目信息",
        current_guest: this.session.guest,
        current_user: this.session.user,
        current_module: this.current_module,
        project: project,
        redirect_url: this.request.url
    }, true);
};

exports.update = function *(next) {
    let Project = global.database.models.project;
    let project = yield Project.findById(this.params.project_id);
    project.name = this.request.body.name;
    project.introduction = this.request.body.introduction;
    project.started_at = new Date(this.request.body.started_at);
    project.closed_at = this.request.body.closed_at ? new Date(this.request.body.closed_at) : null;
    project.save();
    this.redirect(this.app.url("projects-index"));
};

exports.destroy = function *(next) {
    let Project = global.database.models.project;
    let project = yield Project.findById(this.params.project_id);
    project.remove();
    this.redirect(this.app.url("projects-index"));
};