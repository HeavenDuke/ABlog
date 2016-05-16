/**
 * Created by Obscurity on 2016/5/17.
 */

module.exports = function *(next) {
    var VisitRecord = global.database.models.visit_record;
    console.log(VisitRecord.ignore_minute(new Date(Date.now())))
    var current_date = VisitRecord.ignore_minute(new Date(Date.now()));
    var visit_record = yield VisitRecord.findOne({date: current_date, path: this.request.path, method: this.request.method});
    if (visit_record) {
        visit_record.times = visit_record.times + 1;
        visit_record.save();
    }
    else {
        visit_record = new VisitRecord({times: 1, date: current_date, path: this.request.path, method: this.request.method});
        visit_record.save();
    }
    yield next;
};