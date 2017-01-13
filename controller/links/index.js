/**
 * Created by heavenduke on 17-1-13.
 */

let create = function *(next) {
    let Link = global.database.models.link;
    let link = new Link();
    link.name = this.request.body.name;
    link.url = this.request.body.url;
    link.save();
    this.redirect("/");
};

let destroy = function *(next) {
    let Link = global.database.models.link;
    let link = yield Link.findById(this.params.link_id);
    link.remove();
    this.redirect("/");
};

module.exports = {
    create: create,
    destroy: destroy
};