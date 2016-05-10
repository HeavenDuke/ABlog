/**
 * Created by Obscurity on 2016/5/11.
 */

var likesController = require("../../../controller").journal.likes;

module.exports = function (app) {
    app.post('journal-likes', '/journals/:journal_id/likes', likesController.create);
};