/**
 * Created by heavenduke on 16-7-11.
 */

var notifications_controller = require('../../controller').notifications;
var authentication = require('../../middlewares/authentication');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('notification-index', '/notifications', visit_recorder, authentication, notifications_controller.index);

};