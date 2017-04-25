"use strict";

/**
 * Created by Obscurity on 2016/5/17.
 */

'use strict';

module.exports = async (ctx, next) => {
    let VisitRecord = global.database.models.visit_record;
    let current_date = VisitRecord.ignore_minute(new Date(Date.now()));
    let visit_record = await VisitRecord.findOne({date: current_date, path: ctx.request.path, method: ctx.request.method});
    if (visit_record) {
        visit_record.times = visit_record.times + 1;
        visit_record.save();
    }
    else {
        visit_record = new VisitRecord({times: 1, date: current_date, path: ctx.request.path, method: ctx.request.method});
        visit_record.save();
    }
    await next();
};