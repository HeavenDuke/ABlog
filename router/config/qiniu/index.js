/**
 * Created by Obscurity on 2017/4/16.
 */
"use strict";
let qiniu_controller = require('../../../controller').config.qiniu;
let authentication = require('../../../middlewares/authentication');
let visit_recorder = require('../../../middlewares/visit_recorder');

module.exports = function(app) {

    app.get('qiniu-index', '/qiniu', visit_recorder, authentication.admin_only,  qiniu_controller.index);

};