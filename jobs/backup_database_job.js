/**
 * Created by obscurity on 16-12-6.
 */

var qiniu = require('qiniu');
var config = require('../config/config')();
qiniu.conf.ACCESS_KEY = config.qiniu.access_key;
qiniu.conf.SECRET_KEY = config.qiniu.secret_key;

module.exports = function (callback) {

    const uploaded_name = new Date().format('yyyy-MM-dd-hh-mm-ss') + '-backup.zip';
    const update_token = function (bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return putPolicy.token();
    }

    var token = update_token(config.qiniu.backup_bucket, key);


};