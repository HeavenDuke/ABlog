/**
 * Created by Obscurity on 2016/5/11.
 */

var likesController = require("../../../controller").journal.likes;
var visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function (app) {
    app.post('journal-likes', '/journals/:journal_id/likes', visit_recorder, likesController.create);
};