/**
 * Created by heavenduke on 16-7-5.
 */

var database = require('../model').loader;
var path = require('path');
var fs = require('fs');

module.exports = function (callback) {

    function get_thumb_path(image_path) {
        var dirname = path.dirname(image_path);
        var extname = path.extname(image_path);
        return path.join(dirname, path.basename(image_path, extname) + "_thumb" + extname);
    }


    var Diary = database.models.diary;
    var Guest = database.models.guest;
    var image_path = path.join(__dirname, "../public", "uploads");
    Diary.find({}, function(err, diaries) {
        if (err) callback(err);
        var image_ids = [];
        diaries.forEach(function (diary) {
            for(var i = 0; i < diary.images.length; i++) {
                image_ids.push(diary.images[i]);
                image_ids.push(get_thumb_path(diary.images[i]));
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
                var delete_set = {};
                for(var i = 0; i < files.length; i++) {
                    delete_set[files[i]] = true;
                }
                for(var i = 0; i < image_ids.length; i++) {
                    delete delete_set[image_ids[i]];
                }
                var total_number = Object.keys(delete_set).length;
                var counter = 0;
                for(var key in delete_set) {
                    fs.unlink(path.join(image_path, key), function () {
                        counter++;
                        if (counter >= total_number) {
                            callback();
                        }
                    });
                }
            });
        });
    });
};