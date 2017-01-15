/**
 * Created by Obscurity on 2016/5/2.
 */

let database = require('../index').loader;
let image_tools = require('../../libs/image');
let fs = require('fs');
let conf = require('../../config/config')();
let path = require('path');
let gm = require('gm').subClass({imageMagick: true});

let migrate = function () {

    function migratePhoto() {
        let Photo = database.models.photo;
        Photo.find({}).then(function (photos) {
            for(let index in photos) {
                let image = photos[index].path;
                let real_preview_path = path.join(conf.staticDir, "uploads", image_tools.get_preview_path(image));
                let real_path = path.join(conf.staticDir, "uploads", image);
                if (!fs.existsSync(real_preview_path)) {
                    gm(real_path).size(function (err, size) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            let preview_size = 800;
                            let preview_scale = preview_size / Math.min(size.width, size.height);
                            let preview_width = size.width * preview_scale, preview_height = size.height * preview_scale;
                            gm(real_path).resize(preview_width, preview_height).autoOrient().crop(preview_size, preview_size, (preview_width - preview_size) / 2, (preview_height - preview_size) / 2).write(real_preview_path, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("done");
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    
    function migrateJournal() {
        let Journal = database.models.journal;
        let Comment = database.models.comment;
        let journals = Journal.find({});
        for(let index in journals) {
            journals[index].comment_count = Comment.find({journal_id: journals[index]._id}).count();
            journals[index].save();
        }
    }

    let mongoose = require('mongoose');
    mongoose.connect(require('../../config/config')().mongodb);
    // migrateJournal();
    migratePhoto();
    console.log('finish migrating database seed.');
    mongoose.disconnect();
};

migrate();