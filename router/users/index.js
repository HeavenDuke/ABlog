/**
 * Created by Obscurity on 2016/3/20.
 */
var userController = require('../../controller').user;
var authentication = require('../../middlewares/authentication');

module.exports = function(app) {

    app.get('/user/login', userController.loginView);

    app.get('/user/edit', authentication, userController.edit);

    app.put('/user', authentication, userController.update);

    app.post('/user/login', userController.loginAction);

    app.del('/user', authentication, userController.logoutAction);
};