"use strict";
/**
 * Created by Obscurity on 2016/5/28.
 */

exports.index = async (ctx, next) => {
    let Column = global.database.models.column;
    let columns = await Column.find({}).sort({updated_at: -1});
    ctx.render("./columns/index", {
        title: "专栏目录",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        columns: columns,
        redirect_url: ctx.request.url
    });
};

exports.show = async (ctx, next) => {
    let Column = global.database.models.column;
    let Article = global.database.models.article;
    let column = await Column.findById(ctx.params.column_id);
    let columns = await Column.find({}).sort({updated_at: -1});
    let articles = await Article.find({column_id: ctx.params.column_id}).sort({order: 1});
    ctx.render("./columns/show", {
        title: column.name,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        keywords: column.keywords().join(','),
        description: column.keywords().join(','),
        columns: columns,
        column: column,
        articles: articles,
        redirect_url: ctx.request.url
    });
};

exports.init = async (ctx, next) => {
    ctx.render("./columns/new", {
        title: "添加专栏",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        redirect_url: ctx.request.url
    });
};

exports.create = async (ctx, next) => {
    let Column = global.database.models.column;
    let _tags = JSON.parse(ctx.request.body.tags);
    let tags = [];
    _tags.forEach(function (tag) {
        tags.push({name: tag});
    });
    let column = await Column.create({
        name: ctx.request.body.name,
        introduction: ctx.request.body.introduction,
        tags: tags
    });
    ctx.redirect("/columns/" + column._id);
};

exports.edit = async (ctx, next) => {
    let Column = global.database.models.column;
    let column = await Column.findById(ctx.params.column_id);
    ctx.render("./columns/edit", {
        title: "编辑专栏信息",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        column: column,
        redirect_url: ctx.request.url
    });
};

exports.update = async (ctx, next) => {
    let Column = global.database.models.column;
    let column = await Column.findById(ctx.params.column_id);
    let tags = JSON.parse(ctx.request.body.tags);
    column.name = ctx.request.body.name;
    column.introduction = ctx.request.body.introduction;
    column.updated_at = Date.now();
    column.tags = [];
    tags.forEach(function (tag) {
        column.tags.push({name: tag});
    });
    await column.save();

    ctx.redirect("/columns/" + column._id);
};

exports.destroy = async (ctx, next) => {
    let Column = global.database.models.column;
    let Article = global.database.models.article;
    await Column.findByIdAndRemove(ctx.params.column_id);
    await Article.remove({column_id: ctx.params.column_id});
    ctx.redirect("/columns");
};

exports.articles = require('./articles');