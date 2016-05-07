/**
 * Created by Obscurity on 2016/5/2.
 */


exports.init = function (database) {
    var User = database.models.user;
    var user = new User();
    user.username = "HeavenDuke";
    user.password = "md5$11111195$378BF8EB624C64A198A00C299B82CF41";
    user.save();
    console.log('finish deploying database seed.');
};