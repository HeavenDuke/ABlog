/**
 * Created by Obscurity on 2016/5/11.
 */
"use strict";

let path = require('path');
let fs = Promise.promisifyAll(require("fs"));

function get_thumb_path(image_path) {
    let dirname = path.dirname(image_path);
    let extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}

exports.index = async (ctx, next) => {
    let Diary = global.database.models.diary;
    let offset = ctx.request.query.offset ? parseInt(ctx.request.query.offset) : 0;
    let render_page = ctx.request.query.render != 'false';
    let diaries = await Diary.find({}).sort({
        recorded_date: -1,
        recorded_at: -1
    }).skip(offset).limit(global.conf.pagination.diary);
    let render_loader = (await Diary.count({})) > offset + global.conf.pagination.diary;
    if (render_page) {
        ctx.render('diaries/index', {
            title: "每日小记",
            current_guest: ctx.session.guest,
            current_user: ctx.session.user,
            diaries: diaries,
            Diary: Diary,
            render_loader: render_loader,
            current_module: ctx.current_module,
            mood_list: Diary.mood_list(),
            tag_list: Diary.tag_list(),
            redirect_url: ctx.request.url
        });
    }
    else {
        let result = "";
        for (let i = 0; i < diaries.length; i++) {
            result += diaries[i].get_diary_container(!!ctx.session.user);
        }
        if (render_loader) {
            result += "<a id='scroller' href='/diaries?render=false&offset=" + (offset + global.conf.pagination.diary) + "'></a>";
        }
        else {
            result += "<li id='end_marker'>";
            result += "<i class='fa fa-clock-o bg-gray'></i>";
            result += "<div class='timeline-item'>";
            result += "<div class='timeline-body'>过去，一切从这里开始</div>";
            result += "</div>";
            result += "</li>";
        }
        ctx.body = result;
    }
};

exports.create = async (ctx, next) => {
    let Diary = global.database.models.diary;
    let diary = new Diary();
    let fields = ctx.request.body;
    diary.brief = fields.brief;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.content = fields.content;
    diary.is_public = !!fields.is_public;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.images = JSON.parse(fields.image_ids);
    diary.save();
    ctx.redirect("/diaries");
};

exports.update = async (ctx, next) => {
    let Diary = global.database.models.diary;
    let diary = await Diary.findById(ctx.params.diary_id);
    let fields = ctx.request.body;
    diary.brief = fields.brief;
    diary.content = fields.content;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.is_public = !!fields.is_public;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.images = JSON.parse(fields.image_ids);
    diary.save();
    ctx.redirect("/diaries");
};

exports.destroy = async (ctx, next) => {
    let Diary = global.database.models.diary;
    let diary = await Diary.findById(ctx.params.diary_id);
    let static_paths = diary.images;
    for (let i = 0; i < static_paths.length; i++) {
        let image_path = static_paths[i];
        await fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", image_path));
        await fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", get_thumb_path(image_path)));
    }
    diary.remove();
    ctx.redirect("/diaries");
};