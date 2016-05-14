/**
 * Created by Obscurity on 2016/5/11.
 */

var path = require('path');
var fs = require("fs");

exports.index = function *() {
    var Diary = global.database.models.diary;
    var diaries = yield Diary.find({}).sort({recorded_date: -1});
    if (!this.request.query.remote) {
        this.render('diaries/index', {title: "每日小记", current_user: this.session.user, diaries: diaries, current_module: this.current_module, mood_list: Diary.mood_list(), tag_list: Diary.tag_list()});
    }
    else {
        this.body = {diaries: diaries};
    }
};

exports.create = function *() {
    var Diary = global.database.models.diary;
    var image_paths = [];
    var diary = new Diary();
    var fields = this.request.body.fields;
    var files = this.request.body.files;
    if (!(files.images instanceof Array)) {
        files.images = [files.images];
    }
    files.images.map(function (image) {
        var image_path = path.basename(image.path);
        var allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
        if (allowed_mimes.indexOf(image.type) != -1) {
            image_paths.push(image_path);
        }
        else {
            fs.unlink(image.path, null);
        }
        return image;
    });
    diary.brief = fields.brief;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.content = fields.content;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.images = image_paths;
    diary.save();
    this.redirect('/diaries');
};

exports.update = function *() {
    var Diary = global.database.models.diary;
    var image_paths = [];
    var diary = yield Diary.findById(this.params.diary_id);
    var previous_paths = diary.images;
    var fields = this.request.body.fields;
    var files = this.request.body.files;
    if (!(files.images instanceof Array)) {
        files.images = [files.images];
    }
    files.images.map(function (image) {
        var image_path = path.basename(image.path);
        var allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
        if (allowed_mimes.indexOf(image.type) != -1) {
            image_paths.push(image_path);
        }
        else {
            fs.unlink(image.path, null);
        }
        return image;
    });
    previous_paths.map(function (image_path) {
        fs.unlink(path.join(global.conf.staticDir, "uploads", image_path), null);
    });
    diary.brief = fields.brief;
    diary.content = fields.content;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.images = image_paths;
    diary.save();
    this.redirect('/diaries');
};

exports.destroy = function *() {
    var Diary = global.database.models.diary;
    var diary = yield Diary.findById(this.params.diary_id);
    var static_paths = diary.images;
    static_paths.map(function (image_path) {
        fs.unlink(path.join(global.conf.staticDir,  "uploads", image_path), null);
    });
    diary.remove();
    this.redirect('/diaries');
};