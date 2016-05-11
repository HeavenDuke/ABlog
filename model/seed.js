/**
 * Created by Obscurity on 2016/5/2.
 */

var database = require('../model').loader;

var init = function () {

    function initUser() {
        var User = database.models.user;
        var user = new User();
        user.username = "HeavenDuke";
        user.password = "md5$11111195$378BF8EB624C64A198A00C299B82CF41";
        user.save();
    }

    function initDiary() {
        //var Diary = database.models.diary;
        //var diary = new Diary();
        //diary.brief = "HeavenDuke";
        //diary.content = "md5$11111195$378BF8EB624C64A198A00C299B82CF41";
        //diary.save();
    }

    var mongoose = require('mongoose');
    mongoose.connect(require('../config/config')().mongodb);
    initUser();
    initDiary();
    console.log('finish deploying database seed.');
    mongoose.disconnect();
};

init();