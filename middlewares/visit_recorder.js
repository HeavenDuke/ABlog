/**
 * Created by Obscurity on 2016/5/17.
 */

module.exports = function *(next) {
    let VisitRecord = global.database.models.visit_record;
    let current_date = VisitRecord.ignore_minute(new Date(Date.now()));
    let visit_record = yield VisitRecord.findOne({date: current_date, path: this.request.path, method: this.request.method});
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