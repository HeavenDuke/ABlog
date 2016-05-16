/**
 * Created by Obscurity on 2016/5/16.
 */

var VisitRecord = {};

VisitRecord.Schema = {
    times: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
};

VisitRecord.collection = {
    collection: 'VisitRecords'
};

VisitRecord.ignore_minute = function (date) {
    var ignored_date = new Date(date.format('yyyy-MM-dd hh:00:00'));
    var year = ignored_date.getFullYear();
    var month = ignored_date.getMonth();
    var day = ignored_date.getDate();
    var hour = ignored_date.getHours();
    return Date.UTC(year, month, day, hour);
};

module.exports = VisitRecord;