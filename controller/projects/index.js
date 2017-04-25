"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

exports.index = async (ctx, next) => {
    let Project = global.database.models.project;
    let projects = await Project.find({}).sort({"closed_at": -1});
    ctx.render('./projects/index', {
        "title": "项目列表",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        projects: projects,
        redirect_url: ctx.request.url
    }, true);
};

exports.show = async (ctx, next) => {
    let Project = global.database.models.project;
    let project = await Project.findById(ctx.params.project_id);
    ctx.render('./projects/show', {
        "title": project.name,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        project: project,
        redirect_url: ctx.request.url
    }, true);
};

exports.init = async (ctx, next) => {
    ctx.render('./projects/new', {
        "title": "新增项目",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        redirect_url: ctx.request.url
    }, true);
};

exports.create = async (ctx, next) => {
    let Project = global.database.models.project;
    let project = new Project();
    project.name = ctx.request.body.name;
    project.introduction = ctx.request.body.introduction;
    project.started_at = new Date(ctx.request.body.started_at);
    project.closed_at = ctx.request.body.closed_at ? new Date(ctx.request.body.closed_at) : null;
    project.save();
    ctx.redirect(ctx.app.url("projects-index"));
};

exports.edit = async (ctx, next) => {
    let Project = global.database.models.project;
    let project = await Project.findById(ctx.params.project_id);
    ctx.render('./projects/edit', {
        "title": "编辑项目信息",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        project: project,
        redirect_url: ctx.request.url
    }, true);
};

exports.update = async (ctx, next) => {
    let Project = global.database.models.project;
    let project = await Project.findById(ctx.params.project_id);
    project.name = ctx.request.body.name;
    project.introduction = ctx.request.body.introduction;
    project.started_at = new Date(ctx.request.body.started_at);
    project.closed_at = ctx.request.body.closed_at ? new Date(ctx.request.body.closed_at) : null;
    project.save();
    ctx.redirect(ctx.app.url("projects-index"));
};

exports.destroy = async (ctx, next) => {
    let Project = global.database.models.project;
    let project = await Project.findById(ctx.params.project_id);
    project.remove();
    ctx.redirect(ctx.app.url("projects-index"));
};