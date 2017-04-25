/**
 * Created by heavenduke on 16-6-29.
 */
"use strict";

let path = require('path');
let Jimp = require('jimp');
let fs = Promise.promisifyAll(require("fs"));
let image_tools = require('../../libs/image');


exports.create = async (ctx, next) => {
    let image_paths = [];
    let files = ctx.request.body.files;
    if (!(files.images instanceof Array)) {
        files.images = [files.images];
    }
    for (let i = 0; i < files.images.length; i++) {
        let image = files.images[i];
        let image_path = path.basename(image.path);
        let allowed_mimes = ["image/jpeg", "image/bmp", "image/gif", "image/png"];
        if (allowed_mimes.indexOf(image.type) != -1) {
            let data = await Jimp.read(image.path);
            let thumb_height = 150;
            let thumb_scale = data.bitmap.height / thumb_height;
            let thumb_width = data.bitmap.width / thumb_scale;
            let raw_height = 960;
            let raw_scale = data.bitmap.height / raw_height;
            let raw_width = data.bitmap.width / raw_scale;
            data.resize(raw_width, raw_height).write(image.path);
            data.resize(thumb_width, thumb_height).write(image_tools.get_thumb_path(image.path));
            image_paths.push({
                name: image_path,
                size: image.size,
                url: image_path,
                thumbnailUrl: image_tools.get_thumb_path(image_path)
            });
        }
        else {
            await fs.unlinkAsync(image.path);
        }
    }
    ctx.body = {files: image_paths};
};