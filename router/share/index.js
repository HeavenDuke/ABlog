"use strict";
/**
 * Created by heavenduke on 17-1-28.
 */

let shares_controller = require('../../controller').shares;
let set_redirection = require('../../middlewares/set_redirection');

module.exports = function(app) {

    app.get('shares-index', '/shares', shares_controller.show);

    app.post('shares-update', '/shares', shares_controller.update);

};