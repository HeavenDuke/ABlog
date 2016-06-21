/**
 * Created by Obscurity on 2016/6/21.
 */

var rss_controller = require('../../../controller').rss.journals;

module.exports = function (app) {

    app.get('rss-journals-detail', '/rss/journals', rss_controller.show);

};