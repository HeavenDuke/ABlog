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
    return new Date(date.format('yyyy/MM/dd hh'));
};

module.exports = VisitRecord;