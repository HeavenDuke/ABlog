/**
 * Created by heavenduke on 17-1-28.
 */

let shares_controller = require('../../controller').shares;
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');

module.exports = function(app) {

    app.get('load-share-stat', '/shares', shares_controller.show);

    app.post('update-share-stat', '/shares', shares_controller.update);

};