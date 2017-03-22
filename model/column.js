"use strict";
/**
 * Created by Obscurity on 2016/5/28.
 */

let Column = {};

Column.Schema = {
    name: {
        type: String,
        required: true
    },
    introduction: {
        type: String,
        required: false
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    tags: [require('./tag').Schema]
};

Column.collection = {
    collection: 'Columns'
};

Column.keywords = function () {
    let result = [];
    this.tags.forEach(function (tag) {
        result.push(tag.name);
    });
    return result;
};


module.exports = Column;