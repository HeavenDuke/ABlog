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
    let diaries = yield Diary.find({}).sort({recorded_date: -1, recorded_at: -1});
    if (!this.request.query.remote) {
        this.render('diaries/index', {title: "每日小记", current_guest: this.session.guest, current_user: this.session.user, diaries: diaries, Diary: Diary, current_module: this.current_module, mood_list: Diary.mood_list(), tag_list: Diary.tag_list(), redirect_url: this.request.url});
    }
    else {
        this.body = {diaries: diaries};
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
    this.redirect('/diaries');
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
    this.redirect('/diaries');
};

exports.destroy = function *() {
    let Diary = global.database.models.diary;
    let diary = yield Diary.findById(this.params.diary_id);
    let static_paths = diary.images;
    for(let i = 0; i < static_paths.length; i++) {
        let image_path = static_paths[i];
        yield fs.unlinkAsync(path.join(global.conf.staticDir,  "uploads", image_path));
        yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", get_thumb_path(image_path)));
    }
    diary.remove();
    this.redirect('/diaries');
};