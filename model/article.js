"use strict";
/**
 * Created by Obscurity on 2016/5/28.
 */


let Article = {};

Article.Schema = {
    title: {
        type: String,
        required: true
    },
    read_count: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    order: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    content: {
        type: String,
        required: false
    },
    comment_count: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    likes_count: {
        type: Number,
        required: true,
        default: 0
    },
    dislikes_count: {
        type: Number,
        required: true,
        default: 0
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
    column_id: {
        type: require('mongoose').Schema.ObjectId,
        required: false
    },
    tags: [require('./tag').Schema]
};

Article.collection = {
    collection: 'Articles'
};

module.exports = Article;