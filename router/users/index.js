/**
 * Created by Obscurity on 2016/3/20.
 */
var userController = require('../../controller').users;
var authentication = require('../../middlewares/authentication');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    app.get('/user/login', visit_recorder, userController.loginView);

    app.get('/user/edit', visit_recorder, authentication, userController.edit);

    app.put('/user', visit_recorder, authentication, userController.update);

    app.post('/user/login', visit_recorder, userController.loginAction);

    app.del('/user', visit_recorder, authentication, userController.logoutAction);
};