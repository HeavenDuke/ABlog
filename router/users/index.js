/**
 * Created by Obscurity on 2016/3/20.
 */
var userController = require('../../controller').user;

module.exports = function(app) {

    app.get('/user/login', userController.loginView);

    app.get('/user/edit', userController.edit);

    app.put('/user', userController.update);

    app.post('/user', userController.loginAction);

    app.del('/user', userController.logoutAction);
};