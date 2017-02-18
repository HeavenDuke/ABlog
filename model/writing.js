"use strict";
/**
 * Created by heavenduke on 16-7-7.
 */

let Writing = {};

Writing.Schema = {
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    count: {
        type: Number,
        required: true,
        default: 0
    }
};

Writing.collection = {
    collection: 'Writings'
};

module.exports = Writing;