"use strict";
/**
 * Created by heavenduke on 17-1-13.
 */

let Link = {};

Link.Schema = {
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
};

Link.collection = {
    collection: 'Links'
};

module.exports = Link;