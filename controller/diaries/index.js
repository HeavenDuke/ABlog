/**
 * Created by Obscurity on 2016/5/11.
 */

var path = require('path');
var fs = require("fs");
var gm = require('gm').subClass({imageMagick: true});

function get_thumb_path(image_path) {
    var dirname = path.dirname(image_path);
    var extname = path.extname(image_path);
    return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
}

exports.index = function *() {
    var Diary = global.database.models.diary;
    var diaries = yield Diary.find({}).sort({recorded_date: -1});
    if (!this.request.query.remote) {
        this.render('diaries/index', {title: "每日小记", current_user: this.session.user, diaries: diaries, Diary: Diary, current_module: this.current_module, mood_list: Diary.mood_list(), tag_list: Diary.tag_list()});
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
            gm(image.path).size(function (err, size) {
                if (err) {
                    console.log(err);
                }
                else {
                    var thumb_height = 150;
                    var scale = size.height / thumb_height;
                    var thumb_width = size.width / scale;
                    gm(image.path).resize(thumb_width, thumb_height).write(get_thumb_path(image.path), function(err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("success");
                        }
                    });
                }
            });
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
            gm(image.path).size(function (err, size) {
                if (err) {
                    console.log(err);
                }
                else {
                    var thumb_height = 150;
                    var scale = size.height / thumb_height;
                    var thumb_width = size.width / scale;
                    gm(image.path).resize(thumb_width, thumb_height).write(get_thumb_path(image.path), function(err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("success");
                        }
                    });
                }
            });
            image_paths.push(image_path);
        }
        else {
            fs.unlink(image.path, null);
        }
        return image;
    });
    if (!(files.images.length == 1 && files.images[0].type == "application/octet-stream")) {
        previous_paths.map(function (image_path) {
            fs.unlink(path.join(global.conf.staticDir, "uploads", image_path), null);
            fs.unlink(path.join(global.conf.staticDir, "uploads", get_thumb_path(image_path)), null);
        });
        diary.images = image_paths;
    }
    diary.brief = fields.brief;
    diary.content = fields.content;
    diary.mood = fields.mood;
    diary.tag = fields.tag;
    diary.recorded_date = new Date(fields.recorded_date);
    diary.save();
    this.redirect('/diaries');
};

exports.destroy = function *() {
    var Diary = global.database.models.diary;
    var diary = yield Diary.findById(this.params.diary_id);
    var static_paths = diary.images;
    static_paths.map(function (image_path) {
        fs.unlink(path.join(global.conf.staticDir,  "uploads", image_path), null);
        fs.unlink(path.join(global.conf.staticDir, "uploads", get_thumb_path(image_path)), null);
    });
    diary.remove();
    this.redirect('/diaries');
};