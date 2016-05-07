/**
 * Created by Obscurity on 2016/5/2.
 */

var database = require('../model').loader;



(function () {
    (function connectDb(){
        require('mongoose').connect(require('../config/config')().mongodb, {
            server: {
                poolSize: 12,
                socketOptions: {
                    keepAlive: 1
                }
            }
        });
    })();
    var User = database.models.user;
    var user = new User();
    user.username = "HeavenDuke";
    user.password = "md5$11111195$378BF8EB624C64A198A00C299B82CF41";
    user.save();
    console.log('finish deploying database seed.');
})();