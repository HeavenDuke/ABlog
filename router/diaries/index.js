/**
 * Created by Obscurity on 2016/5/11.
 */

var diariesController = require('../../controller').diary;
var authentication = require('../../middlewares/authentication');


module.exports = function(app) {

    var current_module = function *(next) {
        this.current_module = "diary";
        yield next;
    };

    app.get('diaries-list', '/diaries', current_module, diariesController.index);

    app.post('diaries-create', '/diaries', current_module, authentication, diariesController.create);

    app.put('diaries-update', '/diaries/:diary_id', current_module, authentication, diariesController.update);

    app.del('diaries-destroy', '/diaries/:diary_id', current_module, authentication, diariesController.destroy);

};