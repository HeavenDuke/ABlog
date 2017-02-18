/**
 * Created by Obscurity on 2016/5/2.
 */

let database = require('../index').loader;

let init = function () {

    function initUser() {
        let User = database.models.user;
        let user = new User();
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
        let Stat = database.models.stat;
        let stat = new Stat();
        stat.save();
    }

    let mongoose = require('mongoose');
    mongoose.connect(require('../../config/config')().mongodb);
    initUser();
    initStat();
    console.log('finish deploying database seed.');
    mongoose.disconnect();
};

init();