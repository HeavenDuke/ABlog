/**
 * Created by heavenduke on 16-6-29.
 */

var images_controller = require('../../controller').images;

module.exports = function (app) {
    app.post("images-create", "/images", images_controller.index);
};