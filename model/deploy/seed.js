/**
 * Created by Obscurity on 2016/5/2.
 */

var database = require('../index').loader;

var init = function () {

    function initUser() {
        var User = database.models.user;
        var user = new User();
        user.username = "HeavenDuke";
        user.password = "md5$11111195$378BF8EB624C64A198A00C299B82CF41";
        user.email = "trashlhc@163.com";
        user.sex = "trashlhc@163.com";
        user.specialities = "trashlhc@163.com";
        user.current_position = "trashlhc@163.com";
        user.favorites = "trashlhc@163.com";
        user.save();
    }

    function initStat() {
        var Stat = database.models.stat;
        var stat = new Stat();
        stat.save();
    }

    var mongoose = require('mongoose');
    mongoose.connect(require('../../config/config')().mongodb);
    initUser();
    // initStat();
    console.log('finish deploying database seed.');
    mongoose.disconnect();
};

init();