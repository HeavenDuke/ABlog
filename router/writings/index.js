/**
 * Created by heavenduke on 16-7-7.
 */

var writings_controller = require('../../controller').writings;
var authentication = require('../../middlewares/authentication');
var set_redirection = require('../../middlewares/set_redirection');
var visit_recorder = require('../../middlewares/visit_recorder');

module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "writing";
        yield next;
    };
    
    app.get('writings-index', '/writings', visit_recorder, set_redirection, authentication.admin_only, current_module, writings_controller.index);

    app.get('writings-show', '/writings/:date', visit_recorder, authentication.admin_only, current_module, writings_controller.show);
    
    app.put('writings-update', '/writings', visit_recorder, authentication.admin_only, current_module, writings_controller.update);
    
};