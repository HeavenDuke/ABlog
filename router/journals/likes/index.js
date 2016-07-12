/**
 * Created by Obscurity on 2016/5/11.
 */

var likes_controller = require("../../../controller").journals.likes;
var authentication = require('../../../middlewares/authentication');
var visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {
    app.post('journal-likes', '/journals/:journal_id/likes', visit_recorder, authentication.guest_only, likes_controller.create);
};