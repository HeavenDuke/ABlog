/**
 * Created by obscurity on 16-12-6.
 */
let qiniu = require('node-qiniu');
let config = require('../config/config')();
let exec = require('child_process').exec;
let path = require('path');
require("../libs/date")();
let archiver = require('archiver');
let fs = require('fs');
const backup_path = path.join(config.baseDir, "backups/backup.zip");
const database_path = path.join(config.baseDir, "database");

const make_backup = function (callback) {
    let database = "ablog";
    let collections = ["Diaries", "Journals", "Users", "Articles", "Guests",
        "Projects", "VisitRecords", "Columns", "Writings", "Comments", "Photos", "Links", "Stat"];
    let count = 0;
    collections.forEach(function (collection) {
        let command = "mongoexport -d " + database + " -c " + collection + " > " + database_path + "/" + collection + ".json";
        exec(command, function (err) {
            if (!err) {
                count++;
                if (count == collection.length) {
                    return callback(null);
                }
            }
            else {
                return callback(err);
            }
        });
    });
};

const make_zips = function (callback) {
    let compressed_paths = [{
        path: path.join(config.baseDir, "public/uploads"),
        type: "dir"
    }, {
        path: path.join(config.baseDir, "database"),
        type: "dir"
    }];
    let output = fs.createWriteStream(backup_path);
    let archive = archiver("zip", {store: true});

    archive.on("end", function () {
        console.log("finish compression");
        return callback(null);
    });

    archive.on("error", function (err) {
        return callback(err);
    });

    archive.pipe(output);

    compressed_paths.forEach(function (f) {
        if (f.type == "dir") {
            archive.directory(f.path);
        }
        else if (f.type == "file") {
            archive.file(f.path, {name: f.path});
        }
    });

    archive.finalize();
};

module.exports = function (callback) {

    qiniu.config({
        access_key: config.qiniu.access_key,
        secret_key: config.qiniu.secret_key
    });

    qiniu.set("uploadUrl", "up.qiniu.com");

    let bucket = qiniu.bucket(config.qiniu.backup_bucket);

    const uploaded_name = new Date().format('yyyyMMddhhmmss') + '-backup.zip';

    make_backup(function (err) {
        if (err) {
            callback(err);
        }
        else {
            make_zips(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    bucket.putFile(uploaded_name, backup_path, function (err, reply) {
                        console.log(reply);
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null, reply);
                        }
                    });
                }
            });
        }
    });
};