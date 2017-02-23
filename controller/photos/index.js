/**
 * Created by heavenduke on 16-8-13.
 */
"use strict";

let path = require('path');
let Jimp = require('jimp');
let fs = Promise.promisifyAll(require("fs"));
let image_tools = require('../../libs/image');

exports.index = function *(next) {
    let Photo = global.database.models.photo;
    let offset = this.request.query.offset ? parseInt(this.request.query.offset) : 0;
    let render_page = this.request.query.render != 'false';
    let photos = yield Photo.find({}).sort({created_at: -1}).skip(offset).limit(global.conf.pagination.photo);
    let render_loader = (yield Photo.count({})) > offset + global.conf.pagination.photo;
    if (render_page) {
        this.render('./photos/index', {
            title: "照片故事",
            current_guest: this.session.guest,
            current_user: this.session.user,
            photos: photos,
            Photo: Photo,
            render_loader: render_loader,
            current_module: this.current_module,
            redirect_url: this.request.url,
        });
    }
    else {
        let result_html = "";
        for (let i = 0; i < photos.length; i++) {
            result_html += photos[i].get_image_container();
        }
        if (render_loader) {
            result_html += "<a id='scroller' class='btn btn-block btn-flat' href='/photos?render=false&offset=" + global.conf.pagination.photo + "'>加载更多</a>";
        }
        else {
            result_html += "<div id='end_marker' class='btn btn-block btn-flat'>到末尾啦</div>";
        }
        this.body = result_html;
    }
};

exports.create = function *(next) {
    let image = this.request.body.files.photo;
    let image_path = path.basename(image.path);
    let allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
    if (allowed_mimes.indexOf(image.type) != -1) {
        let data = yield Jimp.read(image.path);
        let thumb_height = 400;
        let thumb_scale = data.bitmap.height / thumb_height;
        let thumb_width = data.bitmap.width / thumb_scale;
        let raw_width = 960;
        let raw_scale = data.bitmap.width / raw_width;
        let raw_height = data.bitmap.height / raw_scale;
        let preview_size = 800;
        let preview_scale = preview_size / Math.min(data.bitmap.width, data.bitmap.height);
        let preview_width = data.bitmap.width * preview_scale, preview_height = data.bitmap.height * preview_scale;
        data.resize(raw_width, raw_height).write(image.path);
        data.resize(thumb_width, thumb_height).write(image_tools.get_thumb_path(image.path));
        data.resize(preview_width, preview_height).crop((preview_width - preview_size) / 2, (preview_height - preview_size) / 2, preview_size, preview_size).write(image_tools.get_preview_path(image.path));
    }
    else {
        yield fs.unlinkAsync(image.path);
    }
    let Photo = global.database.models.photo;
    let photo = new Photo();
    photo.title = this.request.body.fields.title;
    photo.introduction = this.request.body.fields.introduction;
    photo.location = this.request.body.fields.location;
    photo.created_at = new Date(this.request.body.fields.created_at);
    photo.path = image_path;
    photo.save();
    this.redirect(this.app.url("photos-index"));
};

exports.destroy = function *(next) {
    let Photo = global.database.models.photo;
    let photo = yield Photo.findById(this.params.photo_id);
    let static_photo = photo.path;
    yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", static_photo));
    yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", image_tools.get_thumb_path(static_photo)));
    yield fs.unlinkAsync(path.join(global.conf.staticDir, "uploads", image_tools.get_preview_path(static_photo)));
    photo.remove();
    this.redirect(this.app.url('photos-index'));
};