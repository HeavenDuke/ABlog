"use strict";
/**
 * Created by Obscurity on 2016/5/16.
 */

let VisitRecord = {};

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
    let ignored_date = new Date(date.format('yyyy-MM-dd hh:00:00'));
    let year = ignored_date.getFullYear();
    let month = ignored_date.getMonth();
    let day = ignored_date.getDate();
    let hour = ignored_date.getHours();
    return Date.UTC(year, month, day, hour);
};

module.exports = VisitRecord;