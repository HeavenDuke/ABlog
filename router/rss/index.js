/**
 * Created by Obscurity on 2016/6/21.
 */

var rss_controller = require('../../controller').rss;
var rss_journal_router = require('./journals');
var rss_column_router = require('./columns');

module.exports = function (app) {

    app.get('rss-detail', '/rss', rss_controller.show);

    rss_journal_router(app);

    rss_column_router(app);

};