/**
 * Created by heavenduke on 16-7-5.
 */

let database = require('../model').loader;
let path = require('path');
let fs = require('fs');
let image_tools = require('../libs/image');

module.exports = function (callback) {

    let Diary = database.models.diary;
    let Photo = database.models.photo;
    let Guest = database.models.guest;
    let image_path = path.join(__dirname, "../public", "uploads");
    let image_ids = [];
    Photo.find({}, function (err, photos) {
        if (err) callback(err);
        photos.forEach(function (photo) {
            image_ids.push(photo.path);
            image_ids.push(image_tools.get_thumb_path(photo.path));
            image_ids.push(image_tools.get_preview_path(photo.path));
        });
        Diary.find({}, function(err, diaries) {
            if (err) callback(err);
            diaries.forEach(function (diary) {
                for(let i = 0; i < diary.images.length; i++) {
                    image_ids.push(diary.images[i]);
                    image_ids.push(image_tools.get_thumb_path(diary.images[i]));
                }
            });
            Guest.find({}, function (err, guests) {
                if(err) callback(err);
                guests.forEach(function (guest) {
                    if (guest.head) {
                        image_ids.push(guest.head);
                    }
                });
                fs.readdir(image_path, function (err, files) {
                    let delete_set = {};
                    for(let i = 0; i < files.length; i++) {
                        delete_set[files[i]] = true;
                    }
                    for(let i = 0; i < image_ids.length; i++) {
                        delete delete_set[image_ids[i]];
                    }
                    let total_number = Object.keys(delete_set).length;
                    let counter = 0;
                    for(let key in delete_set) {
                        if (!fs.existsSync(path.join(image_path, key))) {
                            fs.unlink(path.join(image_path, key), function () {
                                counter++;
                                if (counter >= total_number) {
                                    callback();
                                }
                            });
                        }
                    }
                });
            });
        });
    });
};