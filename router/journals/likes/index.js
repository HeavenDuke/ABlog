/**
 * Created by Obscurity on 2016/5/11.
 */

let likes_controller = require("../../../controller").journals.likes;
let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {
    app.post('journal-likes', '/journals/:journal_id/likes', visit_recorder, authentication.guest_only, likes_controller.create);
};