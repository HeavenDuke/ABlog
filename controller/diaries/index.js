/**
 * Created by Obscurity on 2016/5/11.
 */

var path = require('path');
var gm = require('gm').subClass({imageMagick: true});
Promise.promisifyAll(gm.prototype);
var fs = Promise.promisifyAll(require("fs"));

function get_thumb_path(image_path) {
    var dirname = path.dirname(image_path);
    var extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}

exports.index = function *() {
    var Diary = global.database.models.diary;
    var diaries = yield Diary.find({}).sort({recorded_date: -1, recorded_at: -1});
    if (!this.request.query.remote) {
        this.render('diaries/index', {title: "每日小记", current_user: this.session.user, diaries: diaries, Diary: Diary, current_module: this.current_module, mood_list: Diary.mood_list(), tag_list: Diary.tag_list(), redirect_url: this.request.url});
    }
    else {
        this.body = {diaries: diaries};
    }
};

exports.create = function *(next) {
    var Diary = global.database.models.diary;
    var diary = new Diary();
    var fields = this.request.body;
    diary.brief = fields.brief;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.content = fields.content;
    diary.is_public = !!fields.is_public;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.images = fields.image_ids.split(",");
    diary.save();
    this.redirect('/diaries');
};

exports.update = function *(next) {
    var Diary = global.database.models.diary;
    var diary = yield Diary.findById(this.params.diary_id);
    var previous_paths = diary.images;
    var fields = this.request.body;
    diary.brief = fields.brief;
    diary.content = fields.content;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.is_public = !!fields.is_public;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.save();
    this.redirect('/diaries');
};

exports.destroy = function *() {
    var Diary = global.database.models.diary;
    var diary = yield Diary.findById(this.params.diary_id);
    var static_paths = diary.images;
    for(var i = 0; i < static_paths.length; i++) {
        var image_path = static_paths[i];
        yield fs.unlinkAsync(path.join(global.conf.staticDir,  "uploads", image_path));
        yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", get_thumb_path(image_path)));
    }
    diary.remove();
    this.redirect('/diaries');
};