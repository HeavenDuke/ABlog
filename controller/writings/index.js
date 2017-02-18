"use strict";
/**
 * Created by heavenduke on 16-7-7.
 */

exports.index = function *(next) {
    this.render('writings/index', {
        title: "每日码字统计",
        current_module: this.current_module,
        current_guest: this.session.guest,
        current_user: this.session.user
    })
};

exports.show = function *(next) {
    let Writing = global.database.models.writing;
    let date = new Date(this.params.date);
    date.setHours(0, 0, 0);
    let writing = yield Writing.findOne({date: date});
    this.body = writing ? writing.count : 0;
};

exports.update = function *(next) {
    let Writing = global.database.models.writing;
    let date = new Date(this.request.body.date);
    date.setHours(0, 0, 0);
    console.log(date);
    let writing = yield Writing.findOne({date: date});
    if (!writing) {
        writing = new Writing();
        writing.date = date;
    }
    writing.count = parseInt(this.request.body.count);
    writing.save();
    this.redirect(this.app.url('writings-index'));
};