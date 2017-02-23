"use strict";
/**
 * Created by Obscurity on 2016/3/20.
 */

let links_controller = require('../../controller').links;
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');
let visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    app.post('links-create', '/links', visit_recorder, authentication.admin_only, links_controller.create);

    app.del('links-destroy', '/links/:link_id', visit_recorder, authentication.admin_only, links_controller.destroy);

};