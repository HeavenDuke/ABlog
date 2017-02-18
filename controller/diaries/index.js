/**
 * Created by Obscurity on 2016/5/11.
 */

let path = require('path');
let gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);
let fs = Promise.promisifyAll(require("fs"));

function get_thumb_path(image_path) {
    let dirname = path.dirname(image_path);
    let extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}

exports.index = function *() {
    let Diary = global.database.models.diary;
    let offset = this.request.query.offset ? parseInt(this.request.query.offset) : 0;
    let render_page = this.request.query.render != 'false';
    let diaries = yield Diary.find({}).sort({
        recorded_date: -1,
        recorded_at: -1
    }).skip(offset).limit(global.conf.pagination.diary);
    let render_loader = (yield Diary.count({})) > offset + global.conf.pagination.diary;
    if (render_page) {
        this.render('diaries/index', {
            title: "每日小记",
            current_guest: this.session.guest,
            current_user: this.session.user,
            diaries: diaries,
            Diary: Diary,
            render_loader: render_loader,
            current_module: this.current_module,
            mood_list: Diary.mood_list(),
            tag_list: Diary.tag_list(),
            redirect_url: this.request.url
        });
    }
    else {
        let result = "";
        for (let i = 0; i < diaries.length; i++) {
            result += diaries[i].get_diary_container(!!this.session.user);
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
        this.body = result;
    }
};

exports.create = function *(next) {
    let Diary = global.database.models.diary;
    let diary = new Diary();
    let fields = this.request.body;
    diary.brief = fields.brief;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.content = fields.content;
    diary.is_public = !!fields.is_public;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.images = JSON.parse(fields.image_ids);
    diary.save();
    this.redirect(this.app.url("diaries-index"));
};

exports.update = function *(next) {
    let Diary = global.database.models.diary;
    let diary = yield Diary.findById(this.params.diary_id);
    let fields = this.request.body;
    diary.brief = fields.brief;
    diary.content = fields.content;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.is_public = !!fields.is_public;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.images = JSON.parse(fields.image_ids);
    diary.save();
    this.redirect(this.app.url("diaries-index"));
};

exports.destroy = function *() {
    let Diary = global.database.models.diary;
    let diary = yield Diary.findById(this.params.diary_id);
    let static_paths = diary.images;
    for (let i = 0; i < static_paths.length; i++) {
        let image_path = static_paths[i];
        yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", image_path));
        yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", get_thumb_path(image_path)));
    }
    diary.remove();
    this.redirect(this.app.url("diaries-index"));
};