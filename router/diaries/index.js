/**
 * Created by Obscurity on 2016/5/11.
 */

let diaries_controller = require('../../controller').diaries;
let authentication = require('../../middlewares/authentication');
let path = require('path');
let config = require('../../config/config')();
let visit_recorder = require('../../middlewares/visit_recorder');
let set_redirection = require('../../middlewares/set_redirection');

module.exports = function(app) {

    let current_module = function *(next) {
        this.current_module = "diary";
        yield next;
    };

    app.get('diaries-index', '/diaries', visit_recorder, set_redirection, current_module, diaries_controller.index);

    app.post('diaries-create', '/diaries', visit_recorder, current_module, authentication.admin_only, diaries_controller.create);

    app.put('diaries-update', '/diaries/:diary_id', visit_recorder, current_module, authentication.admin_only, diaries_controller.update);

    app.del('diaries-destroy', '/diaries/:diary_id', visit_recorder, current_module, authentication.admin_only, diaries_controller.destroy);

};