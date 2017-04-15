/**
 * Created by Obscurity on 2017/4/16.
 */
"use strict";

let qiniu = require('qiniu');
let config = require('../../../config/config')();
exports.index = function *(next) {

    let filename = this.request.query.filename;
    let bucket = config.qiniu.image_bucket;

    qiniu.conf.ACCESS_KEY = config.qiniu.access_key;
    qiniu.conf.SECRET_KEY = config.qiniu.secret_key;

    let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + filename);

    this.body = {
        token: putPolicy.token()
    };
};