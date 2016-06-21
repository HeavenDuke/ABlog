/**
 * Created by Obscurity on 2016/6/21.
 */

var rss_controller = require('../../../controller').rss.columns;

module.exports = function (app) {

    app.get('rss-columns-detail', '/rss/columns', rss_controller.show);

};