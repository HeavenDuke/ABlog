/**
 * Created by heavenduke on 16-7-11.
 */

let notifications_controller = require('../../controller').notifications;
let authentication = require('../../middlewares/authentication');
let visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function (app) {

    app.get('notifications-index', '/notifications', visit_recorder, authentication.cross_auth, notifications_controller.index);

};