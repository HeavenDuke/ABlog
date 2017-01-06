/**
 * Created by heavenduke on 16-8-13.
 */
var photos_controller = require('../../controller').photos;
var authentication = require('../../middlewares/authentication');
var set_redirection = require('../../middlewares/set_redirection');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "photo";
        yield next;
    };

    app.get('photos-index', '/photos', visit_recorder, set_redirection, current_module, photos_controller.index);

    app.post('photos-create', '/photos', visit_recorder, authentication.admin_only, set_redirection, current_module, photos_controller.create);

    app.delete('photos-destroy', '/photos', visit_recorder, authentication.admin_only, set_redirection, current_module, photos_controller.destroy);


};