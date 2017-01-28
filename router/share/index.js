/**
 * Created by heavenduke on 17-1-28.
 */

let share_controller = require('../../controller').share;
let authentication = require('../../middlewares/authentication');
let set_redirection = require('../../middlewares/set_redirection');

module.exports = function(app) {

    app.get('load-share-stat', '/shares', share_controller.show);

    app.post('update-share-stat', '/shares', share_controller.update);

};